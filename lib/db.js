// TODO: actually use mongodb lol

module.exports.tryGetUserByID = tryGetUserByID;
async function tryGetUserByID(userID) {
    return require("../mockuser.json");
}

module.exports.getUserByID = getUserByID;
async function getUserByID(userID) {
    let user = await tryGetUserByID(userID);
    if (user) return user;
    else throw new Error(`no such user id=${userID}`);
}

module.exports.tryGetTandaByID = tryGetTandaByID;
async function tryGetTandaByID(tandaID) {
    throw new Error('tryGetTandaByID is unimplemented')
}

module.exports.getTandaByID = getTandaByID;
async function getTandaByID(tandaID) {
    let tanda = await tryGetTandaByID(tandaID);
    if (tanda) return tanda;
    else throw new Error(`no such tanda id=${tandaID}`);
}
