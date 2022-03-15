/* eslint-disable spaced-comment */
/// <reference types="react-scripts" />
import {useEthers} from "@usedapp/core"
import {constants} from "ethers"
import chainNames from "../chain-names.json"
import mapJson from "../chain-info/deployments/map.json"
import brownieConfig from "../brownie-config.json"
import dappImage from "../dapp.png"
import daiImage from "../dai.png"
import ethImage from "../eth.png"
import {YourWallet} from "./yourWallet"
import {TokenFarm} from "./tokenFarm"
import {makeStyles} from "@material-ui/core"

export type Token = {
  image: string,
  address: string,
  name: string
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.white,
    textAlign: "center",
    padding: theme.spacing(4)
  }
}))

export const Main = () => {
  const {chainId} = useEthers()
  const networkName = chainId ? chainNames[String(chainId)] : "dev"
  const classes = useStyles()

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
        dappTokenAddress: data.DappToken[0],
        wethTokenAddress: data.MockWETH[0],
        fauTokenAddress: data.MockDAI[0]
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

  const {dappTokenAddress, wethTokenAddress, fauTokenAddress} = getTokenContractAddresses(chainId)

  const supportedTokens: Array<Token> = [
    {
      image: dappImage,
      address: dappTokenAddress,
      name: "DAPP"
    },
    {
      image: ethImage,
      address: wethTokenAddress,
      name: "WETH"
    },
    {
      image: daiImage,
      address: fauTokenAddress,
      name: "FAU"
    }
  ]

  return (
    <div>
      <h2 className={classes.title}>Dapp Token App</h2>
      <YourWallet supportedTokens={supportedTokens} />
      <TokenFarm supportedTokens={supportedTokens} />
    </div>
  )
}
