# Brownie DeFi Stake/Yield Demo

This is my version of the "full stack" (i.e. front-end and back-end) DeFi stake/yield project from lesson 13 of [this](https://www.freecodecamp.org/news/learn-solidity-blockchain-and-smart-contracts-in-a-free/) course at [freeCodeCamp](https://www.freecodecamp.org).

My code and tests are a little different from those in the course, but the overall results should be the same.

I'm using the Rinkeby networkk, rather than Kovan, for my deployments; mainly because Rinkeby test Ether is [easier to get](https://faucet.rinkeby.io/) than Kovan Ether.

## Pre-requisites

- [Brownie](https://github.com/eth-brownie/brownie#brownie)
- The private key for an ethereum wallet with some Rinkeby test Ether
- An [Infura](https://infura.io/) Ethereum project ID
- An [Etherscan API key](https://etherscan.io/myapikey)

## Setting up

Copy `dotenv.example` to `.env` and replace the placeholders with your own values.

## Testing

`brownie test`

## Deploying

`brownie run scripts/deploy.py --network rinkeby`

