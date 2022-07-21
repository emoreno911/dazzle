import NftModal from './NftModal';

const NftItem = ({ nft }) => {
    const { 
        tokenId, 
        address,
        metadata, 
        name:tokenName, 
        symbol:tokenSymbol 
    } = nft;

    let image = "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652749173/no-image_qrq0kt.png";
    let name = "";
    
    try {
        image = metadata.properties.image.description;
        name = metadata.properties.name.description;
    } catch (error) {
        //console.log('fail nft metadata')
    }

    return (
        <div className="flex items-center mx-2 my-2 rounded-lg">
            <a href="#">
                <img className="icopic rounded-lg" src={image} alt={name} />
            </a>
            <div className="grow leading-5 p-2">
                <a href="#">
                    <h5 className="text-md font-bold tracking-tight text-gray-100 dark:text-white">
                        {tokenName} #{tokenId}
                    </h5>
                    <small className="text-sm text-gray-400">{name}</small>
                </a>
            </div>
            <div className="p-2 pr-0">
                <NftModal 
                    nft={nft} 
                    tokenSymbol={tokenSymbol}
                    tokenName={tokenName} 
                    image={image} 
                />
            </div>
        </div>
    )
}

export default NftItem