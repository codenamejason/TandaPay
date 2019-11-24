const DaiContract = artifacts.require("DaiContract.sol");
const Group = artifacts.require("Group.sol");
const Service = artifacts.require("Service.sol");
// const TPLedger = artifacts.require("./TandaPayLedger.sol");

module.exports = function(deployer) {
  //deployer.deploy(DaiContract);
  deployer.deploy(Service, "0xF555C7Fe30eb1C78DF20f223A8BB04D8B92AF56A");
  // deployer.deploy(
  //   Group,
  //   "0xE8d53C297021685677d080485B39e8473BdF7D1C",
  //   "0x5C4005AB5AB1a7Af9D479563e85D6C29778B2e24",
  //   20,
  //   30
  // );
};
