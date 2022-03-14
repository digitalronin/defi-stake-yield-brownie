import {Token} from "../Main"
import {BalanceMsg} from "../BalanceMsg"

export interface StakedBalanceProps {
  token: Token,
  balance: number
}

export const StakedBalance = ({token, balance}: StakedBalanceProps) => {
  const {image, name} = token

  return (
    <BalanceMsg label={`Your staked ${name} balance`}
      tokenImgSrc={image}
      amount={balance} />
  )
}
