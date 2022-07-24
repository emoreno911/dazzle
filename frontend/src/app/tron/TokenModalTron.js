import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTron } from "../../context/tron"; 
import { makeHash, multiplyByDecimals } from "../../utils";
import TokenModal from "../common/TokenModal";

const TokenModalTron = ({ symbol, tokenId, tokenType, address, balance, decimals }) => {
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

        if (parseInt(amount) > balance) {
            setErrorMessage("Insufficient balance");
            return;
        }

        const isFungible = tokenType === 'FUNGIBLE_COMMON';
        const category = symbol === 'TRX' ? 0 : 1;
        const hash = await makeHash(pwd);
        setIsProcessing(true);
        setErrorMessage("");

        let response = await makeDeposit({
            symbol,
            sender: accountInfo.address,
            amount: multiplyByDecimals(amount, decimals),
            isFungible,
            category,
            address,
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