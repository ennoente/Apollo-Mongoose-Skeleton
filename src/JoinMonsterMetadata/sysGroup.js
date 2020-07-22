import { addJmType } from 'join-monster-modularizer';

addJmType('SysGroup', {
    sqlTable: "sys_group",
    uniqueKey: "id",
    fields: {
        name: {
            sqlColumn: "name",
        },
        description: {
            sqlColumn: "beschreibung"
        }
    }
});