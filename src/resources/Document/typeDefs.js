import { gql } from 'apollo-server';

export default gql`
    type Document {
        id: ID
        name: String
        fileSize: Int
        path: String
    }
`;
