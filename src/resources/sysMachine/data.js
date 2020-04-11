import { SysMachineModel } from "./model";
import {} from "../sysGroup/data";
import { fetchSysGroup } from "../sysGroup/data";

export const sysMachineBatchingFunc = async ids => {
    try {
        const sysMachines = await SysMachineModel.find({
            _id: { $in: ids }
        });
    } catch (e) {
        throw e;
    }
};

export const fetchAllSysMachines = async(sysGroupLoader, sysManufacturerLoader) => {
    const machines = await SysMachineModel.find({
        name: { $regex: /Dermo/ }
    });

    return machines.map(machine => {
        return {
            ...machine._doc,
            group: () => sysGroupLoader.load(machine._doc.sysGroupId),
            manufacturer: () => sysManufacturerLoader.load(machine._doc.sysManufacturerId)
                //group: () => fetchSysGroup(ctx.sysGroupLoader, machine._doc.sysGroupId),
                //manufacturer: () => fetchSysManufacturer(machine._doc.sysManufacturerId)
        }
    })
};

export const transformSysMachine = (sysMachineObj, ctx) => {
    const { sysGroupLoader } = ctx;
    return {
        ...sysMachineObj._doc,
        //manufacturer: () =>
        group: () => sysGroupLoader.load(sysMachineObj._doc.sysGroupId)
    }
};