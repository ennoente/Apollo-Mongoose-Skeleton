import { UserModel } from "./model";
import { genericCreateResolver } from "../util";
import bcrypt from 'bcrypt';
import jwtLib from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';



export const createUser = async (args) => {
  const { email, password } = args;

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await genericCreateResolver(UserModel,
    { email: email, password: hashedPassword },
    (newUser) => transform(newUser));
};


export const login = async (args) => {
  const { email, password } = args;

  const user = await UserModel.findOne({ email: email });
  if (!user) return new AuthenticationError('No user found!');

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return new AuthenticationError('Password incorrect!');

  return await jwtLib.sign({
    userId: user.id,
    email: user.email,
  }, process.env.JWT_SECRET);
};



const transform = (userObj, userMachineLoader) => {
  return {
    ...userObj._doc,
    machines: () => userMachineLoader.loadMany(userObj._doc.machines)
  }
};
