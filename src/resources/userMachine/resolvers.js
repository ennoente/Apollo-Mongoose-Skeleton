import { SysMachineModel } from '../sysMachine/model';
import { transformSysMachine } from '../sysMachine/data';

export default {
    UserMachine: {
        sysMachine: async(parent, args, ctx) => () => ctx.sysMachineLoader.load(parent.sysMachineId)
            /*
            sysMachine: (parent, args, ctx) => {
                const { sysMachineLoader, sysGroupLoader } = ctx;
                console.log(parent.sysMachineId);
                const sysMachine = sysMachineLoader.load(parent._doc.sysMachineId);
                return transformSysMachine(sysMachine, sysGroupLoader);
            }
            */
    }
}