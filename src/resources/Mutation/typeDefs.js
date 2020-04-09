import { gql } from 'apollo-server';

export default gql `
  type Mutation {
      createUser(email: String!, password: String!): User
      
      createUserMachine(input: UserMachineInput!): UserMachine

      createUserRoom(input: CreateUserRoomInput): UserRoom
  }
`;