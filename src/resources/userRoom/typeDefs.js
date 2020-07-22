import { gql } from "apollo-server";

export default gql `
    type UserRoom {
        id: ID
        name: String!
        description: String
    }

    input UserRoomCreationInput {
        name: String!
        description: String
        userId: Int!
    }

    input UserRoomUpdateInput {
        name: String
        description: String
    }
`;