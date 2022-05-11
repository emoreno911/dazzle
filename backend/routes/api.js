const express = require('express');
const { 
    callContract,
    requestAccountInfo 
} = require('../services/hashgraph')

const router = express.Router();

router.post('/getAccountInfo', async (request, response) => {
	const { accountId } = request.body;
    const result = await requestAccountInfo(accountId);
    response.json(result);
});

router.post('/getContractData', async (request, response) => {
	const { username } = request.body;
    const result = await callContract(username);
    response.json(result);
});

router.post('/setDeposit', (request, response) => {
	const {tokenId, amount, sender, isFungible, hash} = request.body;
    const id = ""; // generate deposit id
	
    response.json({sender, tokenId});
});

module.exports = router