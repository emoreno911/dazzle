const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { 
    callContract,
    requestAccountInfo,
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

router.post('/setDeposit', async (request, response) => {
	const {tokenId, amount, sender, tokenType, hash} = request.body;
    const id = uuidv4(); // generate deposit id
	
    response.json({id, sender, tokenId, amount, tokenType, hash});
});

module.exports = router