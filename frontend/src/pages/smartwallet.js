import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { getSmartWallet } from "../utils/tron/service";
import { isNullAddress, setCurrentSmartwallet } from "../utils";
import SocialLogin from "../app/smartwallet/SocialLogin";
import WalletAssets from "../app/smartwallet/WalletAssets";

const Smartwallet = () => {
    const [smartwalletAddr, setSmartwalletAddr] = useState(null)
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            checkSmartwalletAddress();
        }
    }, [user])

    const checkSmartwalletAddress = async () => {
        let _smartwalletAddr = await getSmartWallet(user.uid);
        console.log(_smartwalletAddr)
        let addr = isNullAddress(_smartwalletAddr.hex) ? null : _smartwalletAddr.base58;
        setCurrentSmartwallet(addr);
        setSmartwalletAddr(addr);
    }

    return !user ?
        (
            <div className="home-unpaired flex flex-col items-center justify-center">
                <p className="text-5xl pb-5 text-gray-300 font-semibold">Get a wallet linked to your social account</p>
                <p className="text-xl py-5 text-gray-300">This is a wallet to send and receive tokens or NFTs easely</p>

                <div className="w-80">
                    <SocialLogin />
                </div>

                <div className="flex items-center justify-center my-5">
                    <small className="block text-gray-400">Currently on Testnet</small>
                </div>
            </div>
        )   
        :
        (
            <div className="text-white">
                <div className="flex">
                    <img src={user.photoURL} className="w-12 h-12 mr-2" alt="" />
                    <div>
                        <p>{user.displayName}</p>
                        <p>{user.email}</p>
                    </div>
                </div>
                <WalletAssets address={smartwalletAddr} />
            </div>
        )
        
}

export default Smartwallet