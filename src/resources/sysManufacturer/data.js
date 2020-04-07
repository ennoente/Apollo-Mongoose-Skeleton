import { SysManufacturerModel } from "./model";

export const sysManufacturerBatchFunc = async (ids) => {
  try {
    const manufacturers = await SysManufacturerModel.find({
      id: { $in: ids }
    });
    return manufacturers.map(manufacturer => {
      return transform(manufacturer);
    });
  } catch (e) {
    throw e;
  }
};

const transform = manufacturer => {
  return {
    ...manufacturer._doc
  }
};
