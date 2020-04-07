import _ from 'lodash';

import { QueryTypeDefs, QueryResolvers } from "./Query";
import {SysMachineTypeDefs} from "./sysMachine";
import {SysGroupTypeDefs} from "./sysGroup";
import {SysManufacturerTypeDefs} from "./sysManufacturer";
import {MutationTypeDefs} from "./Mutation";
import {UserResolvers, UserTypeDefs} from "./user";


export const Resolvers = _.merge(
  QueryResolvers,
  UserResolvers
);

export const TypeDefs = [
  MutationTypeDefs,
  QueryTypeDefs,
  SysMachineTypeDefs,
  SysGroupTypeDefs,
  SysManufacturerTypeDefs,
  UserTypeDefs
];
