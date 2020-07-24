"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrivateResolvers = exports.PrivateTypeDefs = void 0;

var _apolloServer = require("apollo-server");

var _util = require("../util");

const PrivateTypeDefs = (0, _apolloServer.gql)`
    extend type Mutation {
        createFinishedUserMaintenance(input: FinishedUserMaintenanceCreationInput!): String
    }

    
`;
exports.PrivateTypeDefs = PrivateTypeDefs;
const PrivateResolvers = {
  Mutation: {
    createFinishedUserMaintenance: _util.genericCreateResolver
  }
};
exports.PrivateResolvers = PrivateResolvers;