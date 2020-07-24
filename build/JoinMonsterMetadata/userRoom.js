"use strict";

var _joinMonsterModularizer = require("join-monster-modularizer");

(0, _joinMonsterModularizer.addJmType)('UserRoom', {
  sqlTable: "user_room",
  uniqueKey: "id",
  fields: {
    name: {
      sqlColumn: "name"
    },
    description: {
      sqlColumn: "description"
    }
  }
});
/*
extendJmMutation('createUserRoom', {
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
})
*/

(0, _joinMonsterModularizer.extendJmMutation)(['createUserRoom', 'updateUserRoom', 'deleteUserRoom'], {
  refType: 'UserRoom',
  fieldMappings: {
    userId: 'sys_user_id',
    description: 'description'
  },
  authorization: ({
    id,
    input
  }, ctx) => ({
    id: {
      refType: 'UserRoom',
      sqlRowExists: userRoomTable => [`${userRoomTable}.id = ${id} AND ${userRoomTable}.sys_user_id = ${ctx.jwt.userId}`, 'Not found']
    },
    userId: {
      refType: 'User',
      credentialsMatch: () => [input.userId === ctx.jwt.userId, 'Not authorized!']
    }
  })
});