import Mongoose from 'mongoose';
import DataLoader from "dataloader";
import {ApolloServer, gql} from 'apollo-server';
import jwtLib from 'jsonwebtoken';

import {Resolvers, TypeDefs} from './resources';

import { sysGroupBatchingFunc } from './resources/sysGroup/data';
import { sysManufacturerBatchFunc } from './resources/sysManufacturer/data';
import { sysMachineBatchingFunc } from './resources/sysMachine/data';
import { userMachineBatchingFunc } from "./resources/userMachine/data";

import { UserModel } from "./resources/user/model";

const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers,
  context: ({ req }) => {
    const authHeader = req.get('Authorization');
    let token = null;

    if (authHeader) {
      const encodedToken = authHeader.split(' ')[1];
      try {
        token = jwtLib.verify(encodedToken, process.env.JWT_SECRET);
      } catch (e) {
        token = null;
      }
    }

    const sysGroupLoader = new DataLoader(sysGroupBatchingFunc);
    const sysManufacturerLoader = new DataLoader(sysManufacturerBatchFunc);
    const sysMachineLoader = new DataLoader(sysMachineBatchingFunc);
    const userMachineLoader = new DataLoader(userMachineBatchingFunc);

    return {
      jwt: token,

      sysGroupLoader: sysGroupLoader,
      sysManufacturerLoader: sysManufacturerLoader,
      sysMachineLoader: sysMachineLoader,
      userMachineLoader: userMachineLoader
    }
  }
});

Mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-csqea.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => server.listen())
  .then(({url}) => {
    console.log(`Started ApolloServer instance at ${url}`);
  });
