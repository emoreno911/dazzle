import ModalSendNft from './ModalSendNft';

// https://hedera.com/blog/get-started-with-the-hedera-token-service-part-1-how-to-mint-nfts

const NftItem = ({ nft, accountTokens }) => {
    const { token_id, metadata, serial_number, symbol } = nft;

    let tokenName = token_id;
    let tokenSymbol = "";
    try {
        let token = accountTokens.find(t => t.token_id === token_id);
        tokenName = token.name;
        tokenSymbol = token.symbol;
    } catch (error) {
        //console.log('fail nft tokenName')
    }

    let _metadata = {};
    try {
        _metadata = JSON.parse(atob(metadata));
    } catch (error) {
        //console.log('fail nft metadata')
    }

    const name = _metadata.hasOwnProperty('name') ? _metadata.name : "";
    const image = _metadata.hasOwnProperty('image') ? _metadata.image : "/img/no-image.png";
    const alt = _metadata.hasOwnProperty('image') ? tokenName : "no-image";
    return (
        <div className="flex items-center mx-2 my-2 rounded-lg">
            <a href="#">
                <img className="icopic rounded-lg" src={image} alt={alt} />
            </a>
            <div className="grow leading-5 p-2">
                <a href="#">
                    <h5 className="text-md font-bold tracking-tight text-gray-100 dark:text-white">
                        {tokenName} #{serial_number}
                    </h5>
                    <small className="text-sm text-gray-400">{name}</small>
                </a>
            </div>
            <div className="p-2 pr-0">
                <ModalSendNft 
                    nft={nft} 
                    tokenSymbol={tokenSymbol}
                    tokenName={tokenName} 
                    image={image} 
                />
            </div>
        </div>
    )
}

const NftList = ({ accountNfts, accountTokens }) => {
    if (Object.keys(accountNfts).length === 0)
		return <div className="mb-4 text-white">Loading...</div>

	return (
		<div className="p-4 rounded-md text-white bg-color-dark w-full">
			<h3 className="text-lg font-bold">
				<span>NFTs</span> 
			</h3>
            <div className="w-full">
                {
                    accountNfts.nfts.map(data => 
                        <NftItem 
                            key={data.created_timestamp}
                            accountTokens={accountTokens}
                            nft={data} 
                        />
                    )
                }
            </div>
		</div>
	)
}

export default NftList