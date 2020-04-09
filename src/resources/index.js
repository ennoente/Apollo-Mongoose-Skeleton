import _ from 'lodash';

import { QueryTypeDefs, QueryResolvers } from "./Query";
import { SysMachineTypeDefs } from "./sysMachine";
import { SysGroupTypeDefs } from "./sysGroup";
import { SysManufacturerTypeDefs } from "./sysManufacturer";
import { MutationTypeDefs, MutationResolvers } from "./Mutation";
import { UserResolvers, UserTypeDefs } from "./user";
import { UserMachineTypeDefs } from './userMachine';
import { UserRoomTypeDefs } from './userRoom';


export const Resolvers = _.merge(
    QueryResolvers,
    UserResolvers,
    MutationResolvers
);

export const TypeDefs = [
    MutationTypeDefs,
    QueryTypeDefs,
    SysMachineTypeDefs,
    SysGroupTypeDefs,
    SysManufacturerTypeDefs,
    UserTypeDefs,
    UserMachineTypeDefs,
    UserRoomTypeDefs
];