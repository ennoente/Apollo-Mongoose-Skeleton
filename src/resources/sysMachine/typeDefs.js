import {gql} from 'apollo-server';

export default gql`
  type SysMachine {
      _id: ID
      name: String
      description: String
      sysEdit: String
      sysUser: String
      
      group: SysGroup
      manufacturer: SysManufacturer
  }
`;
