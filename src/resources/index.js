import _ from 'lodash';

import { QueryTypeDefs, QueryResolvers } from "./Query";
import { SysMachineTypeDefs } from "./sysMachine";
import { SysGroupTypeDefs } from "./sysGroup";
import { SysManufacturerTypeDefs } from "./sysManufacturer";
import { MutationTypeDefs, MutationResolvers } from "./Mutation";
import { UserResolvers, UserTypeDefs } from "./user";
import { UserMachineTypeDefs, UserMachineResolvers } from './userMachine';
import { UserRoomTypeDefs } from './userRoom';
import { UserMaintenanceTypeDefs } from './userMaintenance';
import { DocumentTypeDefs } from './Document';

//import { PrivateTypeDefs, PrivateResolvers } from './private';


export const PublicResolvers = _.merge(
    QueryResolvers,
    UserResolvers,
    MutationResolvers,
    UserMachineResolvers
);

//export const TypeDefs = [
export const PublicTypeDefs = [
    MutationTypeDefs,
    QueryTypeDefs,
    SysMachineTypeDefs,
    SysGroupTypeDefs,
    SysManufacturerTypeDefs,
    UserTypeDefs,
    UserMachineTypeDefs,
    UserRoomTypeDefs,
    UserMaintenanceTypeDefs,
    DocumentTypeDefs,
];

//export const PrivateTypeDefs;
