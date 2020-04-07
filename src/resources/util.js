export const genericCreateResolver = async (Model, args, callback) => {
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




export const withAuth = (jwt, expectedScope, cb) => {
  //if (!token)
}
