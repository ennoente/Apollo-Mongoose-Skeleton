"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _default = (0, _apolloServer.gql)`
  type SysMachine {
      id: ID
      name: String
      description: String
      sysEdit: String
      sysUser: String
      
      group(filter: FilterInput): SysGroup
      manufacturer(filter: FilterInput): SysManufacturer
      documents(filter: FilterInput): [Document]
  }

  input SysMachineCreationInput {
    name: String!
    description: String

    groupId: Int!
    manufacturerId: Int!
  }

  input SysMachineUpdateInput {
    name: String
    description: String

    groupId: Int
    manufacturerId: Int
  }
`;

exports.default = _default;