import {useEthers, useTokenBalance} from "@usedapp/core"
import {formatUnits} from "@ethersproject/units"
import {Token} from "../Main"

export interface WalletBalanceProps {
  token: Token
}

export const WalletBalance = ({token}: WalletBalanceProps) => {
  const {image, address, name} = token
  const {account} = useEthers()
  const tokenBalance = useTokenBalance(address, account)
  const formattedBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
  return (<div>{formattedBalance}</div>)
}
