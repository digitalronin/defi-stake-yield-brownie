import {Token} from "../Main"
import {BalanceMsg} from "../BalanceMsg"
import {useStakedBalance} from "../../hooks/useStakedBalance"

export interface StakedBalanceProps {
  token: Token
}

export const StakedBalance = ({token}: StakedBalanceProps) => {
  const {image, address: tokenAddress, name} = token
  const {balance: stakedBalance} = useStakedBalance(tokenAddress)

  return (
    <BalanceMsg label={`Your staked ${name} balance`}
      tokenImgSrc={image}
      amount={stakedBalance} />
  )
}
