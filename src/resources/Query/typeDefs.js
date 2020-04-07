import { gql } from 'apollo-server';

export default gql`
  type Query {
      hello: String!
      allSysMachines: [SysMachine]
      
      login(email: String!, password: String!): String
  }
`;
