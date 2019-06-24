import Web3 from "web3";
import Fortmatic from "fortmatic";
const fm = new Fortmatic("pk_test_B9292FFD792747D9");

/**
 * @summary
 * @param {*} user
 * @global
 */
const attemptConnection = async user => {
    const { walletProvider } = user;
    console.log(user);
    if (walletProvider === "metamask") {
        connectToMetamask();
    } else {
        connectToFortmatic();
    }
};
/**
 * @summary
 * @global
 */
const connectToMetamask = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.enable();
            console.log("Metamask Web3 function: ", accounts);
            return [accounts, null];
        } catch (error) {
            //User rejected account access
            return [null, "There's been an error"];
        }
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        return ["success", null];
    } else {
        //account doesn't have metamask
        return [null, "There's been an error"];
    }
};

/**
 * @summary
 * @global
 */
const connectToFortmatic = async () => {
    window.web3 = new Web3(fm.getProvider());

    try {
        const accounts = await window.web3.currentProvider.enable();
        console.log("Fortmatic Web3 Function: ", accounts);
        return [accounts, null];
    } catch (error) {
        console.log(error);
        return [null, error];
    }
};

/**
 * @summary
 * @global
 */
const currentProvider = () => {
    const currentProvider = window.web3.currentProvider;
    let wallet = "";
    if (currentProvider.isFortmatic) {
        wallet = "fortmatic";
    } else if (currentProvider.host === "metamask") {
        wallet = "metamask";
    }

    return wallet;
};

export {
    connectToMetamask,
    connectToFortmatic,
    currentProvider,
    attemptConnection,
};
