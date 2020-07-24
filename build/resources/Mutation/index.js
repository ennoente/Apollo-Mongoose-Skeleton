"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MutationResolvers = exports.MutationTypeDefs = void 0;

var _typeDefs = _interopRequireDefault(require("./typeDefs"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MutationTypeDefs = _typeDefs.default;
exports.MutationTypeDefs = MutationTypeDefs;
const MutationResolvers = _resolvers.default;
exports.MutationResolvers = MutationResolvers;