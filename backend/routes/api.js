const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { 
    associateToken,
    generateNewWallet,
    requestAccountInfo,
    executeCreateDeposit,
    callValidateClaim,
    executeClaimToken,
    executeClaim
} = require('../services/hedera');

const {
    executeClaimTron,
    deployBaseWallet,
    withdrawTokenSW,
    withdrawTronSW,
    withdrawNftSW
} = require('../services/tron');

const router = express.Router();

router.post('/getAccountInfo', async (request, response) => {
	const { accountId } = request.body;
    const result = await requestAccountInfo(accountId);
    response.json(result);
});

router.post('/associateToken', async (request, response) => {
	const { tokenId } = request.body;
    const result = await associateToken(tokenId);
    response.json(result);
});

router.post('/setDeposit', async (request, response) => {
	const {tokenId, hash, amount, sender, isFungible, tokenIdSerial} = request.body;
    const id = uuidv4(); // generate deposit id
    const tId = isFungible ? tokenId : tokenIdSerial; // for NFTs we store something like tokenId#serial
	const result = await executeCreateDeposit(id, tId, hash, amount, sender, isFungible);
    response.json(result);
});

router.post('/validateClaim', async (request, response) => {
	const { id, pwd } = request.body;
    const result = await callValidateClaim(id, pwd);
    response.json(result);
});

router.post('/executeClaim', async (request, response) => {
	const { id, pwd, beneficiary } = request.body;
    const result = await executeClaim(id, pwd, beneficiary);
    response.json(result);
});

router.post('/executeClaimToken', async (request, response) => {
	const { id, pwd, beneficiary, tokenId, amount, isFungible } = request.body;
    const result = 
        await executeClaimToken(id, pwd, tokenId, amount, isFungible, beneficiary);
    response.json(result);
});

router.post('/generateNewWallet', async (request, response) => {
    const { tokenId } = request.body;
    const result = await generateNewWallet(tokenId);
    response.json(result);
});

router.post('/executeClaimTron', async (request, response) => {
	const { id, pwd, beneficiary } = request.body;
    const result = await executeClaimTron(id, pwd, beneficiary);
    response.json(result);
});

router.post('/deployBaseWallet', async (request, response) => {
	const { socialid, pincode } = request.body;
    const result = await deployBaseWallet(socialid, pincode);
    response.json(result);
});

router.post('/withdrawFromSmartwallet', async (request, response) => {
	const { smartwalletAddress, amount, tokenId, beneficiary, pin, contractAddr } = request.body;
    let result;
    
    if (amount === null) {
        result = await withdrawNftSW(smartwalletAddress, tokenId, beneficiary, pin, contractAddr);
    }
    else if (contractAddr === null) {
        result = await withdrawTronSW(smartwalletAddress, amount, beneficiary, pin);
    }
    else {
        result = await withdrawTokenSW(smartwalletAddress, amount, beneficiary, pin, contractAddr)
    }
    
    response.json(result);
});

module.exports = router