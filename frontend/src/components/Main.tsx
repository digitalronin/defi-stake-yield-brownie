import {useEthers} from "@usedapp/core"
import {constants} from "ethers"
import chainNames from "../chain-names.json"
import mapJson from "../chain-info/deployments/map.json"
import brownieConfig from "../brownie-config.json"

export const Main = () => {
  const {chainId} = useEthers()
  const networkName = chainId ? chainNames[String(chainId)] : "dev"

  const {dappTokenAddress, wethTokenAddress, fauTokenAddress} = getTokenContractAddresses(chainId)

  function getTokenContractAddresses(chainId: any) {
    let rtn

    if (chainId === undefined) {
      rtn = {
        dappTokenAddress: constants.AddressZero,
        wethTokenAddress: constants.AddressZero,
        fauTokenAddress: constants.AddressZero
      }
    } else if (chainId === 1337) {
      // local ganache-cli deployment, so contract addresses are in map.json
      const data = mapJson["dev"]
      rtn = {
        dappTokenAddress: data.DappToken,
        wethTokenAddress: data.MockWETH,
        fauTokenAddress: data.MockDAI
      }
    } else {
      // 'real' deployment, so contract addresses are in brownie-config.json
      // except DappToken, which is deployed, so comes from map.json
      rtn = {
        dappTokenAddress: mapJson[String(chainId)]["DappToken"][0],
        wethTokenAddress: brownieConfig["networks"][networkName]["weth_token"],
        fauTokenAddress: brownieConfig["networks"][networkName]["fau_token"]
      }
    }

    return rtn
  }

  return (
    <div>
      {networkName}<br />
      {dappTokenAddress}<br />
      {wethTokenAddress}<br />
      {fauTokenAddress}<br />
    </div>
  )
}
