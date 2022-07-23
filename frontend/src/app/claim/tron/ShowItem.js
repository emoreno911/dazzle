import { useEffect, useState } from 'react';
import { getTokenInfo, getNftInfo } from '../../../utils/tron/service';
import { divideByDecimals } from '../../../utils';
import ModalPairWalletClaim from './ModalPairWalletClaim';
import ModalCreateWalletClaim from './ModalCreateWalletClaim';


function TokenLayout({ tokenId, amount, tokenData }) {
    let _amount = tokenId !== "0" ? divideByDecimals(amount, tokenData.decimals) : divideByDecimals(amount, 6);
    return (
        <>
            <h4 className="text-xl text-center font-bold text-white mb-6">CLAIM TOKENS</h4>
            <div className="text-center">
                <input
                    type="number"
                    value={_amount}
                    readOnly={true}
                    className="bg-transparent text-white text-6xl text-center block border-b-2 w-1/2 mx-auto mb-3 focus:outline-none focus:border-yellow-500"
                />
                <span className="text-white text-3xl">{tokenData.symbol}</span>
            </div>
        </>
    )
}


function NftLayout({ tokenData }) {
    const { 
        metadata, 
        name:tokenName, 
        symbol:tokenSymbol,
        tokenUri, 
        tokenId,
    } = tokenData;

    let image = "https://res.cloudinary.com/dy3hbcg2h/image/upload/v1652749173/no-image_qrq0kt.png";
    let name = "";
    
    try {
        image = metadata.properties.image.description;
        name = metadata.properties.name.description;
    } catch (error) {
        //console.log('fail nft metadata')
    }

    const tokenIdTitle = "Token ID";
    const metadataTitle = "Token URI";

    return (
        <>
            <h4 className="text-xl text-center font-bold text-white mb-6">CLAIM NFT</h4>
            <div className="flex w-full max-w-lg mx-auto my-10 pl-2 text-white">
                <div className="">
                    <img className="modalpic rounded-lg mr-5" src={image} alt={""} />
                </div>
                <div className="w-2/3 sm:w-4/5">
                    <div className="mb-2">Token Symbol: <span className="text-gray-400">{tokenSymbol}</span></div>
                    <div className="mb-2">Token Name: <span className="text-gray-400">{tokenName}</span></div>
                    <div className="mb-2">{tokenIdTitle}: <span className="text-gray-400">{tokenId}</span></div>
                    <div>{metadataTitle}</div>
                    <code>
                        <pre className="codeblock">
                            {tokenUri}
                        </pre>
                    </code>
                </div>
            </div>
        </>
    )
}


function ShowItem({ item }) {

    const [tokenData, setTokenData] = useState({ symbol: 'TRX' });
    const { tokenId, amount, sender, isFungible, isClaimed } = item;

    const [disableClaim, setDisableClaim] = useState(false);
    const [wasClaimed, setWasClaimed] = useState(isClaimed !== "0");
    const claimedText = wasClaimed ? "was already Claimed" : "is available for Claim";
    const tokenAddr = tokenId.indexOf('#') !== -1 ? tokenId.split('#')[0] : tokenId;

    useEffect(() => {
        if (tokenId === "0")
            return;

        if (isFungible === "1")
            getTokenInfo(tokenId, tokenId).then(response => { setTokenData(response) })  
        else {
            const id = tokenId.split('#')[1];
            getNftInfo(tokenAddr, id).then(response => { setTokenData(response) })
        } 

    }, []);

    return (
        <div className="link-page">
            {
                isFungible === "1" ?
                    <TokenLayout tokenId={tokenAddr} amount={amount} tokenData={tokenData} /> :
                    <NftLayout tokenData={tokenData} />
            }
            <div className="my-8">
                <div className="w-full md:w-3/4 max-w-lg mx-auto relative">
                    <h4 className='text-center text-gray-400 my-8'>
                        This deposit was created by {sender} and {claimedText}
                    </h4>
                    {
                        !wasClaimed && (
                            <>
                                <ModalPairWalletClaim 
                                    buttonText={"Connect Wallet and Claim"} 
                                    tokenId={tokenAddr} 
                                    item={item}
                                    disableClaim={disableClaim}
                                    setDisableClaim={setDisableClaim}
                                />
                                <ModalCreateWalletClaim 
                                    buttonText={"Create Wallet and Claim"} 
                                    tokenId={tokenAddr} 
                                    item={item} 
                                    disableClaim={disableClaim}
                                    setDisableClaim={setDisableClaim}
                                />
                            </>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default ShowItem;