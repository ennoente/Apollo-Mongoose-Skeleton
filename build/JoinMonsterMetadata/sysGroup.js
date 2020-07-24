"use strict";

var _joinMonsterModularizer = require("join-monster-modularizer");

(0, _joinMonsterModularizer.addJmType)('SysGroup', {
  sqlTable: "sys_group",
  uniqueKey: "id",
  fields: {
    name: {
      sqlColumn: "name"
    },
    description: {
      sqlColumn: "beschreibung"
    }
  }
});