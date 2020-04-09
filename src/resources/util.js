import { AuthenticationError } from 'apollo-server';
import { UserModel } from './user/model';

export const genericCreateResolver = async(Model, args, callback) => {
    try {
        const entity = new Model({
            ...args
        });
        const newEntity = await entity.save();
        return callback(newEntity);
    } catch (e) {
        throw e;
    }
};

/**
 * withAuth(token, 'read:machines', (machine, continue) =>
 */




export const withAuth = async(jwt, user, expectedScope, cb) => {
    if (!jwt) throw new AuthenticationError('No valid JWT found. Please log in first');

    const scope = user._doc.scope;

    if (!scope.includes(expectedScope)) throw new AuthenticationError('You do not have the permissions to do that');

    return cb();
}