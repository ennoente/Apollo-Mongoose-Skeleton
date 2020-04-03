import { gql } from 'apollo-server';

export default gql`  
  type SysMachine {
      name: String
      description: String
      updatedAt: String
  }
`;
