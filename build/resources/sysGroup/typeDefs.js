"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _default = (0, _apolloServer.gql)`
  type SysGroup {
      id: ID
      name: String
      description: String
      sysEdit: String
      sysUser: String
  }
`;

exports.default = _default;