"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GraphQLSchema = void 0;

var _apolloServer = require("apollo-server");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _lodash = require("lodash");

var _resources = require("./resources");

var _private = require("./resources/private");

var _index = _interopRequireDefault(require("../lib/join-monster-graphql-tools-adapter/src/index"));

var _joinMonsterMetadata = _interopRequireDefault(require("./joinMonsterMetadata"));

var _joinMonsterModularizer = require("join-monster-modularizer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Mongoose from 'mongoose';
//import joinMonsterAdapt from 'join-monster-graphql-tools-adapter';
const publicSchema = (0, _apolloServer.makeExecutableSchema)({
  typeDefs: _resources.PublicTypeDefs,
  resolvers: _resources.PublicResolvers
});
const completeSchema = (0, _apolloServer.makeExecutableSchema)({
  typeDefs: [_private.PrivateTypeDefs, ..._resources.PublicTypeDefs],
  resolvers: (0, _lodash.merge)(_resources.PublicResolvers, _private.PrivateResolvers)
}); //const combinedMetadata = combineMetadata('src/JoinMonsterMetadata');

const [combinedMetadataPublic, combinedMetadataPrivate] = (0, _joinMonsterModularizer.combineMetadata)('src/JoinMonsterMetadata'); //console.log('combinedMetadata', combinedMetadata);

console.log('joinMonsterMetadata', _joinMonsterMetadata.default); //joinMonsterAdapt(schema, combinedMetadata);

(0, _index.default)(publicSchema, combinedMetadataPublic); //const completeSchema = { ...publicSchema };

(0, _index.default)(completeSchema, combinedMetadataPublic);
(0, _index.default)(completeSchema, combinedMetadataPrivate); //joinMonsterAdapt(schema, joinMonsterMetadata);

const GraphQLSchema = completeSchema; //export const GraphQLSchema = publicSchema;
//export const CompleteGraphQLSchema = completeSchema;

exports.GraphQLSchema = GraphQLSchema;
console.log("public schema", publicSchema);
console.log("complete schema", completeSchema);
const server = new _apolloServer.ApolloServer({
  debug: true,
  schema: publicSchema,
  context: async ({
    req
  }) => {
    const authHeader = req.get('Authorization');
    let token = null;

    if (authHeader) {
      const encodedToken = authHeader.split(' ')[1];

      try {
        token = _jsonwebtoken.default.verify(encodedToken, process && process.env && process.env.JWT_SECRET || "mysupersecretkey");
      } catch (e) {
        token = null;
      }
    }

    return {
      jwt: token //schema: schema

    };
  }
});
server.listen().then(({
  url
}) => console.log(`Started ApolloServer instance at ${url}`));
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