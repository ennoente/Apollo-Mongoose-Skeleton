import { gql } from "apollo-server";

export default gql `
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