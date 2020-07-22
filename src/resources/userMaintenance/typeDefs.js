import { gql } from 'apollo-server';

export default gql`
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
