var SimpleStorage = artifacts.require("./Comment.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
