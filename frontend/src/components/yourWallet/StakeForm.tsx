import React, {useState, useEffect} from "react"
import {formatUnits} from "@ethersproject/units"
import {utils} from "ethers"
import {useEthers, useTokenBalance, useNotifications} from "@usedapp/core"
import {Button, Input} from "@material-ui/core"
import {Token} from "../Main"
import {useStakeTokens} from "../../hooks/useStakeTokens"

export interface StakeFormProps {
  token: Token
}

export const StakeForm = ({token}: StakeFormProps) => {
  const {address: tokenAddress, name} = token
  const {account} = useEthers()
  const tokenBalance = useTokenBalance(tokenAddress, account)
  const formattedBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
  const {notifications} = useNotifications()

  const [amount, setAmount] = useState<number | string | Array<number | string>>(0)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value === "" ? "" : Number(event.target.value)
    setAmount(newAmount)
  }

  const {approveAndStake, approveErc20State} = useStakeTokens(tokenAddress)

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
      <Button onClick={handleStakeSubmit} color="primary" size="large">Stake!</Button>
    </div>
  )
}
