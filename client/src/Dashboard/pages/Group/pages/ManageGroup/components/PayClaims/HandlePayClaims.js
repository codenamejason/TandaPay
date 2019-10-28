import Group from "../../../../../../../web3/contracts/Service.json";
const contract = require("@truffle/contract");

export function payClaims(web3, peroid) {
  const group = contract(Group);
  group.setProvider(web3.currentProvider);

  var groupInstance;

  // Get current ethereum wallet.
  web3.eth.getCoinbase((error, coinbase) => {
    // Log errors, if any.
    if (error) {
      console.error(error);
    }

    group.deployed().then(function(instance) {
      groupInstance = instance;
      groupInstance
        .payClaims(peroid, { from: coinbase })
        .then(function(result) {
          console.log(result);

          // If no error, login user.
          //return dispatch(loginUser());
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
}
