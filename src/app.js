import {ApolloServer, gql} from 'apollo-server';
import {Resolvers, TypeDefs} from './resources';
import Mongoose from 'mongoose';

const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers,
  context: ({ req }) => {

    return {}
  }
});

Mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-csqea.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
  .then(() => server.listen())
  .then(({url}) => {
    console.log(`Started ApolloServer instance at ${url}`);
  });
