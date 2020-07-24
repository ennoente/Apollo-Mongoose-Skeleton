"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUserRoom = void 0;

var _knex = _interopRequireDefault(require("../../knex"));

var _joinMasterUtil = require("../../joinMasterUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createUserRoom = async (parent, {
  input
}, ctx, info) => {
  const userRoomTable = (0, _joinMasterUtil.getSQLTable)('UserRoom');
  const {
    userId
  } = ctx.jwt;
  const newRoom = await (0, _knex.default)(userRoomTable).insert({ ...input,
    sys_user_id: userId
  });
  console.log("newRoom", newRoom.id);
};
/*
export const userRoomBatchingFunc = async(ids) => {
    try {
        const rooms = await UserRoomModel.find({
            _id: { $in: ids },
        });
        return rooms.map((room) => {
            return transform(room);
        });
    } catch (e) {
        throw e;
    }
};

export const createUserRoom = async(input) => {
    const { name, description, userId } = input;

    // Check for valid user id
    try {
        // Check for correct user
        const user = await UserModel.findById(userId);
        if (!user) return new Error("No user found");
        if (user.id !== userId) return new Error("Not allowed!");

        // Create new room
        const room = new UserRoomModel({
            name: name,

            description: description,
            updatedBy: user.username,
        });
        const newRoom = await room.save();

        // Update user
        user.rooms.push(newRoom.id);
        await user.save();

        // Return new room
        return transform(newRoom);
    } catch (e) {
        throw e;
    }
};

const transform = (roomObj) => {
    return {
        ...roomObj._doc,
    };
};
*/


exports.createUserRoom = createUserRoom;