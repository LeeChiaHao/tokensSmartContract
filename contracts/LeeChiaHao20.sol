// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// UUPSUpgradeable ERC20 token
contract LeeChiaHao20 is
    Initializable,
    ERC20CappedUpgradeable,
    ERC20BurnableUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("LeeChiaHao", "LCH");
        __ERC20Capped_init(1000000 * (10**uint256(18))); // cap supply = 1,000,000
        __Ownable_init();
        __UUPSUpgradeable_init();
        initSupply(); // initial token supply
    }

    // override the _mint function from multiple parent contract
    function _mint(address to, uint256 amount)
        internal
        override(ERC20CappedUpgradeable, ERC20Upgradeable)
    {
        super._mint(to, amount);
    }

    // initial token supply of 100,000 tokens
    function initSupply() private onlyOwner {
        _mint(msg.sender, 100000 * (10**uint256(18)));
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount * (10**uint256(18)));
    }

    // override the transfer function and add partial burn function
    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        uint256 adjustAmount = amount * (10**uint256(18));
        super.transfer(to, adjustAmount);
        partialBurn(to, adjustAmount);
        return true;
    }

    // override the transferFrom function and add partial burn function
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        uint256 adjustAmount = amount * (10**uint256(18));
        super.transferFrom(from, to, adjustAmount);
        partialBurn(to, adjustAmount);
        return true;
    }

    // burn 10% amount of transfer
    function partialBurn(address account, uint256 amount) internal {
        uint256 burn = amount / 10;
        _burn(account, burn);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}
}
