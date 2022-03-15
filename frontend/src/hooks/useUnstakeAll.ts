import {useEffect} from "react"
import {useContractFunction} from "@usedapp/core"
import {useTokenFarmContract} from "./utils"

export const useUnstakeAll = (tokenAddress: string) => {
  const tokenFarmContract = useTokenFarmContract()

  const {send: unStakeSend, state: unStakeState}
    = useContractFunction(tokenFarmContract, "unstakeTokens", {transactionName: "Unstake tokens"})

  const unStakeAll = () => {
    console.log("Unstake all the things!!!", tokenAddress)
    unStakeSend(tokenAddress)
  }

  useEffect(() => {
    if (unStakeState.status === "Success") {
      console.log("Unstaked successfully!")
    } else {
      console.log(`unStakeState: ${unStakeState.status}`)
      if (unStakeState.errorMessage !== undefined) {
        console.log(`error: ${unStakeState.errorMessage}`)
      }
    }
  }, [unStakeState])

  return {unStakeAll, state: unStakeState}
}
