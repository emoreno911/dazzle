const crypto = require('crypto');
const TronWeb = require('tronweb');
const { baseWalletABI, baseWalletBytecode } = require('./utils');

require('dotenv').config();

//Grab the account ID and private key of the operator account from the .env file
//const operatorAccount = process.env.OPERATOR_ID;
const tronPrivateKey = process.env.TRX_OPERATOR_PVKEY;
const dazzleContractId = process.env.TRX_CONTRACT_ID;

const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    //headers: { "TRON-PRO-API-KEY": 'your api key' },
    privateKey: tronPrivateKey
});


async function deployBaseWallet(socialid, pincode) {
    try {
        let abi = JSON.stringify(baseWalletABI);
        let code = baseWalletBytecode.object;
        let instance = await tronWeb.contract().new({
            abi:abi,
            bytecode:code,
            feeLimit:1000000000,
            callValue:0,
            userFeePercentage:1,
            originEnergyLimit:10000000,
            parameters:[socialid, pincode]
        });

        // now add reference in smartcontract
        const dazzleContract = await tronWeb.contract().at(dazzleContractId);
        const result = await dazzleContract
            .addSmartWallet(socialid, instance.address)
            .send({
                feeLimit: 100_000_000
            });

        return {
            err: false,
			result: "SUCCESS",
            hex: instance.address,
            base58: tronWeb.address.fromHex(instance.address)
        }
        
    } catch (error) {
        console.log(error)
        return {
            err: true,
			result: "FAIL"
        }
    }
}


async function executeClaimTron(id, pwd, beneficiary) {
    const dazzleContract = await tronWeb.contract().at(dazzleContractId);

    try {
        const result = await dazzleContract
            .executeClaim(id, pwd, beneficiary)
            .send({
                feeLimit: 100_000_000
            });
        return {
            err: false,
            result: "SUCCESS",
            txid: result
        }
    } catch (error) {
        console.log(error)
        return {
            err: true,
			result: "INVALID_ID_PASSWORD"
        }
    }
}

async function withdrawTronSW(smartwalletAddress, amount, beneficiary, pin) {
    const smartwalletContract = await tronWeb.contract().at(smartwalletAddress);
    try {
        const isValidPin = await checkPinHash(smartwalletContract, pin);
        if (!isValidPin) {
            return {
                err: true,
                result: "INVALID_PINCODE"
            }
        }

        const result = await smartwalletContract
            .withdraw(amount, beneficiary)
            .send({
                feeLimit: 100_000_000
            });
        return {
            err: false,
            result: "SUCCESS",
            txid: result
        }
    } catch (error) {
        console.log(error)
        return {
            err: true,
			result: "FAIL"
        }
    }
}

async function withdrawTokenSW(smartwalletAddress, amount, beneficiary, pin, contractAddr) {
    const smartwalletContract = await tronWeb.contract().at(smartwalletAddress);
    try {
        const isValidPin = await checkPinHash(smartwalletContract, pin);
        if (!isValidPin) {
            return {
                err: true,
                result: "INVALID_PINCODE"
            }
        }

        const result = await smartwalletContract
            .withdrawToken(contractAddr, amount, beneficiary)
            .send({
                feeLimit: 100_000_000
            });
        return {
            err: false,
            result: "SUCCESS",
            txid: result
        }
    } catch (error) {
        console.log(error)
        return {
            err: true,
			result: "FAIL"
        }
    }
}

async function withdrawNftSW(smartwalletAddress, tokenId, beneficiary, pin, contractAddr) {
    const smartwalletContract = await tronWeb.contract().at(smartwalletAddress);
    try {
        const isValidPin = await checkPinHash(smartwalletContract, pin);
        if (!isValidPin) {
            return {
                err: true,
                result: "INVALID_PINCODE"
            }
        }

        const result = await smartwalletContract
            .withdrawToken(contractAddr, tokenId, beneficiary)
            .send({
                feeLimit: 100_000_000
            });
        return {
            err: false,
            result: "SUCCESS",
            txid: result
        }
    } catch (error) {
        console.log(error)
        return {
            err: true,
			result: "FAIL"
        }
    }
}

async function checkPinHash(smartwalletContract, pin) {
    const pinHash = await smartwalletContract.getPinHash().call();
    const pinHex = crypto.createHash('sha256').update(pin).digest('hex');
    return `0x${pinHex}` === pinHash;
}


module.exports = {
    executeClaimTron,
    deployBaseWallet,
    withdrawTronSW,
    withdrawTokenSW,
    withdrawNftSW
}