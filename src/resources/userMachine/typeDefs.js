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
    sysMachine: SysMachine!
    user: User!
  }

  input UserMachineInput {
    description: String
    barcode: String
    buildYear: Int
    serialNumber: String
    active: Boolean

    roomId: Int!
    sysMachineId: Int!
    userId: Int!
  }
`;