const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { 
    associateToken,
    requestAccountInfo,
    executeCreateDeposit,
    callValidateClaim,
    executeClaim
} = require('../services/hedera');

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

module.exports = router