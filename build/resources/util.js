"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withAuth = exports.genericQueryResolver = exports.customResolver = exports.genericCreateResolver = exports.genericUpdateResolver = exports.genericDeleteResolver = void 0;

var _apolloServer = require("apollo-server");

var _index = _interopRequireDefault(require("../../lib/join-monster/src/index.js"));

var _knex = _interopRequireDefault(require("../knex"));

var _joinMasterUtil = require("../joinMasterUtil");

var _app = require("../app");

var _idx = _interopRequireDefault(require("idx"));

var _assert = _interopRequireDefault(require("assert"));

var _flat = _interopRequireDefault(require("flat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import joinMonster from '../../../lib-dev/join-monster/src/index.js';

/**
 *
 * 1. All credentialsMatch functions must return true
 * 2. The combined SQL for sqlRowExists functions must return 1 on all resulting rows
 *
 * @param authorizationFunc
 * @param args The user's input
 * @param context The context provided for all resolvers (contains JWT)
 */
const authorize = async (authorizationFunc, args, context) => {
  const authObj = authorizationFunc(args, context);
  const input = (0, _flat.default)(args); //console.log("Authorizing...", authObj);

  if (!authObj) return;
  const sqlSelections = []; // 1. Iterate through input and call all credentialsMatch functions
  // Simultaneously build SQL command from the sqlRowExists functions

  for (let inputField in input) {
    const authField = authObj[inputField]; // If no specific authorization rules are set for this field just continue

    if (!authField) continue;
    const {
      credentialsMatch,
      sqlRowExists
    } = authField;

    if (credentialsMatch) {
      console.log("RUNNING"); //console.log(`credentialsMatch function exists for key ${inputField}`);

      const [success, errorMessage] = credentialsMatch();

      if (!success) {
        throw new _apolloServer.ForbiddenError(errorMessage);
      }
    } // Add to sqlExistArr


    if (sqlRowExists) {
      //console.log(`sqlRowExists exists for key ${inputField}`);
      const sqlTable = getSqlTableFromReferencedField(authObj, 'createUserMachine', inputField);
      const [sqlCommand, errorMessage] = sqlRowExists(sqlTable);
      sqlSelections.push({
        sqlCommand: sqlCommand,
        sqlTable: sqlTable,
        errorMessage: errorMessage
      });
    }
  } // If no SQL checks have to be made, just continue


  if (sqlSelections.length === 0) return;
  let rawSelectCommand = '';
  let bindings = []; // 2. Iterate through sqlSelections and build SQL

  sqlSelections.forEach((sqlSelection, index) => {
    const {
      sqlTable,
      sqlCommand
    } = sqlSelection;
    if (index === 0) rawSelectCommand += 'SELECT EXISTS ? AS present';else rawSelectCommand += ' UNION ALL SELECT EXISTS ?';
    bindings.push((0, _knex.default)(sqlTable).select('id').whereRaw(sqlCommand));
  }); // Fetch results via knex

  const [results] = await _knex.default.raw(rawSelectCommand, bindings); // Iterate over results and throw appropriate error message when a `present` value is 0

  results.forEach(({
    present
  }, index) => {
    if (present === 0) throw new _apolloServer.ForbiddenError(sqlSelections[index].errorMessage);
  });
};

const getSqlTableFromReferencedField = (authObj, mutationName, inputField) => {
  //console.log("inputField", inputField);
  const referencedType = authObj[inputField].refType;
  const sqlTable = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap[referencedType]._typeConfig.sqlTable);
  (0, _assert.default)(sqlTable, 'No sqlTable found!');
  return sqlTable;
};

const genericDeleteResolver = async (parent, args, ctx, info) => {
  const {
    fieldName
  } = info;
  const {
    id
  } = args;
  const referencedType = (0, _idx.default)(info, _ => _.parentType._fields[fieldName].refType);
  (0, _assert.default)(referencedType, `Referenced type ${fieldName} not found!`);
  const referencedSqlTable = (0, _joinMasterUtil.getSQLTable)(referencedType);
  (0, _assert.default)(referencedSqlTable, `Referenced type ${fieldName} has no SqlTable attribute!`);
  const authorizationFunction = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].authorization);
  if (authorizationFunction) await authorize(authorizationFunction, args, ctx); // Delete generically

  const results = await (0, _knex.default)(referencedSqlTable).where({
    id: id
  }).del(); //console.log("results", results);

  return results;
};

exports.genericDeleteResolver = genericDeleteResolver;

const genericUpdateResolver = async (parent, args, ctx, info) => {
  const {
    fieldName
  } = info;
  const {
    id,
    input
  } = args;
  const referencedType = (0, _idx.default)(info, _ => _.parentType._fields[fieldName].refType);
  (0, _assert.default)(referencedType, `Referenced type ${fieldName} not found!`);
  const referencedSqlTable = (0, _joinMasterUtil.getSQLTable)(referencedType);
  (0, _assert.default)(referencedSqlTable, `Referenced type ${fieldName} has no SqlTable attribute!`);
  const fieldMappings = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap[referencedType]._typeConfig.fieldMappings); //const fieldMappings = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].fieldMappings);

  const authorizationFunction = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].authorization);
  if (authorizationFunction) await authorize(authorizationFunction, args, ctx);
  let updateObjFunction = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].updateObj);
  let updateObj = {};

  if (updateObjFunction) {
    updateObj = updateObjFunction(args, ctx, info);
  } // Map input keys (coming from the API) to the corresponding sql columns


  if (fieldMappings) for (let inputKey in args.input ? args.input : args) // If the current input key exists in the field mappings put _this_
  // key into the insert function for knex
  updateObj[fieldMappings[inputKey] ? fieldMappings[inputKey] : inputKey] = args.input ? args.input[inputKey] : args[inputKey];else //updateObj = args.input ? args.input : args;
    Object.assign(updateObj, args.input ? args.input : args);
  let results;

  if (ctx.transactionObj) {
    // Update generically
    results = await ctx.transactionObj(referencedSqlTable).where({
      id: id
    }).update(updateObj);
  } else {
    // Update generically
    results = await (0, _knex.default)(referencedSqlTable).where({
      id: id
    }).update(updateObj);
  } //console.log("results", results);


  return results;
};

exports.genericUpdateResolver = genericUpdateResolver;

const genericCreateResolver = async (parent, args, ctx, info, name, transactionObj) => {
  //const {fieldName} = info || name;
  const fieldName = (0, _idx.default)(info, _ => _.fieldName) || name; //const referencedType = idx(info, _ => _.parentType._fields[fieldName].refType);

  const referencedType = (0, _idx.default)(_app.GraphQLSchema, _ => _._mutationType._fields[fieldName].refType);
  (0, _assert.default)(referencedType, `Referenced type ${fieldName} not found!`);
  const referencedSqlTable = (0, _joinMasterUtil.getSQLTable)(referencedType);
  (0, _assert.default)(referencedSqlTable, `Referenced type ${fieldName} has no SqlTable attribute!`); //const fieldMappings = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].fieldMappings);

  const fieldMappings = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap[referencedType]._typeConfig.fieldMappings); //const fieldMappings = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].fieldMappings);

  const authorizationFunction = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].authorization); //console.log("fieldMappings", fieldMappings);
  //console.log("auth function:", authorizationFunction);

  if (authorizationFunction) await authorize(authorizationFunction, args, ctx);
  let insertionObj = {}; // Map input keys (coming from the API) to the corresponding sql columns

  if (fieldMappings) for (let inputKey in args.input ? args.input : args) // If the current input key exists in the field mappings put _this_
  // key into the insert function for knex
  insertionObj[fieldMappings[inputKey] ? fieldMappings[inputKey] : inputKey] = args.input ? args.input[inputKey] : args[inputKey];else insertionObj = args.input ? args.input : args;
  let newResource;

  if (ctx.transactionObj) {
    newResource = await ctx.transactionObj(referencedSqlTable).insert(insertionObj);
  } else {
    newResource = await (0, _knex.default)(referencedSqlTable).insert(insertionObj);
  } // Insert generically
  //const [newResource] = await knex(referencedSqlTable)
  //    .insert(insertionObj)


  return newResource[0];
};

exports.genericCreateResolver = genericCreateResolver;

const customResolver = async (parent, args, ctx, info) => {
  const {
    fieldName
  } = info; //console.log("info", info);

  const referencedType = (0, _idx.default)(info, _ => _.parentType._fields[fieldName].refType);
  (0, _assert.default)(referencedType, `Referenced type ${fieldName} not found!`);
  const customResolveFunction = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].customResolve);
  (0, _assert.default)(customResolveFunction, `Custom resolver function not set for type ${fieldName}`);
  const referencedSqlTable = (0, _joinMasterUtil.getSQLTable)(referencedType);
  (0, _assert.default)(referencedSqlTable, `Referenced type ${fieldName} has no SqlTable attribute!`); //const fieldMappings = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].fieldMappings);

  const fieldMappings = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap[referencedType]._typeConfig.fieldMappings); //const fieldMappings = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].fieldMappings);

  const authorizationFunction = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].authorization); //console.log("fieldMappings", fieldMappings);

  if (authorizationFunction) await authorize(authorizationFunction, args, ctx);
  return await customResolveFunction(args, ctx);
};
/*
export const genericQueryResolver = async(parent, args, ctx, info) => {
    return joinMonster(info, ctx, async(sql) => knex.raw(sql).then(result => result[0]), { dialect: "mysql" });
};
*/


exports.customResolver = customResolver;

const genericQueryResolver = async (parent, args, ctx, info, fieldName) => {
  //const {fieldName} = info || fieldName;
  if (!fieldName) fieldName = info.fieldName; //console.log("info", info);
  //let referencedType = idx(info, _ => _.parentType._fields[fieldName].type);

  let referencedType = (0, _idx.default)(_app.GraphQLSchema, _ => _._queryType._fields[fieldName].type);
  if (referencedType.ofType) referencedType = referencedType.ofType;
  (0, _assert.default)(referencedType, `Referenced type ${fieldName} not found!`);
  const referencedSqlTable = (0, _joinMasterUtil.getSQLTable)(referencedType);
  (0, _assert.default)(referencedSqlTable, `Referenced type ${fieldName} has no SqlTable attribute!`); //const fieldMappings = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].fieldMappings);

  const fieldMappings = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap[referencedType]._typeConfig.fieldMappings); //const fieldMappings = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].fieldMappings);
  //const authorizationFunction = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].authorization);

  const authorizationFunction = (0, _idx.default)(_app.GraphQLSchema, _ => _._queryType._fields[fieldName].authorization); //console.log("fieldMappings", fieldMappings);

  if (authorizationFunction) await authorize(authorizationFunction, args, ctx);
  return (0, _index.default)(info, ctx, async _sql => {
    //console.log("info", info);
    const sql = _sql; //console.log("sql");
    //console.log(sql);
    //console.log("info", info);

    const [results] = await _knex.default.raw(sql); //console.log("results", results);

    return results; //const sql = _sql;
    ////console.log("sql", sql);
    //const [resultArr] = await knex.raw(sql);
    ////return resultArr[0];
    ////console.log("resultArr", resultArr);
    //return resultArr;
  }, {
    dialect: "mariadb"
  });
};
/**
 * withAuth(token, 'read:machines', (machine, continue) =>
 */


exports.genericQueryResolver = genericQueryResolver;

const withAuth = async (jwt, user, expectedScope, cb) => {
  if (!jwt) throw new _apolloServer.AuthenticationError('No valid JWT found. Please log in first');
  const scope = user._doc.scope;
  if (!scope.includes(expectedScope)) throw new _apolloServer.AuthenticationError('You do not have the permissions to do that');
  return cb();
};
/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/


exports.withAuth = withAuth;

function twoDigits(d) {
  if (0 <= d && d < 10) return "0" + d.toString();
  if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
  return d.toString();
}

Date.prototype.currentECTToMySQLDatetime = function () {
  return this.currentUTCToMySQLDatetime(2);
};
/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/


Date.prototype.currentUTCToMySQLDatetime = function (timezoneOffset) {
  return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours() + timezoneOffset) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};