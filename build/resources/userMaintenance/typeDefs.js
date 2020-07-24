"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _default = (0, _apolloServer.gql)`
    scalar Date

    type UserMaintenance {
        id: ID

        name: String
        description: String

        startDate: Date
        itrInterval: Int

        lastChecked: Date

        user: User!
        machine: UserMachine!
    }

    type DueUserMaintenance {
        id: ID

        name: String
        description: String

        startDate: Date
        itrInterval: Int

        lastChecked: Date
        dueUntil: Date

        user: User!
        machine: UserMachine!
    }

    type FinishedUserMaintenance {
        id: ID!

        maintenanceId: Int
        maintenanceName: String
        maintenanceDescription: String

        userId: Int
        username: String

        machineName: String
        machineDescription: String
        machineBarcode: String

        comment: String
        successful: Boolean
        finishedAt: Date
    }

    input UserMaintenanceCreationInput {
        name: String!
        description: String

        startDate: Date!
        itrInterval: Int!

        userId: Int!
        userMachineId: Int!
    }

    input UserMaintenanceUpdateInput {
        name: String
        description: String

        startDate: Date
        itrInterval: Int

        userMachineId: Int

        lastChecked: Date
    }

    input MarkDueMaintenanceAsDoneInput {
        successful: Boolean!
        comment: String
    }

    input FinishedUserMaintenanceCreationInput {
        maintenanceId: Int!
        maintenanceName: String!
        maintenanceDescription: String

        userId: Int!
        username: String!

        machineName: String!
        machineDescription: String
        machineBarcode: String

        comment: String
        successful: Boolean!
        finishedAt: Date!
    }
`;

exports.default = _default;