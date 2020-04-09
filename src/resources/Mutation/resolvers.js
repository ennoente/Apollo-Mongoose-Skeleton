import { withAuth } from "../util";

import { createUser } from "../user/data";
import { createUserMachine } from "../userMachine/data";
import { createUserRoom } from "../userRoom/data";


export default {
    Mutation: {
        createUser: async(parent, args, ctx) => await createUser(args),
        createUserMachine: async(parent, args, ctx) => {
            return await withAuth(ctx.jwt, ctx.user, "write:usermachines", async() => {
                return await createUserMachine(ctx, args.input);
            })
        },

        createUserRoom: async(parent, args, ctx) =>
            await withAuth(ctx.jwt, ctx.user, "write:userrooms", async() => {
                return await createUserRoom(args.input);
            })
    },
};