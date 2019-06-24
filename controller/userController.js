let Group = require("../models/Group");

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

    let group = await Group.findByAccessCode(accessCode);
    if (!group) {
        return res.status(400).send("Invalid access code");
    }
    next();
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
let saveUpdates = async (req, res, next) => {
    const { role, accessCode, walletProvider, ethAddress } = req.body;
    const user = req.user;

    if (user.accountCompleted) {
        return res.status(400).send("User already completed");
    }

    user.role = role;
    user.walletProvider = walletProvider;
    user.ethereumAddress = ethAddress;
    user.accountCompleted = true;
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

const updateWallet = async (req, res, next) => {
    try {
        const user = req.user;
        const { provider, ethAddress } = req.body;
        user.walletProvider = provider;
        user.ethereumAddress = ethAddress;
        const newUser = await user.save();
        req.user = newUser;
        next();
    } catch (e) {
        res.status(500).send(e);
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
    updateWallet,
    sendProfile,
};
