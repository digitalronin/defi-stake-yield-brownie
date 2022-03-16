# Brownie DeFi Stake/Yield Demo

This is my version of the "full stack" (i.e. front-end and back-end) DeFi stake/yield project from lesson 13 of this [course] course at [freeCodeCamp].

My code and tests are a little different from those in the course, but the overall results should be the same.

I'm using the Rinkeby network, rather than Kovan, for my deployments; mainly because Rinkeby test Ether is [easier to get][rinkeby faucet] than Kovan Ether.

## Deployed App.

A version of the frontend app, using the Ethereum Rinkeby test network, is deployed [here][deployed_url]

The frontend is set up to automatically deploy via GitHub Pages, using a GitHub Action defined [here][github action file]

If you want to use the same process for your own fork you will need to change `digitalronin` to your GitHub username in the URL above, and in the `homepage` entry in `frontend/package.json`

If you are deploying to the root of your own domain, you must remove the `homepage` entry.

## Pre-requisites

- [python3], [npm] and [yarn]
- [brownie] smart contract development toolkit
- The private key for an ethereum wallet with some Rinkeby test Ether to pay for the deployment transaction, and to use when interacting with the contracts
- An [Infura] project ID to enable deployment to a public network (Rinkeby)
- An [Etherscan API key] to enable validating the source code when the smart contracts are deployed

## Setting up

- Copy `dotenv.example` to `.env` and replace the placeholders with your own values.
- `cd frontend; yarn` to install JS packages

> After running `yarn` run this:

```
rm -rf frontend/node_modules/\@usedapp/core/node_modules/\@ethersproject/
```

This fixes a [bug][contract type bug].

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

The frontend is automatically [deployed on GitHub Pages][deployed_url] whenever a change is pushed to the `main` branch.

See the [github action file] for more details.

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
- Properly fix the bug where 1000+ staking transactions were created after approve TX succeeds (I have a workaround in place, but it would be better to understand and correct the real problem)
- Create a mobile-friendly version (offer WalletConnect as an option?)
- Disconnect if the user switches accounts in their wallet (currently, the "DISCONNECT" button is still shown, but I don't think the connection is working properly)
- Admin: show remaining DAPP token balance of TokenFarm contract
- Move the deployed app. to Heroku, so that I can use the react router to have multiple pages


[deployed_url]: https://digitalronin.github.io/defi-stake-yield-brownie/frontend/build/
[github action file]: .github/workflows/deploy.yml
[course]: https://www.freecodecamp.org/news/learn-solidity-blockchain-and-smart-contracts-in-a-free/
[freeCodeCamp]: https://www.freecodecamp.org
[rinkeby faucet]: https://faucet.rinkeby.io/

[python3]: https://www.python.org/
[npm]: https://nodejs.org/en/knowledge/getting-started/npm/what-is-npm/
[yarn]: https://yarnpkg.com/
[brownie]: https://github.com/eth-brownie/brownie#brownie
[Infura]: https://infura.io/
[Etherscan API key]: https://etherscan.io/myapikey
[contract type bug]: https://github.com/TrueFiEng/useDApp/issues/263#issuecomment-961158657
