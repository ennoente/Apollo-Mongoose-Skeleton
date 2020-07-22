import {
    extendJmQuery,
    addJmType,
    extendJmMutation
} from 'join-monster-modularizer';
import {
    graphql,
    parse,
    ParseOptions
} from 'graphql';
import {
    GraphQLSchema
} from '../app';
import {
    genericCreateResolver
} from '../resources/util';
import knex from '../knex';
import moment from 'moment';

addJmType('DueUserMaintenance', {
    sqlTable: 'due_user_maintenance',
    uniqueKey: 'id',
    fields: {
        name: {
            sqlColumn: 'name'
        },
        description: {
            sqlColumn: 'description'
        },
        startDate: {
            sqlColumn: 'start_date'
        },
        itrInterval: {
            sqlColumn: 'itr_interval'
        },
        lastChecked: {
            sqlColumn: 'last_checked'
        },
        dueUntil: {
            sqlColumn: 'due_until'
        },
        user: {
            sqlJoin: (mTable, userTable) => `${mTable}.sys_user_id = ${userTable}.id`
        },
        machine: {
            sqlJoin: (mTable, userMachineTable) => `${mTable}.user_machine_id = ${userMachineTable}.id`
        }
    }
})

extendJmMutation('markDueMaintenanceAsDone', {
    refType: 'DueUserMaintenance',
    authorization: ({
        id
    }, ctx) => ({
        'id': {
            refType: 'DueUserMaintenance',
            sqlRowExists: (table) => [`${table}.id = ${id} AND ${table}.sys_user_id = ${ctx.jwt.userId}`, 'DueUserMaintenance not found']
        }
    }),
    customResolve: async (args, ctx) => {
        const {
            id: maintenanceId,
            input: {
                successful,
                comment
            }
        } = args;
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log("date", currentDate);

        //return true;

        const {
            data
        } = await graphql(GraphQLSchema,
            `
            {
                me {
                    dueMaintenance(id: ${maintenanceId}) {
                        id
                        name
                        description
                        machine {
                            description
                            barcode
                            sysMachine {
                                name
                            }
                        }
                    }
                }
            }
            `, null, ctx);

        const maintenanceData = data.me.dueMaintenance;
        const machineData = maintenanceData.machine;

        ctx.transactionObj = await knex.transaction();

        const updateUserMaintenance = await graphql(GraphQLSchema,
            `
            mutation {
                updateUserMaintenance(id: ${maintenanceId}, input: {
                    lastChecked: "${currentDate}"
                })
            }
            `, null, ctx);
        if (!updateUserMaintenance.data.updateUserMaintenance) throw new Error('Failed to update database');

        const createFinishedUserMaintenance = await graphql(GraphQLSchema,
            `
                mutation {
                    createFinishedUserMaintenance(input: {
                        maintenanceId: ${maintenanceData.id}
                        maintenanceName: "${maintenanceData.name}"
                        maintenanceDescription: "${maintenanceData.description}"

                        userId: ${ctx.jwt.userId}
                        username: "${ctx.jwt.username}"

                        machineName: "${machineData.sysMachine.name}"
                        machineDescription: "${machineData.description}"
                        machineBarcode: "${machineData.barcode}"

                        comment: "${comment}"
                        successful: ${successful}

                        finishedAt: "${currentDate}"
                    })
                }
                `, null, ctx);

        if (createFinishedUserMaintenance.errors) {
            console.error("Rolling back transaction...");
            trx.rollback();
            throw new Error("Failed to mark the maintenance as done.");
        }

        await ctx.transactionObj.commit();
        return true;
    }
})

extendJmQuery('dueUserMaintenances', {
    authorization: ({
        userId
    }, ctx) => ({
        'userId': {
            credentialsMatch: () => [userId === ctx.jwt.userId, 'Not you!!!']
        }
    }),
    where: (table, {
        userId
    }) => {
        return `${table}.sys_user_id = ${userId}`
    }
})