import { gql } from 'apollo-server';

//testFilter(filter: FilterInput): Boolean

//allSysMachines(manufacturer: String, group: String): [SysMachine]

export default gql `
  type Query {
      hello: String!

      sysMachine(id: Int!): SysMachine
      allSysMachines(filter: FilterInput): [SysMachine]

      allUserMaintenances(userId: Int!, first: Int, beyond: Int, orderBy: String): [UserMaintenance],
      dueUserMaintenances(userId: Int!): [DueUserMaintenance]
      
      login(username: String!, password: String!): String

      me: User
  }

  input ComparisonInput {
    key: String!
    operator: String!
    value: String!
  }

  input FilterInput {
    compare: ComparisonInput
    AND: [FilterInput]
    OR: [FilterInput]
  }
`;