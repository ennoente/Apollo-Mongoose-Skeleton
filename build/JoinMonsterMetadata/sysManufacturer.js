"use strict";

var _joinMonsterModularizer = require("join-monster-modularizer");

(0, _joinMonsterModularizer.addJmType)('SysManufacturer', {
  sqlTable: "sys_manufacturer",
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