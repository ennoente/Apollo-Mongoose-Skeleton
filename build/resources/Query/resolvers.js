"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _data = require("../user/data");

var _util = require("../util");

var _lodash = require("lodash");

var _default = {
  Query: {
    hello: () => "Hello World :)",
    sysMachine: _util.genericQueryResolver,
    allSysMachines: _util.genericQueryResolver,
    allUserMaintenances: _util.genericQueryResolver,
    dueUserMaintenances: _util.genericQueryResolver,
    login: async (parent, args) => {
      return await (0, _data.login)(args);
    },
    me: _util.genericQueryResolver
    /*
    me: async(parent, args, ctx) => {
        const { jwt, userMachineLoader } = ctx;
        return await fetchUserByJWT(jwt, ctx);
    },
    */

  }
};
exports.default = _default;