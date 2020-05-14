import { gql } from 'apollo-server';

export default gql `
  type Mutation {
      createUser(username: String!, password: String!): ID
      
      createUserMachine(input: UserMachineInput!): ID

      createUserRoom(input: CreateUserRoomInput): ID
  }
`;