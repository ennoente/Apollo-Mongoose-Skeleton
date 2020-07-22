import {withAuth, genericQueryResolver, genericCreateResolver, genericUpdateResolver, genericDeleteResolver, customResolver} from "../util";
import { createUser } from "../user/data";
import { createUserMachine } from '../userMachine/data';
import { createUserRoom } from '../userRoom/data';


export default {
    Mutation: {
        createUser: async(parent, args, ctx, info) => {
            return await createUser(args);
            //return genericQueryResolver(parent, args, ctx, info);
        },

        createSysMachine: genericCreateResolver,
        updateSysMachine: genericUpdateResolver,
        deleteSysMachine: genericDeleteResolver,

        createUserMaintenance: genericCreateResolver,
        updateUserMaintenance: genericUpdateResolver,
        deleteUserMaintenance: genericDeleteResolver,

        createUserRoom: genericCreateResolver,
        updateUserRoom: genericUpdateResolver,
        deleteUserRoom: genericDeleteResolver,
        
        createUserMachine: genericCreateResolver,
        updateUserMachine: genericUpdateResolver,
        deleteUserMachine: genericDeleteResolver,

        //markDueMaintenanceAsDone: genericUpdateResolver
        markDueMaintenanceAsDone: customResolver
    }
};