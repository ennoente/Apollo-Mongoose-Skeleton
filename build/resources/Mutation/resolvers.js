"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("../util");

var _data = require("../user/data");

var _data2 = require("../userMachine/data");

var _data3 = require("../userRoom/data");

var _default = {
  Mutation: {
    createUser: async (parent, args, ctx, info) => {
      return await (0, _data.createUser)(args); //return genericQueryResolver(parent, args, ctx, info);
    },
    createSysMachine: _util.genericCreateResolver,
    updateSysMachine: _util.genericUpdateResolver,
    deleteSysMachine: _util.genericDeleteResolver,
    createUserMaintenance: _util.genericCreateResolver,
    updateUserMaintenance: _util.genericUpdateResolver,
    deleteUserMaintenance: _util.genericDeleteResolver,
    createUserRoom: _util.genericCreateResolver,
    updateUserRoom: _util.genericUpdateResolver,
    deleteUserRoom: _util.genericDeleteResolver,
    createUserMachine: _util.genericCreateResolver,
    updateUserMachine: _util.genericUpdateResolver,
    deleteUserMachine: _util.genericDeleteResolver,
    //markDueMaintenanceAsDone: genericUpdateResolver
    markDueMaintenanceAsDone: _util.customResolver
  }
};
exports.default = _default;