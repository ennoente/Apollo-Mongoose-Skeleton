"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _default = (0, _apolloServer.gql)`
    type UserRoom {
        id: ID
        name: String!
        description: String
    }

    input UserRoomCreationInput {
        name: String!
        description: String
        userId: Int!
    }

    input UserRoomUpdateInput {
        name: String
        description: String
    }
`;

exports.default = _default;