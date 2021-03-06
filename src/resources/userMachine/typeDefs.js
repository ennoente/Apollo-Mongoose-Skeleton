import { gql } from "apollo-server";

export default gql `
  type UserMachine {
    _id: ID

    description: String
    barcode: String
    buildYear: Int
    serialNumber: String
    active: Boolean

    room: UserRoom
    sysMachine: SysMachine!
    user: User!
  }

  input UserMachineInput {
    description: String
    barcode: String
    buildYear: Int
    serialNumber: String
    active: Boolean

    roomId: String!
    sysMachineId: String!
    userId: String!
  }
`;