import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTron } from "../../context/tron"; 
import { makeHash, toNumber } from "../../utils";
import TokenModal from "../common/TokenModal";

const TokenModalTron = ({ symbol, tokenId, tokenType }) => {
    let navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { 
        data:{ accountInfo },
		fn:{ makeDeposit }		 
	} = useTron();

    const handleSubmit = async (amount, pwd) => {
        if (isProcessing)
            return;

        const isFungible = tokenType === 'FUNGIBLE_COMMON';
        const hash = await makeHash(pwd);
        setIsProcessing(true);
        setErrorMessage("");

        let response = await makeDeposit({
            sender: accountInfo.address,
            amount: toNumber(amount),
            isFungible,
            tokenId,
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
        <TokenModal 
            symbol={symbol}
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
            errorMessage={errorMessage}
        />
    )
}

export default TokenModalTron