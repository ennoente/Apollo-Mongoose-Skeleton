"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _knex = _interopRequireDefault(require("./knex"));

var _sqlstring = _interopRequireDefault(require("sqlstring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Mutation: {
    fields: {//deleteUserRoom: {
      //    refType: 'UserRoom',
      //    authorization: ( { input }, ctx) => ({
      //        
      //    })
      //},

      /*
      createUserRoom: {
          refType: 'UserRoom',
          fieldMappings: {
              userId: 'sys_user_id'
          },
          authorization: ( {input}, ctx ) => ({
              userId: {
                  refType: 'User',
                  credentialsMatch: () => [ input.userId === ctx.jwt.userId, 'You are not authorized to create this room!' ]
              }
          })
      },
      */

      /*
      createUserMachine: {
          refType: 'UserMachine',
          fieldMappings: {
              roomId: 'user_room_id',
              sysMachineId: 'sys_machine_id',
              userId: 'sys_user_id'
          },
          authorization: ({input}, context) => ({
              sysMachineId: {
                  refType: 'SysMachine',
                  sqlRowExists: (sysMachineTable) => [`${sysMachineTable}.id = ${input.sysMachineId}`, 'No such SysMachine found']
              },
              roomId: {
                  refType: 'UserRoom',
                  sqlRowExists: (userRoomTable) => [`${userRoomTable}.id = ${input.roomId} AND ${userRoomTable}.sys_user_id = ${context.jwt.userId}`, 'No such UserRoom found']
              },
              userId: {
                  refType: 'User',
                  credentialsMatch: () => [input.userId === context.jwt.userId, 'You are not authorized to create this machine']
              }
          }),
      },
      */
    }
  },
  Query: {
    fields: {
      /*
      me: {
          where: (userTable, args, ctx) => {
              const {jwt} = ctx;
              return `${userTable}.id = ${jwt.userId}`;
          },
      },
      */

      /*
      allSysMachines: {
          where: (sysMachineTable, args, ctx, sqlASTNode) => {
              const query = knex.queryBuilder();
                if (args.manufacturer) {
                  const manufacturerTable = getTableAlias(sqlASTNode, "manufacturer");
                  assert(
                      manufacturerTable,
                      'You have to include the "manufacturer" field in your query'
                  );
                  query.orWhereRaw(
                      `${manufacturerTable}.name LIKE ${SQLString.escape(
                          "%" + args.manufacturer + "%"
                      )}`
                  );
              }
                if (args.group) {
                  const groupTable = getTableAlias(sqlASTNode, "group");
                  assert(
                      groupTable,
                      'You have to include the "group" field in your query'
                  );
                  query.orWhereRaw(
                      `${groupTable}.name LIKE ${SQLString.escape(
                          "%" + args.group + "%"
                      )}`
                  );
              }
                if (args.name) {
                  query.orWhereRaw(
                      `${sysMachineTable}.name LIKE ${SQLString.escape(
                          "%" + args.name + "%"
                      )}`
                  );
              }
                const sql = knexToWhereClause(query);
                return sql;
          },
      },
      */
    }
  }
  /*
  SysMachine: {
      sqlTable: "sys_machine",
      uniqueKey: "id",
      fields: {
          name: {
              sqlColumn: "name",
          },
          manufacturer: {
              sqlJoin: (sysMachineTable, sysManufacturerTable) =>
                  //`${sysMachineTable}.sys_hersteller_id = ${sysManufacturerTable}.id`,
                  `${sysMachineTable}.sys_manufacturer_id = ${sysManufacturerTable}.id`,
          },
          group: {
              sqlJoin: (sysMachineTable, sysGroupTable) =>
                  `${sysMachineTable}.sys_gruppe_id = ${sysGroupTable}.id`,
          },
      }
  },
  */

  /*
  SysManufacturer: {
      sqlTable: "sys_manufacturer",
      uniqueKey: "id",
      fields: {
          name: {
              sqlColumn: "name",
          },
          description: {
              sqlColumn: "beschreibung",
          },
      },
  },
  */

  /*
  SysGroup: {
      sqlTable: "sys_group",
      uniqueKey: "id",
      fields: {
          name: {
              sqlColumn: "name",
          },
          description: {
              sqlColumn: "beschreibung",
          },
      }
  },
  */

  /*
  User: {
      sqlTable: "sys_user",
      uniqueKey: "id",
      fields: {
          email: {
              sqlColumn: "email",
          },
          username: {
              sqlColumn: "username",
          },
          machines: {
              sqlJoin: (userTable, userMachineTable) =>
                  `${userTable}.id = ${userMachineTable}.sys_user_id`,
          },
          rooms: {
              sqlJoin: (userTable, userRoomTable) =>
                  `${userTable}.id = ${userRoomTable}.sys_user_id`,
          }
      }
  },
  */

  /*
  UserMachine: {
      sqlTable: "user_machine",
      uniqueKey: "id",
      fields: {
          sysMachine: {
              sqlJoin: (userMachineTable, sysMachineTable) => `${userMachineTable}.sys_machine_id = ${sysMachineTable}.id`
          },
          room: {
              sqlJoin: (userMachineTable, userRoomTable) => `${userMachineTable}.user_room_id = ${userRoomTable}.id`
          }
      }
  },
  */

  /*
  UserRoom: {
      sqlTable: "user_room",
      uniqueKey: "id",
      fields: {
          name: {
              sqlColumn: "name",
          },
          description: {
              sqlColumn: "description",
          }
      }
  }
  */

};
exports.default = _default;