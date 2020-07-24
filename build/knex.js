"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _knex = _interopRequireDefault(require("knex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const knex = (0, _knex.default)({
  client: "mysql2",
  //client: "mysql",
  //version: "5.7",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "brabo_two"
  }
});
var _default = knex;
exports.default = _default;