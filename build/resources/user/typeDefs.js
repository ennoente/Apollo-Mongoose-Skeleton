"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _default = (0, _apolloServer.gql)`
  type User {
    id: ID
    username: String
    email: String

    machine(id: Int!): UserMachine
    machines(filter: FilterInput, orderBy: String): [UserMachine]

    room(id: Int!): UserRoom
    rooms(filter: FilterInput, orderBy: String): [UserRoom]

    maintenance(id: Int!): UserMaintenance
    maintenances(filter: FilterInput, orderBy: String): [UserMaintenance]

    dueMaintenance(id: ID!): DueUserMaintenance
    dueMaintenances(filter: FilterInput): [DueUserMaintenance]
    
    finishedMaintenance(id: Int!): FinishedUserMaintenance
    finishedMaintenances(filter: FilterInput): [FinishedUserMaintenance]
  }
`;

exports.default = _default;