import _ from 'lodash';

import { QueryTypeDefs, QueryResolvers } from "./Query";

/**
 * Example code:
 * import _ from 'lodash';
 * import { RootQueryTypeDefs,   RootQueryResolvers }    from './rootQuery';
 * import { SysMachineTypeDefs,  SysMachineResolvers }  from "./sysMachine";
 *
 *
 * export const Resolvers = _.merge(
 * RootQueryResolvers,
 * SysMachineResolvers
 * );
 *
 * export const TypeDefs = [
 * RootQueryTypeDefs,
 * SysMachineTypeDefs
 * ];
 */

export const Resolvers = _.merge(
  QueryResolvers
);

export const TypeDefs = [
  QueryTypeDefs
];
