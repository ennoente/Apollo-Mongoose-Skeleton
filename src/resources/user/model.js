import Mongoose from 'mongoose';

const userSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  machines: [{
    type: Mongoose.ObjectId,
    ref: 'UserMachines'
  }],
  rooms: [{
    type: Mongoose.ObjectId,
    red: 'UserRooms'
  }]
});

export const UserModel = Mongoose.model('User', userSchema);
