"use strict";

var _joinMonsterModularizer = require("join-monster-modularizer");

(0, _joinMonsterModularizer.addJmType)('UserMachine', {
  sqlTable: "user_machine",
  uniqueKey: "id",
  fieldMappings: {
    roomId: 'user_room_id',
    sysMachineId: 'sys_machine_id',
    userId: 'sys_user_id'
  },
  fields: {
    description: {
      sqlColumn: 'description'
    },
    sysMachine: {
      filteredJoinDeps: () => [['sys_machine_id']],
      sqlJoin: (userMachineTable, sysMachineTable) => `${userMachineTable}.sys_machine_id = ${sysMachineTable}.id`
    },
    room: {
      sqlJoin: (userMachineTable, userRoomTable) => `${userMachineTable}.user_room_id = ${userRoomTable}.id`
    },
    user: {
      sqlJoin: (userMachineTable, sysUserTable) => `${userMachineTable}.sys_user_id = ${sysUserTable}.id`
    }
  }
});
(0, _joinMonsterModularizer.extendJmMutation)('deleteUserMachine', {
  refType: 'UserMachine',
  authorization: ({
    id
  }, ctx) => ({
    id: {
      refType: 'UserMachine',
      sqlRowExists: userMachineTable => [`${userMachineTable}.id = ${id} AND ${userMachineTable}.sys_user_id = ${ctx.jwt.userId}`, 'No such UserMachine found']
    }
  })
});
(0, _joinMonsterModularizer.extendJmMutation)('updateUserMachine', {
  refType: 'UserMachine',
  authorization: ({
    id,
    input
  }, context) => ({
    id: {
      refType: 'UserMachine',
      sqlRowExists: userMachineTable => [`${userMachineTable}.id = ${id} AND ${userMachineTable}.sys_user_id = ${context.jwt.userId}`, 'No such UserMachine found']
    },
    'input.sysMachineId': {
      refType: 'SysMachine',
      sqlRowExists: sysMachineTable => [`${sysMachineTable}.id = ${input.sysMachineId}`, 'No such SysMachine found']
    },
    'input.roomId': {
      refType: 'UserRoom',
      sqlRowExists: userRoomTable => [`${userRoomTable}.id = ${input.roomId} AND ${userRoomTable}.sys_user_id = ${context.jwt.userId}`, 'No such UserRoom found']
    },
    'input.userId': {
      refType: 'User',
      credentialsMatch: () => [input.userId === context.jwt.userId, 'You are not authorized to create this machine']
    }
  })
});
(0, _joinMonsterModularizer.extendJmMutation)('createUserMachine', {
  refType: 'UserMachine',
  authorization: ({
    input
  }, context) => ({
    'input.sysMachineId': {
      refType: 'SysMachine',
      sqlRowExists: sysMachineTable => [`${sysMachineTable}.id = ${input.sysMachineId}`, 'No such SysMachine found']
    },
    'input.roomId': {
      refType: 'UserRoom',
      sqlRowExists: userRoomTable => [`${userRoomTable}.id = ${input.roomId} AND ${userRoomTable}.sys_user_id = ${context.jwt.userId}`, 'No such UserRoom found']
    },
    'input.userId': {
      refType: 'User',
      credentialsMatch: () => [input.userId === context.jwt.userId, 'You are not authorized to create this machine']
    }
  })
});