import { addJmType } from 'join-monster-modularizer';

addJmType('SysManufacturer', {
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
})