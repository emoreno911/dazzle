import { v4 as uuidv4 } from 'uuid';

let account = null
let contractAddress = 'TKZRzE9ykVdU3YG4ehchYNH2PxMQv7GcoQ' 
let dazzleContract = null

export const accountAddress = () => {
  return account
}

export function getTronWeb(){
  // Obtain the tronweb object injected by tronLink 
  var obj = setInterval(async ()=>{
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        clearInterval(obj)
        console.log("tronWeb successfully detected!")
        //setupEvents()
    }
  }, 100)
}

export const getBalance = async () => {
    //if wallet installed and logged , getting TRX token balance
    if (window.tronWeb && window.tronWeb.ready) {
        let walletBalances = await window.tronWeb.trx.getAccount(
            window.tronWeb.defaultAddress.base58
        );
        return walletBalances;
    } else {
        return 0;
    }
}

export const getWalletDetails = async () => {
    if (window.tronWeb) {
        //checking if wallet injected
        if (window.tronWeb.ready) {
            let tempBalance = await getBalance();
            let tempFrozenBalance = 0;

            if (!tempBalance.balance) {
                tempBalance.balance = 0;
            }

            //checking if any frozen balance exists
            if (
                !tempBalance.frozen &&
                !tempBalance.account_resource.frozen_balance_for_energy
            ) {
                tempFrozenBalance = 0;
            } else {
                if (
                    tempBalance.frozen &&
                    tempBalance.account_resource.frozen_balance_for_energy
                ) {
                    tempFrozenBalance =
                        tempBalance.frozen[0].frozen_balance +
                        tempBalance.account_resource.frozen_balance_for_energy
                            .frozen_balance;
                }
                if (
                    tempBalance.frozen &&
                    !tempBalance.account_resource.frozen_balance_for_energy
                ) {
                    tempFrozenBalance = tempBalance.frozen[0].frozen_balance;
                }
                if (
                    !tempBalance.frozen &&
                    tempBalance.account_resource.frozen_balance_for_energy
                ) {
                    tempFrozenBalance =
                        tempBalance.account_resource.frozen_balance_for_energy
                            .frozen_balance;
                }
            }

            //we have wallet and we are logged in
            const details = {
                name: window.tronWeb.defaultAddress.name,
                address: window.tronWeb.defaultAddress.base58,
                balance: tempBalance.balance / 1000000,
                frozenBalance: tempFrozenBalance / 1000000,
                network: window.tronWeb.fullNode.host,
                link: 'true',
            };
            return {
                connected: true,
                details
            }
        } else {
            //we have wallet but not logged in
            const details = {
                name: 'none',
                address: 'none',
                balance: 0,
                frozenBalance: 0,
                network: 'none',
                link: 'false',
            };
            return {
                connected: false,
                details
            }
        }
    } else {
        //wallet is not detected at all
        return {
            connected: false,
            details: null
        }
    }
}
 
export async function getTokenInfo(contractAddr, holderAddr) {
    let contract = await window.tronWeb.contract().at(contractAddr);
    let decimals = 0;
    //let isFungible = false;
    let type = "NON_FUNGIBLE_UNIQUE"
    try {
        decimals = await contract.decimals().call();
        type = "FUNGIBLE_COMMON"
    } catch (error) {
        //isFungible = false;
    }

    try {
        let name = await contract.name().call();
        let symbol = await contract.symbol().call();
        let balance = await contract.balanceOf(holderAddr).call();

        return {
            address: contractAddr,
            name,
            symbol,
            decimals,
            balance: balance.toNumber(),
            type
        }
    } catch (error) {
        console.log("trigger smart contract error",error);
        return {};
    }
}

export async function getNftInfo(contractAddr, tokenId) {
    let contract = await window.tronWeb.contract().at(contractAddr);
    try {
        let name = await contract.name().call();
        let symbol = await contract.symbol().call();
        let tokenUri = await contract.tokenURI(tokenId).call();
        let metadata = await (await fetch(tokenUri)).json();
        return {
            name,
            symbol,
            address: contractAddr,
            tokenId: tokenId.toNumber(),
            tokenUri,
            metadata
        }   
    } catch (error) {
        console.log("error getting nft",error);
        return {};
    }
}

export async function getNftInfoByOwnerIndex(contractAddr, holderAddr, index) {
    let contract = await window.tronWeb.contract().at(contractAddr);
    try {
        let tokenId = await contract.tokenOfOwnerByIndex(holderAddr, index).call();
        let tokenUri = await contract.tokenURI(tokenId).call();
        let metadata = await (await fetch(tokenUri)).json();
        return {
            address: contractAddr,
            tokenId: tokenId.toString(),
            tokenUri,
            metadata
        }   
    } catch (error) {
        console.log("error getting nft",error);
        return {};
    }
}

export async function getAccountTokens(tokens, holderAddr) {
    // tokens = [addr, addr, addr...]
    const reqTokenInfos = tokens.map(addr => getTokenInfo(addr, holderAddr));
    const tokenInfos = await Promise.all(reqTokenInfos);

    // format nfts array to iterate easely over it
    const filterNfts = tokenInfos
        .filter(t => t.type === "NON_FUNGIBLE_UNIQUE")
        .map(({address, balance}) => {
            const arr = Array(balance).fill(0);
            return arr.map((n,index) => ({address, index}));
        })
        .flat();

    const reqNftInfos = filterNfts.map(t => getNftInfoByOwnerIndex(t.address, holderAddr, t.index));
    const nftInfos = await Promise.all(reqNftInfos);

    const accountNfts = nftInfos.map(t => {
        const {name, symbol, type} = tokenInfos.find(i => t.address === i.address);
        return { name, symbol, type, ...t }
    });
    
    return {
        accountTokens: tokenInfos.filter(t => t.type === "FUNGIBLE_COMMON"),
        accountNfts
    }
}

export async function setLibraryContract() {
    // TODO: abtain contract Object
    dazzleContract = await window.tronWeb.contract().at(contractAddress);
}

// makeTransaction
export async function makeTransaction(signer, amount, tokenId, serialNumber) {

}

// setDeposit
export async function setDeposit(data) {
    const {tokenId, hash, amount, sender, isFungible, tokenIdSerial} = data;

    try {
        const id = uuidv4();
        const _tokenId = isFungible ? tokenId : tokenIdSerial;
        const _amount = isFungible ? window.tronWeb.toSun(amount) : 1;

        const result = await dazzleContract
            .createDeposit(id, _tokenId, hash, _amount, sender, isFungible)
            .send({
                feeLimit: 100_000_000,
                callValue: 0,
                shouldPollResponse: true
            });
  
        return {
            depositId: id,
            transactionId: "",
            result: "SUCCESS",
            err: false
        }
    } catch (error) {
        console.log(error)
        return {
            depositId: 0,
            transactionId: "",
            result: "FAIL",
            err: true
        }
    }
}

// validateClaim
export async function validateClaim(data) {
    const {id, pwd} = data;

    try {
        const result = await dazzleContract
            .validateClaim(id, pwd)
            .send({
                feeLimit: 100_000_000,
                callValue: 0,
                shouldPollResponse: true
            });
  
        return {
            err: false,
            result: "SUCCESS"
        }
    } catch (error) {
        console.log(error)
        return {
            err: true,
			result: "INVALID_ID_PASSWORD"
        }
    }
}

// executeClaim
export async function executeClaim(data) {
    const {id, pwd, beneficiary} = data;

    try {
        const result = await dazzleContract
            .executeClaim(id, pwd, beneficiary)
            .send({
                feeLimit: 100_000_000,
                callValue: 0,
                shouldPollResponse: true
            });
  
        return {
            err: false,
            result: "SUCCESS"
        }
    } catch (error) {
        console.log(error)
        return {
            err: true,
			result: "INVALID_ID_PASSWORD"
        }
    }
}