import { fetchAllSysMachines } from "../sysMachine/data";
import { login, fetchUserByJWT } from "../user/data";

export default {
    Query: {
        hello: async() => 'Hello World :)',
        allSysMachines: async(parent, args, ctx) => {
            return await fetchAllSysMachines(ctx.sysGroupLoader, ctx.sysManufacturerLoader);
        },

        login: async(parent, args) => {
            return await login(args);
        },

        me: async(parent, args, ctx) => {
            const { jwt, userMachineLoader } = ctx;
            return await fetchUserByJWT(jwt, ctx);
        }
    }
}