import { gql } from 'apollo-server';

export default gql `
  type SysGroup {
      id: ID
      name: String
      description: String
      sysEdit: String
      sysUser: String
  }
`;