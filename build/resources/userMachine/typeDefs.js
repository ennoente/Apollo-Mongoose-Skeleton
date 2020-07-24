"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _default = (0, _apolloServer.gql)`
  type UserMachine {
    id: ID

    description: String
    barcode: String
    buildYear: Int
    serialNumber: String
    active: Boolean

    room: UserRoom
    sysMachine(filter: FilterInput): SysMachine
    user: User
  }

  input UserMachineCreationInput {
    description: String
    barcode: String
    buildYear: Int
    serialNumber: String
    active: Boolean

    roomId: Int!
    sysMachineId: Int!
    userId: Int!
  }

  input UserMachineUpdateInput {
    description: String
    barcode: String
    buildYear: Int
    serialNumber: String
    active: Boolean

    roomId: Int
    sysMachineId: Int
  }
`;

exports.default = _default;