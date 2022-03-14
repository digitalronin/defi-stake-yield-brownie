import {Token} from "../Main"
import {BalanceMsg} from "../BalanceMsg"

export interface WalletBalanceProps {
  token: Token
  balance: number
}

export const WalletBalance = ({token, balance}: WalletBalanceProps) => {
  const {image, name} = token
  return (
    <BalanceMsg label={`Your un-staked ${name} balance`}
      tokenImgSrc={image}
      amount={balance} />
  )
}
