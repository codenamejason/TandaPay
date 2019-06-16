const mongoose = require("mongoose");
const Group = mongoose.model("groups");

let checkSetupSettings = async (req, res, next) => {
    const { role, accessCode, walletProvider, ethAddress } = req.body;

    if (role === "policyholder" && accessCode === "") {
        return res.status(400).send("Policyholder must provide access code");
    }

    if (role !== "policyholder" && role !== "secretary") {
        return res.status(400).send("Invalid role for user");
    }

    if (walletProvider !== "metamask" && walletProvider !== "fortmatic") {
        return res.status(400).send("Invalid Wallet Provider");
    }
    //check if the eth address is a valid address
    if (!ethAddress) {
        return res.status(400).send("Invalid Ethereum account");
    }
    next();
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @todo get groupID from accessCode
 */
let saveUpdates = async (req, res, next) => {
    const { role, accessCode, walletProvider, ethAddress } = req.body;
    const group = await Group.findOne({ accessCode });
    const user = req.user;
    user.role = role;
    user.walletProvider = walletProvider;
    user.ethereumAddress = ethAddress;
    user.accountCompleted = true;
    user.groupID = group._id;
    await user.save();
    req.user = user;
    next();
};

let generateUpdatedToken = async (req, res, next) => {
    const user = req.user;
    try {
        const token = await user.generateAuthToken();
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(400).send(e);
    }
};

const sendProfile = (req, res) => {
    const token = req.token;
    const user = req.user;
    const {
        email,
        name,
        status,
        accountCompleted,
        role,
        walletProvider,
        picture,
        phone,
        ethereumAddress,
        settings,
    } = user;
    return res.send({
        token,
        email,
        name,
        status,
        accountCompleted,
        role,
        walletProvider,
        picture,
        phone,
        ethereumAddress,
        settings,
    });
};
module.exports = {
    checkSetupSettings,
    saveUpdates,
    generateUpdatedToken,
    sendProfile,
};
