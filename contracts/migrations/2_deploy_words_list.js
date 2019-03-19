const WordsList = artifacts.require("./WordsList.sol");

module.exports = function(deployer) {
  deployer.deploy(WordsList);
};
