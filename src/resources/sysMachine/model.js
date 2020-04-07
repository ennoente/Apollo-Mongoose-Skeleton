import Mongoose from 'mongoose';
import DataLoader from 'dataloader';

const sysMachineSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,

  sysManufacturer: {
    type: Number,
    ref: 'SysManufacturer'
  },
  sysGroup: {
    type: Number,
    ref: 'SysGroup'
  },

  sysEdit: String,
  sysUser: String
});

export const SysMachineModel = Mongoose.model('SysMachine', sysMachineSchema);


