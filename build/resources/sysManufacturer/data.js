"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sysManufacturerBatchFunc = void 0;

var _model = require("./model");

const sysManufacturerBatchFunc = async ids => {
  try {
    const manufacturers = await _model.SysManufacturerModel.find({
      id: {
        $in: ids
      }
    });
    return manufacturers.map(manufacturer => {
      return transform(manufacturer);
    });
  } catch (e) {
    throw e;
  }
};

exports.sysManufacturerBatchFunc = sysManufacturerBatchFunc;

const transform = manufacturer => {
  return { ...manufacturer._doc
  };
};