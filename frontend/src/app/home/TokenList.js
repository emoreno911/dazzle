import ModalSendToken from './ModalSendToken';
import { toFixedIfNecessary } from '../../utils/utilities';

const TokenItem = ({ symbol, balance, tokenId, type, name }) => {
	if (type === 'NON_FUNGIBLE_UNIQUE')
		return <div></div>;

	return (
		<div className="flex items-center justify-between mt-3">
			<div className="p-2">
				<span className="font-bold">{symbol}</span>
				<small className="block text-sm text-gray-400">{name}</small>
			</div>
			<div className="text-right grow leading-5 p-2">
				<span className="text-base tracking-tight text-gray-100 dark:text-white">
					{balance}
				</span>
			</div>
			<div>
				<ModalSendToken 
					symbol={symbol} 
					tokenId={tokenId}
					tokenType={type}
				/>
			</div>
		</div>
	)
} 

const TokenList = ({ accountInfo, accountTokens }) => {
	if (Object.keys(accountTokens).length === 0)
		return <div className="mb-4 text-white">Loading...</div>

	return (
		<div className="p-4 rounded-md text-white bg-color-dark w-full">
			<h3 className="text-lg font-bold">
				<span>Tokens</span> 
			</h3>
			<TokenItem 
				tokenId={"0"}
				name={"Hedera"}
				symbol={"HBAR"}
				type={"FUNGIBLE_COMMON"}
				balance={toFixedIfNecessary(accountInfo.balance.balance/100000000, 2)}
			/>
			{
				accountTokens.map(item => {
					const {token_id, symbol, type, name} = item;
					const {balance} = accountInfo.balance.tokens.find(t => t.token_id === token_id);
					return (
						<TokenItem 
							key={symbol}
							symbol={symbol}
							balance={toFixedIfNecessary(balance, 8)}
							tokenId={token_id}
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