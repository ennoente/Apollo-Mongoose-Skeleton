"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

//testFilter(filter: FilterInput): Boolean
//allSysMachines(manufacturer: String, group: String): [SysMachine]
var _default = (0, _apolloServer.gql)`
  type Query {
      hello: String!

      sysMachine(id: Int!): SysMachine
      allSysMachines(filter: FilterInput): [SysMachine]

      allUserMaintenances(userId: Int!, first: Int, beyond: Int, orderBy: String): [UserMaintenance],
      dueUserMaintenances(userId: Int!): [DueUserMaintenance]
      
      login(username: String!, password: String!): String

      me: User
  }

  input ComparisonInput {
    key: String!
    operator: String!
    value: String!
  }

  input FilterInput {
    compare: ComparisonInput
    AND: [FilterInput]
    OR: [FilterInput]
  }
`;

exports.default = _default;