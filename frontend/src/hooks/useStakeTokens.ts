import {useEthers, useContractFunction} from "@usedapp/core"
import {constants, utils} from "ethers"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import {Contract} from "@ethersproject/contracts"
import mapJson from "../chain-info/deployments/map.json"

export const useStakeTokens = (tokenAddress: string) => {
  function getTokenFarmAddress(chainId: any) {
    let rtn

    if (chainId === undefined) {
      rtn = constants.AddressZero
    } else if (chainId === 1337) {
      // local ganache-cli deployment, so contract addresses are in map.json
      const data = mapJson["dev"]
      rtn = data.TokenFarm[0]
    } else {
      // 'real' deployment, so contract address comes from map.json
      rtn = mapJson[String(chainId)]["TokenFarm"][0]
    }

    return rtn
  }
  // approve
  //   address
  //   abi
  //   chainId
  const {chainId} = useEthers()
  const {abi} = TokenFarm
  const tokenFarmAddress = getTokenFarmAddress(chainId)
  const tokenFarmInterface = new utils.Interface(abi)
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

  const erc20ABI = ERC20.abi
  const erc20Interface = new utils.Interface(erc20ABI)
  const erc20Contract = new Contract(tokenAddress, erc20Interface)
  const {send: approveErc20Send, state: approveErc20State} = useContractFunction(erc20Contract, "approve", {transactionName: "Approve ERC20 transfer"})
  const approve = (amount: string) => {
    return approveErc20Send(tokenFarmAddress, amount)
  }

  return {approve, approveErc20State}



  // stake tokens
}
