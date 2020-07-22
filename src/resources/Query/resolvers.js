import { login } from "../user/data";

import { genericQueryResolver } from "../util";
import { random } from "lodash";

export default {
    Query: {
        hello: () => "Hello World :)",

        sysMachine: genericQueryResolver,
        allSysMachines: genericQueryResolver,

        allUserMaintenances: genericQueryResolver,
        dueUserMaintenances: genericQueryResolver,

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