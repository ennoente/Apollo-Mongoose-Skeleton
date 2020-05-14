import { gql } from "apollo-server";

export default gql `
  type User {
    id: ID
    username: String
    email: String

    machines: [UserMachine]
    rooms: [UserRoom]
  }
`;