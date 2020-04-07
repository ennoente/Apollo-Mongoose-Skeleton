import { SysGroupModel } from "./model";

export const sysGroupBatchingFunc = async (ids) => {
  const sysGroups = await SysGroupModel.find({
    id: { $in: ids }
  });
  return sysGroups.map(sysGroup => {
    return transform(sysGroup);
  })
};

const transform = sysGroupObj => {
  return {
    ...sysGroupObj._doc
  }
};
