import { gql } from 'apollo-server';

export default gql`
  type SysGroup {
      _id: ID
      id: String
      name: String
      description: String
      sysEdit: String
      sysUser: String
  }
`;
