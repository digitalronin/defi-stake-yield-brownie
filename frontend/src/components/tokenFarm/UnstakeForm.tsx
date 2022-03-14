import {MouseEventHandler} from "react"
import {Button, CircularProgress} from "@material-ui/core"
import {Token} from "../Main"
import {StakedBalance} from "./StakedBalance"
import {useStakedBalance} from "../../hooks/useStakedBalance"

export interface UnstakeFormProps {
  token: Token
  className: string
  handleUnstakeSubmit: MouseEventHandler
  isMining: boolean
}

export const UnstakeForm = ({token, className, handleUnstakeSubmit, isMining}: UnstakeFormProps) => {
  const {balance: stakedBalance} = useStakedBalance(token.address)
  const zeroBalance = stakedBalance === 0
  return (
    <div className={className}>
      <StakedBalance token={token} balance={stakedBalance} />
      <Button
        onClick={handleUnstakeSubmit}
        color="primary"
        disabled={zeroBalance || isMining}
        size="large">
        {isMining ? <CircularProgress size={26} /> : "Unstake All"}
      </Button>
    </div>
  )
}
