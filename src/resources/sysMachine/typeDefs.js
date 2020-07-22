import { gql } from 'apollo-server';

export default gql `
  type SysMachine {
      id: ID
      name: String
      description: String
      sysEdit: String
      sysUser: String
      
      group(filter: FilterInput): SysGroup
      manufacturer(filter: FilterInput): SysManufacturer
      documents(filter: FilterInput): [Document]
  }

  input SysMachineCreationInput {
    name: String!
    description: String

    groupId: Int!
    manufacturerId: Int!
  }

  input SysMachineUpdateInput {
    name: String
    description: String

    groupId: Int
    manufacturerId: Int
  }
`;