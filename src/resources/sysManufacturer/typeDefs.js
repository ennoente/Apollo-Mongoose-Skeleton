import { gql } from 'apollo-server';

export default gql `
  type SysManufacturer {
      id: ID
      name: String
      description: String
      sysEdit: String
      sysUser: String
  }
`;