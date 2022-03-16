import {useEffect} from "react"

import {useContractFunction} from "@usedapp/core"
import {useTokenFarmContract} from "./utils"

export const useIssueTokens = () => {
  const tokenFarmContract = useTokenFarmContract()

  const {send: issueTokensSend, state: issueTokensState}
    = useContractFunction(tokenFarmContract, "issueTokens", {transactionName: "Issue tokens"})

  const issueTokens = () => {
    console.log("Issue tokens!!")
    issueTokensSend()
  }

  useEffect(() => {
    if (issueTokensState.status === "Success") {
      console.log("Tokens issued successfully!")
    } else {
      console.log(`issueTokensState: ${issueTokensState.status}`)
      if (issueTokensState.errorMessage !== undefined) {
        console.log(`error: ${issueTokensState.errorMessage}`)
      }
    }
  }, [issueTokensState])

  return {issueTokens, state: issueTokensState}
}
