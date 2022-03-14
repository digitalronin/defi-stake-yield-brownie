import React, {useState, useEffect} from "react"
import {utils} from "ethers"
import {Button, Input, CircularProgress} from "@material-ui/core"
import {Token} from "../Main"
import {useStakeTokens} from "../../hooks/useStakeTokens"

export interface StakeFormProps {
  token: Token
}

export const StakeForm = ({token}: StakeFormProps) => {
  const {address: tokenAddress, name} = token
  const {notifications} = useNotifications()

  const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value === "" ? "" : Number(event.target.value)
    setAmount(newAmount)
  }

  const {approveAndStake, state: approveAndStakeErc20State} = useStakeTokens(tokenAddress)

  const isMining = approveAndStakeErc20State.status === "Mining"

  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString())
    return approveAndStake(amountAsWei.toString())
  }

  useEffect(() => {
    if (notifications.filter(
      (notification) =>
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Approve ERC20 transfer").length > 0) {
      console.log("Approved")
    }
    if (notifications.filter(
      (notification) =>
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Stake tokens").length > 0) {
      console.log("Staked")
    }
  }, [notifications])

  return (
    <div>
      <Input onChange={handleInputChange} />
      <Button
        onClick={handleStakeSubmit}
        color="primary"
        disabled={isMining}
        size="large">
        {isMining ? <CircularProgress size={26} /> : "Stake!"}
      </Button>
    </div>
  )
}
