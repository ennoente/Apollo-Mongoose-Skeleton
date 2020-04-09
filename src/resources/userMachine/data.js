import { UserMachineModel } from "./model";
import { UserRoomModel } from "../userRoom/model";
import { SysMachineModel } from "../sysMachine/model";

/*
export const fetchUserMachinesByUserId = async userId => {
    const userMachines = await UserMachineModel.find({
        userId: userId
    });


};
*/

export const createUserMachine = async(ctx, input) => {
    const { roomId, sysMachineId, userId } = input;
    const { user, sysMachineLoader } = ctx;

    // Check permissions
    const sysMachine = await SysMachineModel.findById(sysMachineId);

    // User has to have permission to room and user
    if (userId !== user.id || !user.rooms.includes(roomId))
        return new Error("You do not have permission to create this machine");
    // SysMachine has to exist
    if (!sysMachine) return new Error("Invalid sys machine");

    const userMachine = new UserMachineModel({
        ...input,
    });
    await userMachine.save((err, machine) => {
        if (err) throw err;

        console.log("new machihne:", machine);

        return transform(machine, sysMachineLoader);
    });

    // Find corresponding UserRoom and sysMachine
    //const room =
};

export const userMachineBatchingFunc = async(ids) => {
    try {
        return await UserMachineModel.find({
            _id: { $in: ids },
        });
    } catch (e) {
        throw e;
    }
};

const transform = (obj, sysMachineLoader) => {
    return {
        ...obj._doc,
        sysMachine: sysMachineLoader.load(obj.sysMachineId),
        //user:
    };
};