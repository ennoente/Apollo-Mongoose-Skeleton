"use strict";

var _joinMonsterModularizer = require("join-monster-modularizer");

var _graphql = require("graphql");

var _app = require("../app");

var _util = require("../resources/util");

var _knex = _interopRequireDefault(require("../knex"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _joinMonsterModularizer.addJmType)('DueUserMaintenance', {
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
});
(0, _joinMonsterModularizer.extendJmMutation)('markDueMaintenanceAsDone', {
  refType: 'DueUserMaintenance',
  authorization: ({
    id
  }, ctx) => ({
    'id': {
      refType: 'DueUserMaintenance',
      sqlRowExists: table => [`${table}.id = ${id} AND ${table}.sys_user_id = ${ctx.jwt.userId}`, 'DueUserMaintenance not found']
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
    const currentDate = (0, _moment.default)().format('YYYY-MM-DD HH:mm:ss');
    console.log("date", currentDate); //return true;

    const {
      data
    } = await (0, _graphql.graphql)(_app.GraphQLSchema, `
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
    ctx.transactionObj = await _knex.default.transaction();
    const updateUserMaintenance = await (0, _graphql.graphql)(_app.GraphQLSchema, `
            mutation {
                updateUserMaintenance(id: ${maintenanceId}, input: {
                    lastChecked: "${currentDate}"
                })
            }
            `, null, ctx);
    if (!updateUserMaintenance.data.updateUserMaintenance) throw new Error('Failed to update database');
    const createFinishedUserMaintenance = await (0, _graphql.graphql)(_app.GraphQLSchema, `
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
});
(0, _joinMonsterModularizer.extendJmQuery)('dueUserMaintenances', {
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
    return `${table}.sys_user_id = ${userId}`;
  }
});