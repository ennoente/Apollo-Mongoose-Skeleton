import { UserMachineModel } from "./model";

export const fetchUserMachinesByUserId = async userId => {
  const userMachines = await UserMachineModel.find({
    userId: userId
  });


};

export const userMachineBatchingFunc = async ids => {
  try {
    return await UserMachineModel.find({
      _id: {$in: ids}
    });
  } catch (e) {
    throw e;
  }
};

const transform = (obj, sysMachineLoader, userLoader) => {
  return {
    ...obj._doc,
    sysMachine: sysMachineLoader.load(obj.sysMachineId),
    user:
  }
};
