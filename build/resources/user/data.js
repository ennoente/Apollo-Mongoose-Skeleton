"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = exports.createUser = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _apolloServer = require("apollo-server");

var _knex = _interopRequireDefault(require("../../knex"));

var _joinMasterUtil = require("../../joinMasterUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createUser = async args => {
  const {
    username,
    password
  } = args;
  const sqlTable = (0, _joinMasterUtil.getSQLTable)('User');
  const salt = await _bcrypt.default.genSalt(12);
  const hashedPassword = await _bcrypt.default.hash(password, salt); // First element

  try {
    const [newUser] = await (0, _knex.default)(sqlTable).insert({
      username: username,
      password: hashedPassword
    });
    return newUser.id;
  } catch (e) {
    // MySQL error code - duplicate entry on unique field (username in this case)
    if (e.errno === 1062) {
      throw new Error('User already exists');
    }

    throw new Error(e);
  }
};

exports.createUser = createUser;

const login = async args => {
  const {
    username,
    password
  } = args;
  const user = await (0, _knex.default)("sys_user").select('id', 'username', 'email', 'password').where({
    username: username
  }).first();
  if (!user) return new _apolloServer.AuthenticationError('Wrong username - no user found');
  console.log("user.password", user.password);
  console.log("typedPassword", password);
  const passwordMatches = await _bcrypt.default.compare(password, user.password);
  if (!passwordMatches) return new _apolloServer.AuthenticationError('Incorrect password.');
  return await _jsonwebtoken.default.sign({
    userId: user.id,
    username: user.username,
    email: user.email
  }, process && process.env && process.env.JWT_SECRET || "mysupersecretkey");
};

exports.login = login;

const transform = (userObj, userMachineLoader, userRoomLoader) => {
  return { ...userObj._doc,
    machines: () => userMachineLoader.loadMany(userObj._doc.machines),
    rooms: () => userRoomLoader.loadMany(userObj._doc.rooms)
  };
};