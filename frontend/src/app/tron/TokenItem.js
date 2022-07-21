//import TokenModal from './TokenModal';
import TokenModalTron from "./TokenModalTron";

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
                <TokenModalTron
                    symbol={symbol}
                    tokenId={tokenId}
                    tokenType={type}
                />
            </div>
        </div>
    )
}

export default TokenItem;