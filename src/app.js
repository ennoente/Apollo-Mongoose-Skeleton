//import Mongoose from 'mongoose';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import jwtLib from 'jsonwebtoken';

import { merge } from 'lodash';

import { PublicResolvers, PublicTypeDefs } from './resources';
import { PrivateTypeDefs, PrivateResolvers } from './resources/private';

//import joinMonsterAdapt from 'join-monster-graphql-tools-adapter';
import joinMonsterAdapt from '../lib/join-monster-graphql-tools-adapter/src/index';

import joinMonsterMetadata from './joinMonsterMetadata';

import { combineMetadata } from 'join-monster-modularizer';

const publicSchema = makeExecutableSchema({
    typeDefs: PublicTypeDefs,
    resolvers: PublicResolvers
});

const completeSchema = makeExecutableSchema({
    typeDefs: [ PrivateTypeDefs, ...PublicTypeDefs ],
    resolvers: merge(PublicResolvers, PrivateResolvers)
});



//const combinedMetadata = combineMetadata('src/JoinMonsterMetadata');
const [ combinedMetadataPublic, combinedMetadataPrivate ] = combineMetadata('src/JoinMonsterMetadata');

//console.log('combinedMetadata', combinedMetadata);
console.log('joinMonsterMetadata', joinMonsterMetadata);

//joinMonsterAdapt(schema, combinedMetadata);
joinMonsterAdapt(publicSchema, combinedMetadataPublic);

//const completeSchema = { ...publicSchema };
joinMonsterAdapt(completeSchema, combinedMetadataPublic);
joinMonsterAdapt(completeSchema, combinedMetadataPrivate);

//joinMonsterAdapt(schema, joinMonsterMetadata);

export const GraphQLSchema = completeSchema;
//export const GraphQLSchema = publicSchema;
//export const CompleteGraphQLSchema = completeSchema;

console.log("public schema", publicSchema);
console.log("complete schema", completeSchema);

const server = new ApolloServer({
    debug: true,
    schema: publicSchema,
    context: async({ req }) => {
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

        return {
            jwt: token,
            //schema: schema
        }
    }
});

server.listen()
    .then(({ url }) => console.log(`Started ApolloServer instance at ${url}`))

/*
Mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-csqea.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => server.listen())
    .then(({ url }) => {
        console.log(`Started ApolloServer instance at ${url}`);
    });
    */