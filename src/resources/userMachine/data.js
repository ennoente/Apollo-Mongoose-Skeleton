import knex from '../../knex';
import {getSQLTable} from '../../joinMasterUtil';
import idx from 'idx';
import SqlString from 'sqlstring';
import {ForbiddenError} from 'apollo-server';
import { GraphQLSchema } from "../../app";
import assert from 'assert';

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


export const createUserMachine = async (parent, args, ctx, info) => {
    const userMachineTable = getSQLTable('UserMachine');
    const sysMachineTable = getSQLTable('SysMachine');
    const {userId} = ctx.jwt;
    const {sysMachineId, roomId} = args.input;

    //const authorizationFunc = ctx.schema._typeMap.Mutation._fields.createUserMachine.authorization;

    //const authorizationFunc = idx(ctx, _ => _.schema._typeMap.Mutation._fields.createUserMachine.authorization); // TODO Make generic
    const authorizationFunc = idx(GraphQLSchema, _ => _._typeMap.Mutation._fields.createUserMachine.authorization); // TODO Make generic


    if (authorizationFunc) {
        console.log("Calling authorize()");
        await authorize(authorizationFunc, args, ctx);
    }

    const authObj = authorizationFunc(args, ctx);

    console.log("authObj", authObj);


    const [newUserMachine] = await knex(userMachineTable)
        .insert({
            //...input,
            sys_machine_id: sysMachineId,
            user_room_id: roomId,
            sys_user_id: userId
        });

    //const result = await knex.raw(
    //    `SELECT * FROM `
    //)

    //const result = await knex(userMachineTable)
    //    .crossJoin(sysMachineTable, `${sysMachineTable}.id`, '=', sysMachineId);
    //    .cross

    console.log("returning", newUserMachine);
    return newUserMachine;
}