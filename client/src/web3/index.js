import Web3 from "web3";
import Fortmatic from "fortmatic";
import Dai from "./contracts/Dai.json";
import Group from "./contracts/Group.json";
import Service from "./contracts/Service.json";
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
const sendDaiToUser = async (web3, DAI, amount, address) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await DAI.methods
      .mint(address, web3.utils.toWei(amount))
      .send({ from: accounts[0] });
    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

const tranferDaiToUser = async (web3, DAI, amount, address) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await DAI.methods
      .transfer(address, web3.utils.toWei(amount))
      .send({ from: accounts[0] });
    return [result, null];
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

const getPastEvent = async (web3, TGP) => {
  TGP.getPastEvents(
    "GroupCreated",
    {
      fromBlock: 0,
      toBlock: "latest"
    }
    // ,
    // function(error, events) {
    //   console.log(events);
    // }
  ).then(function(events) {
    console.log(events); // same results as the optional callback above
  });
};

const finalizeGroupCreationWeb3 = async (web3, TGP, premium, allowedClaims) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await TGP.methods
      .createGroup(accounts[0], allowedClaims, web3.utils.toWei(premium))
      .send({ from: accounts[0] });
    return [result, null];
  } catch (e) {
    return [null, e];
  }
};
const calculatePayment = async (web3, contract) => {
  try {
    const instance = createGroupContract(web3, contract);

    const accounts = await web3.eth.getAccounts();
    const balance = await instance.methods.calculatePayment(accounts[0]).call();

    return [web3.utils.fromWei(balance), null];
  } catch (e) {
    return [null, e];
  }
};

const getActivePeriod = async (web3, contract) => {
  try {
    const instance = createGroupContract(web3, contract);
    const period = await instance.methods.activePeriod().call();
    return [period, null];
  } catch (e) {
    return [null, e];
  }
};

const isSecretary = async (web3, TGP, address) => {
  console.log("Coma");

  try {
    const result = await TGP.methods.isSecretary(address).call();

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

const getGroup = async (web3, TGP, index) => {
  try {
    const result = await TGP.methods.getGroup(index).call();
    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

const addPolicyHolderToSmartContract = async (
  web3,

  address,
  subgroup,
  contract
) => {
  try {
    const instance = createGroupContract(web3, contract);
    const accounts = await web3.eth.getAccounts();
    const result = await instance.methods
      .addPolicyholder(address, subgroup)
      .send({ from: accounts[0] });

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

const defectClaim = async (web3, period, contract) => {
  try {
    const instance = createGroupContract(web3, contract);
    const accounts = await web3.eth.getAccounts();
    const result = await instance.methods
      .defect(period)
      .send({ from: accounts[0] });

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

const payYourPremium = async (web3, contract, period) => {
  try {
    const instance = createGroupContract(web3, contract);
    const accounts = await web3.eth.getAccounts();
    const result = await instance.methods
      .makePayment(period)
      .send({ from: accounts[0] });

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

const startYourGroup = async (web3, contract) => {
  const instance = createGroupContract(web3, contract);

  try {
    const accounts = await web3.eth.getAccounts();
    const result = await instance.methods
      .startGroup()
      .send({ from: accounts[0] });

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

const approvePremiumForSmartContractAddress = async (
  web3,
  DAI,
  amount,
  contract
) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await DAI.methods
      .approve(contract, web3.utils.toWei(amount))
      .send({ from: accounts[0] });

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

const submitClaimToSmartContract = async (web3, contract, period, claimant) => {
  const instance = createGroupContract(web3, contract);
  try {
    const accounts = await web3.eth.getAccounts();
    const result = await instance.methods
      .submitClaim(period, claimant)
      .send({ from: accounts[0] });

    return [result, null];
  } catch (e) {
    return [null, e];
  }
};

const removePolicyHolderFromSmartContract = async (web3, address, contract) => {
  try {
    const instance = createGroupContract(web3, contract);
    const accounts = await web3.eth.getAccounts();
    const result = await instance.methods
      .removePolicyholder(address)
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
  return new web3.eth.Contract(Dai.abi, process.env.REACT_APP_DAI_ADDRESS);
};

const createGroupContract = (web3, address) => {
  return new web3.eth.Contract(Group.abi, address);
};

const groupContract = web3 => {
  //

  return new web3.eth.Contract(
    Service.abi,
    process.env.REACT_APP_Service_ADDRESS
  );
};

export {
  connectToMetamask,
  connectToFortmatic,
  currentProvider,
  attemptConnection,
  getDAIBalance,
  calculatePayment,
  createDAIContract,
  createGroupContract,
  addPolicyHolderToSmartContract,
  removePolicyHolderFromSmartContract,
  groupContract,
  getPastEvent,
  getActivePeriod,
  startYourGroup,
  sendDaiToUser,
  isSecretary,
  payYourPremium,
  getGroup,
  submitClaimToSmartContract,
  finalizeGroupCreationWeb3,
  approvePremiumForSmartContractAddress,
  tranferDaiToUser,
  defectClaim
};
