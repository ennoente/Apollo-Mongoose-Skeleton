import { createUser } from "./data";

export default {
  Mutation: {
    createUser: async (parent, args, ctx) => await createUser(args)
  }
}