"use strict";

var _joinMonsterModularizer = require("join-monster-modularizer");

(0, _joinMonsterModularizer.addJmType)('Document', {
  sqlTable: 'document',
  uniqueKey: 'id',
  fields: {
    name: {
      sqlColumn: 'name'
    },
    fileSize: {
      sqlColumn: 'file_size'
    },
    path: {
      sqlColumn: 'path'
    }
  }
});