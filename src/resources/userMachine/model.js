import Mongoose from 'mongoose';

const userMachineSchema = new Mongoose.Schema({
    description: String,
    barcode: String,
    buildYear: Date,
    serialNumber: String,
    active: Boolean,

    roomId: {
        type: Mongoose.ObjectId,
        ref: 'UserRoom'
    },
    sysMachineId: {
        type: Mongoose.ObjectId,
        ref: 'SysMachine'
    },
    userId: {
        type: Mongoose.ObjectId,
        ref: 'User'
    },

    //sysEdit: String,
    sysUser: String
}, {
    timestamps: true
});

export const UserMachineModel = Mongoose.model('UserMachine', userMachineSchema);