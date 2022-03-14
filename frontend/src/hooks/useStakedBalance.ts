import {useEthers, useCall} from "@usedapp/core"
import {formatUnits} from "@ethersproject/units"
import {useTokenFarmContract} from "./utils"

export const useStakedBalance = (tokenAddress: string) => {
  const {account} = useEthers()
  const tokenFarmContract = useTokenFarmContract()

  const {value: tokenBalance} = useCall({
    contract: tokenFarmContract,
    method: "stakingBalance",
    args: [tokenAddress, account]
  }) ?? {}

  const formattedBalance: number =
    tokenBalance ? parseFloat(formatUnits(tokenBalance[0], 18)) : 0

  return {balance: formattedBalance}
}
