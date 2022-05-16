import React, { useContext, useState, useEffect } from "react";
import Layout from "../layout";
import ShowItem from "./ShowItem";
import RequestPassword from './RequestPassword';
import {DataContext} from '../context';


function ClaimPage({ depositId }) {
    const [isValidated, setIsValidated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [item, setItem] = useState(null);

    const { 
        data:{ accountInfo },
		fn:{ makeValidate }		 
	} = useContext(DataContext);

    useEffect(() => {  
        setIsValidated(false)
    }, [window.location.hash])

    const submitValidation = async (pwd) => {
        setErrorMessage("");
        let response = await makeValidate({ id: depositId, pwd });
        if (!response.err) {
            const [tokenId, amount, sender, isFungible, isClaimed] = response.result.split("|");
            const item = {tokenId, amount, sender, isFungible, isClaimed};
            setItem(item)
            setIsValidated(true)
        }
        else {
            setIsValidated(false);
            setErrorMessage("Password doesn't match");
        }
    }

    return (
        <Layout>
            {
                isValidated ?
                    <ShowItem item={item} /> :
                    <RequestPassword
                        errorMessage={errorMessage} 
                        submitValidation={submitValidation} 
                    />
            }
        </Layout>
    );
}

export default ClaimPage;