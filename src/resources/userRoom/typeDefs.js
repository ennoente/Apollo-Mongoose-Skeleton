import { gql } from "apollo-server";

export default gql `
    type UserRoom {
        _id: ID
        name: String!
        description: String
    }

    input CreateUserRoomInput {
        name: String!
        description: String
        userId: String!
    }
`;