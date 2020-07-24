"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PublicTypeDefs = exports.PublicResolvers = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _Query = require("./Query");

var _sysMachine = require("./sysMachine");

var _sysGroup = require("./sysGroup");

var _sysManufacturer = require("./sysManufacturer");

var _Mutation = require("./Mutation");

var _user = require("./user");

var _userMachine = require("./userMachine");

var _userRoom = require("./userRoom");

var _userMaintenance = require("./userMaintenance");

var _Document = require("./Document");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { PrivateTypeDefs, PrivateResolvers } from './private';
const PublicResolvers = _lodash.default.merge(_Query.QueryResolvers, _user.UserResolvers, _Mutation.MutationResolvers, _userMachine.UserMachineResolvers); //export const TypeDefs = [


exports.PublicResolvers = PublicResolvers;
const PublicTypeDefs = [_Mutation.MutationTypeDefs, _Query.QueryTypeDefs, _sysMachine.SysMachineTypeDefs, _sysGroup.SysGroupTypeDefs, _sysManufacturer.SysManufacturerTypeDefs, _user.UserTypeDefs, _userMachine.UserMachineTypeDefs, _userRoom.UserRoomTypeDefs, _userMaintenance.UserMaintenanceTypeDefs, _Document.DocumentTypeDefs]; //export const PrivateTypeDefs;

exports.PublicTypeDefs = PublicTypeDefs;