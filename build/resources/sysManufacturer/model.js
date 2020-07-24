"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SysManufacturerModel = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sysManufacturerSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  sysEdit: String,
  sysUser: String
});

const SysManufacturerModel = _mongoose.default.model('SysManufacturer', sysManufacturerSchema);

exports.SysManufacturerModel = SysManufacturerModel;