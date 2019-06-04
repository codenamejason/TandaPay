// TODO: actually use mongodb lol

/**
 * @summary: retrieves a document from the users collection by its _id. May
 *           return null when no such document exists.
 * @param userID: the document's _id
 * @returns: null or the document
 * @todo
 */
module.exports.tryGetUserByID = tryGetUserByID;
async function tryGetUserByID(userID) {
    return require("../mockuser.json");
}

/**
 * @summary: retrieves a document from the users collection by its _id. Throws
 *           if no such document exists
 * @param userID: the document's _id
 * @returns: the document
 */
module.exports.getUserByID = getUserByID;
async function getUserByID(userID) {
    let user = await tryGetUserByID(userID);
    if (user) return user;
    else throw new Error(`no such user id=${userID}`);
}

/**
 * @summary: retrieves a document from the tandas collection by its _id. May
 *           return null when no such document exists.
 * @param tandaID: the document's _id
 * @returns: null or the document
 * @todo
 */
module.exports.tryGetTandaByID = tryGetTandaByID;
async function tryGetTandaByID(tandaID) {
    throw new Error('tryGetTandaByID is unimplemented')
}

/**
 * @summary: retrieves a document from the tandas collection by its _id. Throws
 *           if no such document exists
 * @param tandaID: the document's _id
 * @returns: the document
 */
module.exports.getTandaByID = getTandaByID;
async function getTandaByID(tandaID) {
    let tanda = await tryGetTandaByID(tandaID);
    if (tanda) return tanda;
    else throw new Error(`no such tanda id=${tandaID}`);
}
