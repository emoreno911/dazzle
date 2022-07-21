import NftItem from "./NftItem";
import Loader from "../common/Loader";

const NftList = ({ accountNfts }) => {
    if (accountNfts === null)
		return <Loader />;

    if (accountNfts.length === 0)
		return (
            <div className="p-4 rounded-md text-white bg-color-dark w-full">
                <h3 className="text-lg font-bold">
                    <span>NFTs</span> 
                </h3>
                <div className="my-5 text-gray-400 text-center">Nothing here!</div>
            </div>
        )

	return (
		<div className="p-4 rounded-md text-white bg-color-dark w-full">
			<h3 className="text-lg font-bold">
				<span>NFTs</span> 
			</h3>
            <div className="w-full">
                {
                    accountNfts.map(data => 
                        <NftItem 
                            key={data.tokenId}
                            nft={data} 
                        />
                    )
                }
            </div>
		</div>
	)
}

export default NftList