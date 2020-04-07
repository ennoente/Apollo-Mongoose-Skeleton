import Mongoose from 'mongoose';

const sysManufacturerSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,

  sysEdit: String,
  sysUser: String
});

export const SysManufacturerModel = Mongoose.model('SysManufacturer', sysManufacturerSchema);
