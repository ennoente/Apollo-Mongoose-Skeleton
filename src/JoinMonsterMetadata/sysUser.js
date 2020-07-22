import { extendJmQuery, addJmType } from 'join-monster-modularizer';

addJmType('User', {
    sqlTable: "sys_user",
    uniqueKey: "id",
    fields: {
        email: {
            sqlColumn: "email"
        },
        username: {
            sqlColumn: "username"
        },

        machine: {
            sqlJoin: (userTable, userMachineTable, { id }) =>
                `${userTable}.id = ${userMachineTable}.sys_user_id AND ${userMachineTable}.id = ${id}`
        },
        machines: {
            orderBy: ({ orderBy }) => orderBy || 'id',
            sqlJoin: (userTable, userMachineTable) =>
                `${userTable}.id = ${userMachineTable}.sys_user_id`
        },

        room: {
            sqlJoin: (userTable, userRoomTable, { id }) =>
                `${userTable}.id = ${userRoomTable}.sys_user_id AND ${userRoomTable}.id = ${id}`
        },
        rooms: {
            orderBy: ({ orderBy }) => orderBy || 'id',
            sqlJoin: (userTable, userRoomTable) =>
                `${userTable}.id = ${userRoomTable}.sys_user_id`
        },

        maintenance: {
            sqlJoin: (userTable, userMTable, { id }) =>
                `${userTable}.id = ${userMTable}.sys_user_id AND ${userMTable}.id = ${id}`
        },
        maintenances: {
            orderBy: ({ orderBy }) => orderBy || 'id',
            sqlJoin: (userTable, userMTable) =>
                `${userTable}.id = ${userMTable}.sys_user_id`
        },

        dueMaintenance: {
            //where: (table, { id }) => `${table}.id = ${id}`
            sqlJoin: (u, m, { id }) => `${u}.id = ${m}.sys_user_id AND ${m}.id = ${id} `
        },
        dueMaintenances: {
            sqlJoin: (userTable, dmTable) => `${userTable}.id = ${dmTable}.sys_user_id`
        },

        finishedMaintenance: {
            sqlJoin: (userTable, fmTable, { id }) => `${userTable}.id = ${fmTable}.sys_user_id AND ${fmTable}.id = ${id}`
        },
        finishedMaintenances: {
            sqlJoin: (userTable, fmTable) => `${userTable}.id = ${fmTable}.sys_user_id`
        }
    }
})

extendJmQuery('me', {
    where: (userTable, args, ctx) => {
        const {jwt} = ctx;
        return `${userTable}.id = ${jwt.userId}`;
    }
});
