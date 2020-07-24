"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryTypeDefs = exports.QueryResolvers = void 0;

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _typeDefs = _interopRequireDefault(require("./typeDefs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const QueryResolvers = _resolvers.default;
exports.QueryResolvers = QueryResolvers;
const QueryTypeDefs = _typeDefs.default;
exports.QueryTypeDefs = QueryTypeDefs;