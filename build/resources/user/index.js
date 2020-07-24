"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserResolvers = exports.UserTypeDefs = void 0;

var _typeDefs = _interopRequireDefault(require("./typeDefs"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserTypeDefs = _typeDefs.default;
exports.UserTypeDefs = UserTypeDefs;
const UserResolvers = _resolvers.default;
exports.UserResolvers = UserResolvers;