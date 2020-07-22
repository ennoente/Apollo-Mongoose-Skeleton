import { extendJmMutation, addJmType } from 'join-monster-modularizer';

addJmType('UserRoom', {
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
})


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


extendJmMutation(['createUserRoom', 'updateUserRoom', 'deleteUserRoom'], {
    refType: 'UserRoom',
    fieldMappings: {
        userId: 'sys_user_id',
        description: 'description'
    },
    authorization: ( {id, input}, ctx ) => ({
        id: {
            refType: 'UserRoom',
            sqlRowExists: (userRoomTable) => [`${userRoomTable}.id = ${id} AND ${userRoomTable}.sys_user_id = ${ctx.jwt.userId}`, 'Not found']
        },
        userId: {
            refType: 'User',
            credentialsMatch: () => [ input.userId === ctx.jwt.userId, 'Not authorized!' ]
        }
    })
})