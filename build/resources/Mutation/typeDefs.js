"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _default = (0, _apolloServer.gql)`
  type Mutation {
      createUser(username: String!, password: String!): ID


      createSysMachine(input: SysMachineCreationInput!): ID
      updateSysMachine(id: ID!, input: SysMachineUpdateInput!): Boolean
      deleteSysMachine(id: ID!): Boolean

      createUserMaintenance(input: UserMaintenanceCreationInput!): ID
      updateUserMaintenance(id: ID!, input: UserMaintenanceUpdateInput!): Boolean
      deleteUserMaintenance(id: ID!): Boolean


      createUserRoom(input: UserRoomCreationInput!): ID
      updateUserRoom(id: ID!, input: UserRoomUpdateInput): Boolean
      deleteUserRoom(id: ID!): Boolean
      

      createUserMachine(input: UserMachineCreationInput!): ID
      updateUserMachine(id: ID!, input: UserMachineUpdateInput!): Boolean
      deleteUserMachine(id: ID!): Boolean

      markDueMaintenanceAsDone(id: ID!, input: MarkDueMaintenanceAsDoneInput!): Boolean
  }
`;

exports.default = _default;