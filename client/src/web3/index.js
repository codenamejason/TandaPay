import Web3 from "web3";
import Fortmatic from "fortmatic";
const fm = new Fortmatic("pk_test_B9292FFD792747D9");

/**
 * @summary
 * @global
 */
const connectToMetamask = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.enable();
            console.log(accounts);
            return ["success", null];
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
        console.log(accounts);
        return ["success", null];
    } catch (error) {
        console.log(error);
        return [null, error];
    }
};

export { connectToMetamask, connectToFortmatic };
