import { gql } from "apollo-server";

export default gql `
    type UserRoom {
        id: ID
        name: String!
        description: String
    }

    input CreateUserRoomInput {
        name: String!
        description: String
        userId: Int!
    }
`;