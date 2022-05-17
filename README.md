# DAZZLE
A dApp that allows you to send tokens and NFT's to anyone through a simple LINK.

## How we built it
Dazzle's base architecture is made up of three parts: a frontend developed with *ReactJS*, in the backend we have an API with *ExpressJS* and the Smart Contract is made in *Solidity* and deployed in the Hedera blockchain. For the interaction with the user's wallet, the hashconnect library was used, which allows creating and authorizing transactions in *Hashpack*, here we found a limitation of the library that did not allow us to successfully execute the functions of the smart contract from the client, so said interactions were handled in the backend.