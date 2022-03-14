import {useEthers, useTokenBalance} from "@usedapp/core"
import {formatUnits} from "@ethersproject/units"
import {Token} from "../Main"
import {WalletBalance} from "./WalletBalance"
import {StakeForm} from "./StakeForm"

export interface TokenBalanceAndStakeFormProps {
  token: Token
  className: string
}

export const TokenBalanceAndStakeForm = ({token, className}: TokenBalanceAndStakeFormProps) => {
  const {account} = useEthers()
  const tokenBalance = useTokenBalance(token.address, account)
  const formattedBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
  console.log("formattedBalance", formattedBalance)

  return (
    <div className={className}>
      <WalletBalance token={token} balance={formattedBalance} />
      <StakeForm token={token} balance={formattedBalance} />
    </div>
  )
}
