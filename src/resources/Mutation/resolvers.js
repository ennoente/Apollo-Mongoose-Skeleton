import {withAuth, genericQueryResolver, genericCreateResolver} from "../util";
import { createUser } from "../user/data";
import { createUserMachine } from '../userMachine/data';
import { createUserRoom } from '../userRoom/data';


export default {
    Mutation: {
        createUser: async(parent, args, ctx, info) => {
            await createUser(args);
            return genericQueryResolver(parent, args, ctx, info);
        },
        createUserRoom: genericCreateResolver,
        createUserMachine: genericCreateResolver
    }
};