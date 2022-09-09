const LeeChiaHao721 = artifacts.require("LeeChiaHao721");
const LeeChiaHao20 = artifacts.require("LeeChiaHao20");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer, network, accounts) {
    await deployProxy(LeeChiaHao721, { deployer, initializer: 'initialize' });
    await deployProxy(LeeChiaHao20, { deployer, initializer: 'initialize' });
};
