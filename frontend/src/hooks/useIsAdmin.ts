import {useEthers, useCall} from "@usedapp/core"
import {useTokenFarmContract} from "./utils"

export const useIsAdmin = (): boolean => {
  const tokenFarmContract = useTokenFarmContract()
  const {account} = useEthers()

  const {value: owner} = useCall({
    contract: tokenFarmContract,
    method: "owner",
    args: []
  }) ?? {}

  if (owner !== undefined && account !== undefined && owner[0] === account) {
    return true
  } else {
    return false
  }
}
