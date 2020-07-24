"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUserMachine = void 0;

var _knex = _interopRequireDefault(require("../../knex"));

var _joinMasterUtil = require("../../joinMasterUtil");

var _idx = _interopRequireDefault(require("idx"));

var _sqlstring = _interopRequireDefault(require("sqlstring"));

var _apolloServer = require("apollo-server");

var _app = require("../../app");

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
const getSqlTableFromReferencedField = (authObj, mutationName, inputField) => {
    console.log("inputField", inputField);

    const referencedType = authObj[inputField].refType;
    const sqlTable = idx(GraphQLSchema, _ => _._typeMap[referencedType]._typeConfig.sqlTable);

    assert(sqlTable, 'No sqlTable found!');

    return sqlTable;
};
 */

/**
 *
 * 1. All credentialsMatch functions must return true
 * 2. The combined SQL for sqlRowExists functions must return 1 on all resulting rows
 *
 * @param args The user's input
 * @param context The context provided for all resolvers (contains JWT)
 */

/*
const authorize = async (authorizationFunc, args, context) => {
    const authObj = authorizationFunc(args, context);
    const {input} = args;

    //const sqlExistArr = [];
    const sqlSelections = [];

    // 1. Iterate through input and call all credentialsMatch functions
    // Simultaneously build SQL command from the sqlRowExists functions
    for (let inputField in input) {
        const authField = authObj[inputField];
        const {credentialsMatch, sqlRowExists} = authField;

        if (credentialsMatch) {
            console.log(`credentialsMatch function exists for key ${inputField}`);
            const [success, errorMessage] = credentialsMatch();

            if (!success) {
                throw new ForbiddenError(errorMessage);
            }
        }

        // Add to sqlExistArr
        if (sqlRowExists) {
            console.log(`sqlRowExists exists for key ${inputField}`);
            const sqlTable = getSqlTableFromReferencedField(authObj, 'createUserMachine', inputField);
            const [sqlCommand, errorMessage] = sqlRowExists(sqlTable);

            sqlSelections.push({
                sqlCommand: sqlCommand,
                sqlTable: sqlTable,
                errorMessage: errorMessage
            });
        }

    }

    // If no SQL checks have to be made, just continue
    if (sqlSelections.length === 0)
        return;

    let rawSelectCommand = '';
    let bindings = [];

    // 2. Iterate through sqlSelections and build SQL
    sqlSelections.forEach((sqlSelection, index) => {
        const { sqlTable, sqlCommand } = sqlSelection;

        if (index === 0)
            rawSelectCommand += 'SELECT EXISTS ? AS present';
        else
            rawSelectCommand += ' UNION ALL SELECT EXISTS ?';

        bindings.push(
            knex(sqlTable)
                .select('id')
                .whereRaw(sqlCommand)
        )
    });


    // Fetch results via knex
    const [ results ] = await knex.raw(
        rawSelectCommand,
        bindings
    );


    // Iterate over results and throw appropriate error message when a `present` value is 0
    results.forEach(({ present }, index) => {
        if (present === 0)
            throw new ForbiddenError(sqlSelections[index].errorMessage);
    });
};
 */
const createUserMachine = async (parent, args, ctx, info) => {
  const userMachineTable = (0, _joinMasterUtil.getSQLTable)('UserMachine');
  const sysMachineTable = (0, _joinMasterUtil.getSQLTable)('SysMachine');
  const {
    userId
  } = ctx.jwt;
  const {
    sysMachineId,
    roomId
  } = args.input; //const authorizationFunc = ctx.schema._typeMap.Mutation._fields.createUserMachine.authorization;
  //const authorizationFunc = idx(ctx, _ => _.schema._typeMap.Mutation._fields.createUserMachine.authorization); // TODO Make generic

  const authorizationFunc = (0, _idx.default)(_app.GraphQLSchema, _ => _._typeMap.Mutation._fields.createUserMachine.authorization); // TODO Make generic

  if (authorizationFunc) {
    console.log("Calling authorize()");
    await authorize(authorizationFunc, args, ctx);
  }

  const authObj = authorizationFunc(args, ctx);
  console.log("authObj", authObj);
  const [newUserMachine] = await (0, _knex.default)(userMachineTable).insert({
    //...input,
    sys_machine_id: sysMachineId,
    user_room_id: roomId,
    sys_user_id: userId
  }); //const result = await knex.raw(
  //    `SELECT * FROM `
  //)
  //const result = await knex(userMachineTable)
  //    .crossJoin(sysMachineTable, `${sysMachineTable}.id`, '=', sysMachineId);
  //    .cross

  console.log("returning", newUserMachine);
  return newUserMachine;
};

exports.createUserMachine = createUserMachine;