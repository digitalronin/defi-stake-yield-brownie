import {useEthers} from "@usedapp/core"
import chainNames from "../chain-names.json"

export const Main = () => {
  const {chainId} = useEthers()
  const networkName = chainId ? chainNames[chainId] : "dev"
  return (
    <div>{networkName}</div>
  )
}
