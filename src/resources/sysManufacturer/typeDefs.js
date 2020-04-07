import {gql} from 'apollo-server';

export default gql`
  type SysManufacturer {
      _id: ID
      id: String
      name: String
      description: String
      sysEdit: String
      sysUser: String
  }
`;
