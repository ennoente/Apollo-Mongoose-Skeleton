import Mongoose from 'mongoose';

const userSchema = new Mongoose.Schema({
    email: {
        type: String,
        //required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        //required: true
    },
    scope: [{
        type: String
    }],

    machineIds: [{
        type: Mongoose.ObjectId,
        ref: 'UserMachines',
        inversedBy: 'userId'
    }],
    rooms: [{
        type: Mongoose.ObjectId,
        red: 'UserRooms'
    }]
});

export const UserModel = Mongoose.model('User', userSchema);