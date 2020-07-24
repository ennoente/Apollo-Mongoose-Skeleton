"use strict";

var _joinMonsterModularizer = require("join-monster-modularizer");

(0, _joinMonsterModularizer.addJmType)('UserMaintenance', {
  sqlTable: 'user_maintenance',
  uniqueKey: 'id',
  fieldMappings: {
    userId: 'sys_user_id',
    userMachineId: 'user_machine_id',
    startDate: 'start_date',
    itrInterval: 'itr_interval',
    lastChecked: 'last_checked'
  },
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
    user: {
      sqlJoin: (mTable, userTable) => `${mTable}.sys_user_id = ${userTable}.id`
    },
    machine: {
      sqlJoin: (mTable, userMachineTable) => `${mTable}.user_machine_id = ${userMachineTable}.id`
    }
  }
});
(0, _joinMonsterModularizer.extendJmQuery)('allUserMaintenances', {
  limit: ({
    first
  }) => first,
  orderBy: ({
    orderBy
  }) => orderBy || 'id',
  authorization: ({
    userId
  }, ctx) => ({
    userId: {
      credentialsMatch: () => [userId === ctx.jwt.userId, 'Not authorized']
    }
  }),
  where: (mTable, args, ctx) => {
    const {
      userId,
      beyond
    } = args;
    return `${mTable}.sys_user_id = ${userId} ${beyond ? ` AND ${mTable}.id > ${beyond}` : ''}`;
  }
});
(0, _joinMonsterModularizer.extendJmMutation)(['createUserMaintenance', 'updateUserMaintenance', 'deleteUserMaintenance'], {
  refType: 'UserMaintenance',
  authorization: ({
    id,
    input
  }, ctx) => ({
    id: {
      refType: 'UserMaintenance',
      sqlRowExists: userMTable => [`${userMTable}.id = ${id} AND ${userMTable}.sys_user_id = ${ctx.jwt.userId}`, 'Not authorized']
    },
    'input.userId': {
      credentialsMatch: () => [input.userId === ctx.jwt.userId, 'Not you!']
    },
    'input.userMachineId': {
      refType: 'UserMachine',
      sqlRowExists: userMachineTable => [`${userMachineTable}.id = ${input.userMachineId} AND ${userMachineTable}.sys_user_id = ${ctx.jwt.userId}`, 'UserMachine not found']
    }
  })
});