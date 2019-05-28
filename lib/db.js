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
