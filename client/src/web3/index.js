import Web3 from "web3";
import Fortmatic from "fortmatic";
import DaiContract from "./contracts/DaiContract.json";
import Group from "./contracts/Group.json";
const fm = new Fortmatic(process.env.REACT_APP_FORTMATIC_ID);
const contract = require("@truffle/contract");
/**
 * @summary
 * @param {Object} user
 * @global
 */
const attemptConnection = async user => {
  const { walletProvider } = user;
  if (walletProvider === "metamask") {
    await connectToMetamask();
  } else {
    await connectToFortmatic();
  }

  return window.web3;
};
/**
 * @summary
 * @global
 */
const connectToMetamask = async () => {
  if (window.ethereum) {
    try {
      let accounts = [];

      //if (window.ethereum.selectedAddress === null) {
      try {
        accounts = await window.ethereum.enable();
      } catch (error) {
        console.log(error);
      }

      //try to set this before
      window.web3 = new Web3(window.ethereum);
      console.log(accounts);
      return [accounts, null];
    } catch (error) {
      console.log(error);

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
  try {
    window.web3 = new Web3(fm.getProvider());
    const accounts = await window.web3.currentProvider.enable();
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
  //if web3 in the window isn't defined
  if (!window.web3) {
    return "";
  }
  try {
    const currentProvider = window.web3.currentProvider;
    let wallet = "";
    if (currentProvider.isFortmatic) {
      wallet = "fortmatic";
    } else if (currentProvider.host === "metamask") {
      wallet = "metamask";
    }

    return wallet;
  } catch (error) {
    return "";
  }
};

/**
 * @summary - Queries the contract deployed by DAI to determine the amount of DAI the current user currently has
 * @global
 */
const getDAIBalance = async (web3, DAI) => {
  //

  try {
    const accounts = await web3.eth.getAccounts();
    const balance = await DAI.methods.balanceOf(accounts[0]).call();
    return [web3.utils.fromWei(balance), null];
  } catch (e) {
    return [null, e];
  }
};

/**
 * @summary - Queries the contract deployed by DAI to determine the allowed amount of DAI the current user currently has for premium payment
 * @global
 */
const getDAIPremiumAllowance = async (web3, DAI) => {
  //

  try {
    const accounts = await web3.eth.getAccounts();
    const balance = await DAI.methods
      .allowance(accounts[0], Group.address)
      .call();
    return [web3.utils.fromWei(balance), null];
  } catch (e) {
    return [null, e];
  }
};

const calculatePayment = async (web3, TGP) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const balance = await TGP.methods.calculatePayment(accounts[0]).call();
    console.log(balance, "the premium");

    return [web3.utils.fromWei(balance), null];
  } catch (e) {
    console.log(e, "the premium Error");
    return [null, e];
  }
};

const addPolicyHolderToSmartContract = async (web3, TGP, address, subgroup) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await TGP.methods
      .addPolicyholder(address, subgroup)
      .send({ from: accounts[0] });

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

/**
 * @summary
 * @param {Object} web3
 * @returns {Web3.Contract} returns a new instance of the DAI contract created with the provided web3 instance
 */
const createDAIContract = web3 => {
  return new web3.eth.Contract(
    DaiContract.abi,
    process.env.REACT_APP_DAI_ADDRESS
  );
};

const groupContract = web3 => {
  return new web3.eth.Contract(Group.abi, process.env.REACT_APP_Group_ADDRESS);
};

export {
  connectToMetamask,
  connectToFortmatic,
  currentProvider,
  attemptConnection,
  getDAIBalance,
  calculatePayment,
  createDAIContract,
  addPolicyHolderToSmartContract,
  groupContract
};
