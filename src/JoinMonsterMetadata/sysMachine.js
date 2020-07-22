import { extendJmQuery, addJmType, extendJmMutation } from 'join-monster-modularizer';
import SQLString from "sqlstring";

addJmType('SysMachine', {
    sqlTable: "sys_machine",
    uniqueKey: "id",
    fields: {
        name: {
            sqlColumn: "name",
        },
        description: {
            sqlColumn: 'description'
        },
        manufacturer: {
            sqlJoin: (sysMachineTable, sysManufacturerTable) =>
                `${sysMachineTable}.sys_manufacturer_id = ${sysManufacturerTable}.id`,
        },
        group: {
            sqlJoin: (sysMachineTable, sysGroupTable) =>
                `${sysMachineTable}.sys_group_id = ${sysGroupTable}.id`,
        },
        documents: {
            junction: {
                sqlTable: 'document_sys_machine',
                sqlJoins: [
                    (sysMachineTable, joinTable) => `${sysMachineTable}.id = ${joinTable}.sys_machine_id`,
                    (joinTable, documentTable) => `${joinTable}.document_id = ${documentTable}.id`
                ]
            }
        }
    }
})

extendJmQuery('sysMachine', {
    where: (sysMachineTable, args) => {
        const { id } = args;
        return `${sysMachineTable}.id = ${id}`;
    },
});


extendJmMutation(['createSysMachine', 'updateSysMachine', 'deleteSysMachine'], {
    refType: 'SysMachine',
    fieldMappings: {
        groupId: 'sys_group_id',
        manufacturerId: 'sys_manufacturer_id'
    },
    authorization: ({ id, input }, ctx) => ({
        id: {
            refType: 'SysMachine',
            sqlRowExists: (table) => [`${table}.id = ${id}`, `No SysMachine found for id '${id}'`]
        },
        'input.groupId': {
            refType: 'SysGroup',
            sqlRowExists: (table) => [`${table}.id = ${input.groupId}`, 'Invalid SysGroup']
        },
        'input.manufacturerId': {
            refType: 'SysManufacturer',
            sqlRowExists: table => [`${table}.id = ${input.manufacturerId}`, 'Invalid SysManufacturer']
        }
    })
})