import {AuthenticationError, ForbiddenError} from 'apollo-server';
import joinMonster from '../../lib/join-monster/src/index.js';
import knex from '../knex';
import {getSQLTable} from '../joinMasterUtil';
import {GraphQLSchema} from '../app';
import idx from "idx";
import assert from 'assert';

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
    const {input} = args;

    const sqlSelections = [];

    // 1. Iterate through input and call all credentialsMatch functions
    // Simultaneously build SQL command from the sqlRowExists functions
    for (let inputField in input) {
        const authField = authObj[inputField];

        // If no specific authorization rules are set for this field just continue
        if (!authField) continue;

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
        const {sqlTable, sqlCommand} = sqlSelection;

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
    const [results] = await knex.raw(
        rawSelectCommand,
        bindings
    );


    // Iterate over results and throw appropriate error message when a `present` value is 0
    results.forEach(({present}, index) => {
        if (present === 0)
            throw new ForbiddenError(sqlSelections[index].errorMessage);
    });
};

const getSqlTableFromReferencedField = (authObj, mutationName, inputField) => {
    console.log("inputField", inputField);

    const referencedType = authObj[inputField].refType;
    const sqlTable = idx(GraphQLSchema, _ => _._typeMap[referencedType]._typeConfig.sqlTable);

    assert(sqlTable, 'No sqlTable found!');

    return sqlTable;
};


export const genericCreateResolver = async (parent, args, ctx, info) => {
    console.log("info", info);
    const {fieldName} = info;

    console.log("info", info);

    const referencedType = idx(info, _ => _.parentType._fields[fieldName].refType);
    assert(referencedType, `Referenced type ${fieldName} not found!`)

    const referencedSqlTable = getSQLTable(referencedType);
    assert(referencedSqlTable, `Referenced type ${fieldName} has no SqlTable attribute!`);

    const fieldMappings = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].fieldMappings);
    const authorizationFunction = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields[fieldName].authorization);

    if (authorizationFunction)
        await authorize(authorizationFunction, args, ctx);

    let insertionObj = {};

    // Map input keys (coming from the API) to the corresponding sql columns
    if (fieldMappings)
        for (let inputKey in args.input ? args.input : args)
            // If the current input key exists in the field mappings put _this_
            // key into the insert function for knex
            insertionObj[fieldMappings[inputKey] ? fieldMappings[inputKey] : inputKey] = args.input ? args.input[inputKey] : args[inputKey];
    else
        insertionObj = args.input ? args.input : args;

    // Insert generically
    const [newResource] = await knex(referencedSqlTable)
        .insert(insertionObj);

    return newResource;
};

/*
export const genericQueryResolver = async(parent, args, ctx, info) => {
    return joinMonster(info, ctx, async(sql) => knex.raw(sql).then(result => result[0]), { dialect: "mysql" });
};
*/

export const genericQueryResolver = async (parent, args, ctx, info) =>
    joinMonster(info, ctx, async (sql) => {
        const [results] = await knex.raw(sql);
        return results;
        //const sql = _sql;
        ////console.log("sql", sql);
        //const [resultArr] = await knex.raw(sql);
        ////return resultArr[0];
        ////console.log("resultArr", resultArr);
        //return resultArr;
    }, {dialect: "mysql"})

/**
 * withAuth(token, 'read:machines', (machine, continue) =>
 */




export const withAuth = async (jwt, user, expectedScope, cb) => {
    if (!jwt) throw new AuthenticationError('No valid JWT found. Please log in first');

    const scope = user._doc.scope;

    if (!scope.includes(expectedScope)) throw new AuthenticationError('You do not have the permissions to do that');

    return cb();
}