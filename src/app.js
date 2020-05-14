//import Mongoose from 'mongoose';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import jwtLib from 'jsonwebtoken';

import { Resolvers, TypeDefs } from './resources';

import joinMonsterAdapt from 'join-monster-graphql-tools-adapter';
//import joinMonsterAdapt from '../lib/join-monster-graphql-tools-adapter/src/index';
import joinMonsterMetadata from './joinMonsterMetadata';

const schema = makeExecutableSchema({
    typeDefs: TypeDefs,
    resolvers: Resolvers
});

joinMonsterAdapt(schema, joinMonsterMetadata);

export const GraphQLSchema = schema;

console.log("schema", schema);

const server = new ApolloServer({
    debug: true,
    schema,
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