import Sequelize from "sequelize";
import { SysMachine } from '../../models';
import DataLoader from "dataloader";

const sysMachineLoader = new DataLoader(ids => {
  return loadSysMachines(ids);
});

export const loadSysMachines = async ids => {
  //const sysMachines = await SysMachineModel.findAll();
  const sysMachines = await SysMachine.findAll({
    where: {
      id: {
        [Sequelize.Op.in]: ids
      }
    }
  });
  return sysMachines;
};

export const fetchAllSysMachines = async () => {
  try {
    return await SysMachine.findAll();
  } catch (e) {
    throw e;
  }
};
