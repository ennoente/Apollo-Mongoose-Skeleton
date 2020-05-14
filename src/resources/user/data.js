import bcrypt from 'bcrypt';
import jwtLib from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';
import knex from '../../knex';
import { getSQLTable } from '../../joinMasterUtil';



export const createUser = async(args) => {
    const { username, password } = args;
    const sqlTable = getSQLTable('User');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // First element
    try {
        const [newUser] = await knex(sqlTable)
            .insert({
                username: username,
                password: hashedPassword
            });

        return newUser.id
    } catch (e) {
        // MySQL error code - duplicate entry on unique field (username in this case)
        if (e.errno === 1062) {
            throw new Error('User already exists');
        }

        throw new Error(e);
    }
};


export const login = async(args) => {
    const { username, password } = args;

    const user = await knex("sys_user")
        .select('id', 'username', 'email', 'password')
        .where({ username: username })
        .first();

    if (!user)
        return new AuthenticationError('Wrong username - no user found');

    console.log("user.password", user.password);
    console.log("typedPassword", password);

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches)
        return new AuthenticationError('Incorrect password.');

    return await jwtLib.sign({
        userId: user.id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET);
};



const transform = (userObj, userMachineLoader, userRoomLoader) => {
    return {
        ...userObj._doc,
        machines: () => userMachineLoader.loadMany(userObj._doc.machines),
        rooms: () => userRoomLoader.loadMany(userObj._doc.rooms)
    }
};