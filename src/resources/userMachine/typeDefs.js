import {gql} from 'apollo-server';

export default gql`
  scalar ISODate
  
  type UserMachine {
      description: String
      barcode: String
      buildYear: ISODate
      serialNumber: String
      active: Boolean

      #room: Int
      sysMachine: SysMachine!
      user: User!
  }
  
  input UserMachineInput {
      description: String
      barcode: String
      buildYear: ISODate
      serialNumber: String
      active: Boolean

      roomId: Int
      sysMachineId: Int!
      userId: Int!
  }
`;
