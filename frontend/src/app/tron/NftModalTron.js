import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTron } from "../../context/tron"; 
import { makeHash, toNumber } from "../../utils";
import NftModal from "../common/NftModal";

const NftModalTron = ({ nft, tokenName, tokenSymbol, image }) => {
    let navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { 
        data:{ accountInfo },
		fn:{ makeDeposit }		 
	} = useTron();
    
    const { address:tokenAddr, tokenId, metadata, tokenUri } = nft;

    const handleSubmit = async (pwd) => {
        if (isProcessing)
            return;

        const amount = 1;
        const hash = await makeHash(pwd);
        setIsProcessing(true);
        setErrorMessage("");

        let response = await makeDeposit({
            sender: accountInfo.address,
            isFungible: false,
            tokenId: `${tokenAddr}#${tokenId}`,
            amount,
            hash
        });

        setIsProcessing(false);
        if (response.hasOwnProperty('result')) {
            if (response.result === "SUCCESS") {
                navigate(`/tron/link/${response.depositId}`, { replace: true });
            }
            else {
                setErrorMessage("Something went wrong! Try again.");
            }
        }
        else {
            setErrorMessage("Something went wrong! Try again.");
        }
    }

	return (
		<NftModal
            image={image}
            tokenId={tokenId}
            metadata={tokenUri}
            tokenName={tokenName}
            tokenSymbol={tokenSymbol}
            errorMessage={errorMessage}
            isProcessing={isProcessing}
            onSubmit={handleSubmit}        
        />
	)
}

export default NftModalTron