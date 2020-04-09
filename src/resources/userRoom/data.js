import { UserRoomModel } from "./model";
import { UserModel } from "../user/model";

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