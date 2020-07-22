import { gql } from "apollo-server";

export default gql `
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
