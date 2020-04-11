import Mongoose from "mongoose";

const schema = new Mongoose.Schema({
    name: {
        type: String,
        //required: true
    },
    description: String,

    machineIds: [{
        type: Mongoose.Types.ObjectId,
        ref: 'UserMachine',
        inversedBy: 'roomId'
    }],

    updatedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const UserRoomModel = Mongoose.model("UserRoom", schema);