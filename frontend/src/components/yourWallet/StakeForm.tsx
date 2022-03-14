import React, {useState, useEffect} from "react"
import {utils} from "ethers"
import {useNotifications} from "@usedapp/core"
import {Button, Input, CircularProgress, Snackbar} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
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
  const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
  const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false)

  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString())
    return approveAndStake(amountAsWei.toString())
  }

  const handleCloseSnack = () => {
    setShowErc20ApprovalSuccess(false)
    setShowStakeTokenSuccess(false)
  }

  useEffect(() => {
    if (notifications.filter(
      (notification) =>
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Approve ERC20 transfer").length > 0) {
      setShowErc20ApprovalSuccess(true)
      setShowStakeTokenSuccess(false)
    }
    if (notifications.filter(
      (notification) =>
        notification.type === "transactionSucceed" &&
        notification.transactionName === "Stake tokens").length > 0) {
      setShowErc20ApprovalSuccess(false)
      setShowStakeTokenSuccess(true)
    }
  }, [notifications, showErc20ApprovalSuccess, showStakeTokenSuccess])

  return (
    <div>
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
      <Snackbar
        open={showErc20ApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success">
          ERC20 token transfer approved. Now approve the staking transaction.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showStakeTokenSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success">
          ERC20 tokens staked
        </Alert>
      </Snackbar>
    </div>
  )
}
