import { login } from "../user/data";

import { genericQueryResolver } from "../util";

export default {
    Query: {
        hello: () => "Hello World :)",

        sysMachine: genericQueryResolver,
        allSysMachines: genericQueryResolver,

        login: async(parent, args) => {
            return await login(args);
        },

        me: genericQueryResolver,

        /*
        me: async(parent, args, ctx) => {
            const { jwt, userMachineLoader } = ctx;
            return await fetchUserByJWT(jwt, ctx);
        },
        */
    },
};