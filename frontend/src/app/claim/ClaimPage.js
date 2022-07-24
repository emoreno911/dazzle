import React, { useState, useEffect } from "react";
import RequestPassword from './RequestPassword';
import ShowItemHedera from "./hedera/ShowItem";
import ShowItemTron from "./tron/ShowItem";


function ClaimPage({ depositId, makeValidate }) {
    const isHederaNetwork = window.location.href.indexOf("/hedera/") !== -1;

    const [isValidated, setIsValidated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [item, setItem] = useState(null);

    useEffect(() => {  
        setIsValidated(false)
    }, [window.location.hash])

    const submitValidation = async (pwd) => {
        setErrorMessage("");
        let response = await makeValidate({ id: depositId, pwd });
        let item;
        if (!response.err) {
            if (Array.isArray(response.result)) { // response from tron is an Array
                const tokenAddress = response.result[1]; //window.tronWeb.address.fromHex(response.result[1]);
                const [tokenId, amount, sender, isFungible, isClaimed] = response.result[0].split("|");
                item = {tokenId, amount, sender, isFungible, isClaimed, tokenAddress};
            }
            else {
                const [tokenId, amount, sender, isFungible, isClaimed] = response.result.split("|");
                item = {tokenId, amount, sender, isFungible, isClaimed};
            }

            setItem(item)
            setIsValidated(true)
        }
        else {
            setIsValidated(false);
            setErrorMessage("Password doesn't match");
        }
    }

    return !isValidated ?
        <RequestPassword
            errorMessage={errorMessage} 
            submitValidation={submitValidation} 
        /> : 
        isHederaNetwork ?
        <ShowItemHedera item={item} /> 
        :
        <ShowItemTron item={item} />

}

export default ClaimPage;