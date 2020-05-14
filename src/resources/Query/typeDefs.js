import { gql } from 'apollo-server';

export default gql `
  type Query {
      hello: String!

      sysMachine(id: String!): SysMachine
      allSysMachines(manufacturer: String, group: String): [SysMachine]
      
      login(username: String!, password: String!): String

      me: User
  }
`;