import {constants, utils, BigNumber} from "ethers"
import {useEthers, useCall} from "@usedapp/core"
import {Contract} from "@ethersproject/contracts"
import {formatUnits} from "@ethersproject/units"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import mapJson from "../chain-info/deployments/map.json"

export const useStakedBalance = (tokenAddress: string) => {
  // TODO: Extract to a shared file
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

  const {chainId, account} = useEthers()
  const {abi} = TokenFarm
  const tokenFarmAddress = getTokenFarmAddress(chainId)
  const tokenFarmInterface = new utils.Interface(abi)
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

  const {value: tokenBalance} = useCall({
    contract: tokenFarmContract,
    method: "stakingBalance",
    args: [tokenAddress, account]
  }) ?? {}

  const formattedBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance[0], 18)) : 0

  return {balance: formattedBalance}
}
