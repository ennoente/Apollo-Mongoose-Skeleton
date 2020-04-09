import { gql } from "apollo-server";

export default gql `
  type User {
    _id: ID
    email: String

    machines: [UserMachine]
    rooms: [UserRoom]
  }
`;