const express = require('express');
const router = express.Router();

router.get('/getBalance', async (request, response) => {
    response.send('You have 12.5');
 });

 router.post('/setDeposit', (request, response) => {
	const {tokenId, amount, sender, isFungible, hash} = request.body;
    const id = ""; // generate deposit id
	
    res.json({sender, tokenId});
});

module.exports = router