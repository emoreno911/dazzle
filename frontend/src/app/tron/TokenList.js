import TokenItem from "./TokenItem";
import { divideByDecimals, toFixedIfNecessary } from "../../utils";

const TokenList = ({ accountTokens, accountInfo }) => {
	if (Object.keys(accountInfo).length === 0)
		return <div className="mb-4 text-white"></div>

	if (accountTokens === null)
		return <div className="mb-4 text-white"></div>

	return (
		<div className="p-4 rounded-md text-white bg-color-dark w-full">
			<h3 className="text-lg font-bold">
				<span>Tokens</span>
			</h3>
			<TokenItem
				tokenId={"0"}
				name={"Tron"}
				symbol={"TRX"}
				type={"FUNGIBLE_COMMON"}
				balance={toFixedIfNecessary(accountInfo.balance, 2)}
			/>
			{
				accountTokens.map(item => {
					const { address, symbol, type, name, balance, decimals } = item;
					const _balance = divideByDecimals(balance, decimals);
					
					return (
						<TokenItem
							key={symbol}
							symbol={symbol}
							balance={_balance}
							tokenId={address}
							name={name}
							type={type}
						/>
					)
				})
			}
		</div>
	)
}

export default TokenList