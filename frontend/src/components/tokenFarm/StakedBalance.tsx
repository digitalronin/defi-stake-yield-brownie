import {Token} from "../Main"
import {BalanceMsg} from "../BalanceMsg"

export interface StakedBalanceProps {
  token: Token
}

export const StakedBalance = ({token}: StakedBalanceProps) => {
  const {image, address, name} = token

  return (
    <BalanceMsg label={`Your staked ${name} balance`}
      tokenImgSrc={image}
      amount={99999} />
  )
}
