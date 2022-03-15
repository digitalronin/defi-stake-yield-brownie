# Brownie DeFi Stake/Yield Demo

This is my version of the "full stack" (i.e. front-end and back-end) DeFi stake/yield project from lesson 13 of [this](https://www.freecodecamp.org/news/learn-solidity-blockchain-and-smart-contracts-in-a-free/) course at [freeCodeCamp](https://www.freecodecamp.org).

My code and tests are a little different from those in the course, but the overall results should be the same.

I'm using the Rinkeby network, rather than Kovan, for my deployments; mainly because Rinkeby test Ether is [easier to get](https://faucet.rinkeby.io/) than Kovan Ether.

## Deployed App.

A version of the frontend app, using the Ethereum Rinkeby test network, is deployed [here](https://digitalronin.github.io/defi-stake-yield-brownie/frontend/build/)

The frontend is set up to automatically deploy via GitHub Pages, using a GitHub Action defined in `.github/workflows/deploy.yml`

If you want to use the same process for your own fork you will need to change `digitalronin` to your GitHub username in the URL above, and in the `homepage` entry in `frontend/package.json`

If you are deploying to the root of your own domain, you can remove the `homepage` entry.

## Pre-requisites

- [python3](https://www.python.org/), [npm](https://nodejs.org/en/knowledge/getting-started/npm/what-is-npm/) and [yarn](https://yarnpkg.com/)
- [Brownie](https://github.com/eth-brownie/brownie#brownie) smart contract development toolkit
- The private key for an ethereum wallet with some Rinkeby test Ether to pay for the deployment transaction, and to use when interacting with the contracts
- An [Infura](https://infura.io/) to enable deployment to a public network (Rinkeby)
- An [Etherscan API key](https://etherscan.io/myapikey) Ethereum project ID (to enable validating the source code when the smart contracts are deployed)

## Setting up

- Copy `dotenv.example` to `.env` and replace the placeholders with your own values.
- `cd frontend; yarn` to install JS packages

> After running `yarn` run this:

```
rm -rf frontend/node_modules/\@usedapp/core/node_modules/\@ethersproject/
```

This fixes a [bug](https://github.com/TrueFiEng/useDApp/issues/263#issuecomment-961158657)

## Running the front-end

```
cd frontend
yarn start
```

## Testing

`brownie test`

## Deploying

Deploy the smart contracts like this:

```
brownie run scripts/deploy.py --network rinkeby
```

## TODO

- Disable stake button between approval and staking tx
- Make it look prettier
  - add space below the TokenFarm component
- Hide the whole app. if the user's wallet is not connected (use the useDapp modal to force user to connect?)
- Don't bother with the approve step if there is already sufficient allowance for the staking call to succeed
- Don't disconnect on every page refresh (if that's possible)
- Add "unsupported chain" notification
- Replace hardcoded strings with constants (e.g. tx names)
- Don't get token balances for all tabs - just for the selected tab
- Add an admin page with a button to call `issueTokens` to distribute staking rewards
- Properly fix the bug where 1000+ staking transactions were created after approve TX succeeds (I have a workaround in place, but it would be better to understand and correct the real problem)
