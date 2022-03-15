import {useEffect, useState} from "react"
import {useContractFunction} from "@usedapp/core"
import {utils} from "ethers"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import {Contract} from "@ethersproject/contracts"
import {useTokenFarmContract} from "./utils"

export const useStakeTokens = (tokenAddress: string) => {
  const tokenFarmContract = useTokenFarmContract()
  const tokenFarmAddress = tokenFarmContract.address

  const erc20ABI = ERC20.abi
  const erc20Interface = new utils.Interface(erc20ABI)
  const erc20Contract = new Contract(tokenAddress, erc20Interface)

  const {send: approveErc20Send, state: approveAndStakeErc20State}
    = useContractFunction(erc20Contract, "approve", {transactionName: "Approve ERC20 transfer"})

  const [amountToStake, setAmountToStake] = useState("0")

  const approveAndStake = (amount: string) => {
    setAmountToStake(amount)
    return approveErc20Send(tokenFarmAddress, amount)
  }

  const {send: stakeSend, state: stakeState}
    = useContractFunction(tokenFarmContract, "stakeTokens", {transactionName: "Stake tokens"})

  useEffect(() => {
    if (approveAndStakeErc20State.status === "Success") {
      stakeSend(amountToStake, tokenAddress)
    } else {
      console.log(`approveAndStakeErc20State: ${approveAndStakeErc20State.status}`)
      if (approveAndStakeErc20State.errorMessage !== undefined) {
        console.log(`error: ${approveAndStakeErc20State.errorMessage}`)
      }
    }
  }, [approveAndStakeErc20State, amountToStake, tokenAddress, stakeSend])

  useEffect(() => {
    if (stakeState.status === "Success") {
      console.log("Staked successfully!")
    } else {
      console.log(`stakeState: ${stakeState.status}`)
      if (stakeState.errorMessage !== undefined) {
        console.log(`error: ${stakeState.errorMessage}`)
      }
    }
  }, [stakeState])

  const [state, setState] = useState(approveAndStakeErc20State)

  useEffect(() => {
    if (approveAndStakeErc20State.status === "Success") {
      setState(stakeState)
    } else {
      setState(approveAndStakeErc20State)
    }
  }, [approveAndStakeErc20State, stakeState])

  return {approveAndStake, state}
}
