import { UserMachineModel } from "./model";
import { UserRoomModel } from "../userRoom/model";
import { SysMachineModel } from "../sysMachine/model";
import Mongoose from "mongoose";

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

    const fields = UserMachineModel.schema.obj;

    for (let key in fields) {
        // Field has a reference to another document
        //if (fields[key]["ref"]) {
        if (key === 'userId') {
            const referencedModelName = fields[key]["ref"];
            console.log(`Field ${key} has ref named ${referencedModelName}`);

            const ReferencedModel = Mongoose.model(referencedModelName);
            const inputField = input[key];
            console.log("fields[key].inversedBy", fields[key]["inversedBy"]);
            console.log("fields[key].inversedIn", fields[key]["inversedIn"]);

            if (inputField) {
                const referencedDocument = await ReferencedModel.findById(input[key]);
                console.log("referencedDocument", referencedDocument);

                if (fields[key]['inversedBy']) {
                    referencedDocument[fields[key]['inversedBy']] = input[key];
                    console.log(referencedDocument);
                } else if (fields[key]['inversedIn']) {
                    const name = fields[key]['inversedIn'];
                    console.log(`Adding to field ${name}`);
                    referencedDocument[name].push(input[key]);
                    //referencedDocument[fields[key]['inversedIn']].push(input[key]);
                    console.log(referencedDocument);
                }
            }
        }
    }

    //const savedMachine = await userMachine.save((err) => {
    //    if (err) throw err;
    //});

    //return transform(savedMachine, sysMachineLoader);
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
        sysMachine: () => sysMachineLoader.load(obj.sysMachineId),
        //user:
    };
};