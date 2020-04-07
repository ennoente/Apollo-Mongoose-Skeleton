import Mongoose from 'mongoose';

const sysGroupSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,

  sysEdit: String,
  sysUser: String
});

export const SysGroupModel = Mongoose.model('SysGroup', sysGroupSchema);
