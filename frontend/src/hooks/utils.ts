import {useEthers} from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import {constants, utils} from "ethers"
import mapJson from "../chain-info/deployments/map.json"
import {Contract} from "@ethersproject/contracts"

export const useTokenFarmContract = () => {
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

  const {chainId} = useEthers()
  const {abi} = TokenFarm
  const tokenFarmAddress = getTokenFarmAddress(chainId)
  const tokenFarmInterface = new utils.Interface(abi)

  return new Contract(tokenFarmAddress, tokenFarmInterface)
}
