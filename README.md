# Tokens Smart Contract

This repository focuses on creating an
**UUPS Upgradeable ERC721 token smart contract**
and **UUPS Upgradeable ERC20 token smart contract**.

A simple frontend for users to perform basic operations such as view contract info, mint, burn and transfer tokens can be found [here](https://leechiahao.github.io/).


The smart contracts has been deployed and verified in Ethereum Goerli Testnet. The two proxy contracts can be accessed from here ([ERC721](https://goerli.etherscan.io/address/0x0a9bd0b740678e195b8ea3e24f0f0a43c7783629#readProxyContract) and [ERC20](https://goerli.etherscan.io/address/0xb9F3a98F45B9Bf60877DF7E31b9c349d41F16C84#readProxyContract).)

# Usage

```npm install```

Install all necessary packages for the project. The configurarion file is in the package.json.

```npm run dev```

Run the project in localhost.

```truffle migrate```

Run this command when you want to migrate the contract. Default is migrate on localhost. Add `--network [networkName]` to specity the blockchain network. Add `--reset` to reset the migrated contract.

# Example screenshot
## ERC721 page
![image](https://user-images.githubusercontent.com/63797235/189523184-7bd675bf-5101-4beb-bd5b-d28edbdc24a5.png)

## Pause/unpause function for contract owner only
![image](https://user-images.githubusercontent.com/63797235/189523276-8cd8870f-7817-4bb9-9d65-ec9290220a11.png)

## ERC20 page
![image](https://user-images.githubusercontent.com/63797235/189523220-a68d39a9-2c87-4673-8edd-a155128636b5.png)

![image](https://user-images.githubusercontent.com/63797235/189523232-d35f8131-4fa1-4977-98c7-adca9fd1f9ce.png)
