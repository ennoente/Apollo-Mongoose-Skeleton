"use strict";

var _joinMonsterModularizer = require("join-monster-modularizer");

var _sqlstring = _interopRequireDefault(require("sqlstring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _joinMonsterModularizer.addJmType)('SysMachine', {
  sqlTable: "sys_machine",
  uniqueKey: "id",
  fields: {
    name: {
      sqlColumn: "name"
    },
    description: {
      sqlColumn: 'description'
    },
    manufacturer: {
      sqlJoin: (sysMachineTable, sysManufacturerTable) => `${sysMachineTable}.sys_manufacturer_id = ${sysManufacturerTable}.id`
    },
    group: {
      sqlJoin: (sysMachineTable, sysGroupTable) => `${sysMachineTable}.sys_group_id = ${sysGroupTable}.id`
    },
    documents: {
      junction: {
        sqlTable: 'document_sys_machine',
        sqlJoins: [(sysMachineTable, joinTable) => `${sysMachineTable}.id = ${joinTable}.sys_machine_id`, (joinTable, documentTable) => `${joinTable}.document_id = ${documentTable}.id`]
      }
    }
  }
});
(0, _joinMonsterModularizer.extendJmQuery)('sysMachine', {
  where: (sysMachineTable, args) => {
    const {
      id
    } = args;
    return `${sysMachineTable}.id = ${id}`;
  }
});
(0, _joinMonsterModularizer.extendJmMutation)(['createSysMachine', 'updateSysMachine', 'deleteSysMachine'], {
  refType: 'SysMachine',
  fieldMappings: {
    groupId: 'sys_group_id',
    manufacturerId: 'sys_manufacturer_id'
  },
  authorization: ({
    id,
    input
  }, ctx) => ({
    id: {
      refType: 'SysMachine',
      sqlRowExists: table => [`${table}.id = ${id}`, `No SysMachine found for id '${id}'`]
    },
    'input.groupId': {
      refType: 'SysGroup',
      sqlRowExists: table => [`${table}.id = ${input.groupId}`, 'Invalid SysGroup']
    },
    'input.manufacturerId': {
      refType: 'SysManufacturer',
      sqlRowExists: table => [`${table}.id = ${input.manufacturerId}`, 'Invalid SysManufacturer']
    }
  })
});