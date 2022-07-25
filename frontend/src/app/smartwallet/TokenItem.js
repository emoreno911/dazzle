import TokenModalWithdraw from "./TokenModalWithdraw";

const TokenItem = ({ symbol, balance, tokenId, type, name, address, decimals }) => {
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
                <TokenModalWithdraw
                    symbol={symbol}
                    tokenId={tokenId}
                    tokenType={type}
                    address={address}
                    decimals={decimals}
                    balance={balance}
                />
            </div>
        </div>
    )
}

export default TokenItem;