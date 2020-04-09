import Mongoose from "mongoose";

const schema = new Mongoose.Schema({
    name: {
        type: String,
        //required: true
    },
    description: String,

    updatedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const UserRoomModel = Mongoose.model("UserRoom", schema);