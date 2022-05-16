const { 
	Hbar,
    Client,
    AccountId,
	PrivateKey,
    AccountInfoQuery,
    ContractCallQuery,
	TokenAssociateTransaction,
	ContractExecuteTransaction,
    ContractFunctionParameters 
} = require('@hashgraph/sdk');

require('dotenv').config()

//Grab the account ID and private key of the operator account from the .env file
const operatorAccount = process.env.OPERATOR_ID;
const operatorPrivateKey = process.env.OPERATOR_PVKEY;
const contractId = process.env.CONTRACT_ID;

const setClient = () => Client.forTestnet().setOperator(operatorAccount, operatorPrivateKey);
// returns a Uint8Array from a hex String
const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

async function requestAccountInfo(accountId) {
    const client = setClient();
    const query = new AccountInfoQuery().setAccountId(accountId);
    const result = await query.execute(client);
    
    return {
        accountId: result.accountId.toString(),
        balance: result.balance.toString(),
        ownedNfts: result.ownedNfts.toString(),
        tokenRelationships: JSON.parse(result.tokenRelationships.toString())
    }
}

async function associateToken(tokenId) {
	const client = setClient();
	const transaction = new TokenAssociateTransaction()
		.setAccountId(contractId)
		.setTokenIds([tokenId])	
		.freezeWith(client);
	
	//Sign with the private key of the account that is being associated to a token 
	const signTx = await transaction.sign(PrivateKey.fromString(operatorPrivateKey));

	try {
		//Submit the transaction to a Hedera network    
		const txResponse = await signTx.execute(client);
		//Request the receipt of the transaction
		const receipt = await txResponse.getReceipt(client);
		//Get the transaction consensus status
		const transactionStatus = receipt.status;
		// log
		console.log("The transaction consensus status " + transactionStatus.toString());

		return {
			result: transactionStatus.toString()
		}
	} catch (error) {
		return {
			result: error.status.toString()
		}
	}
}

async function executeCreateDeposit(id, tokenId, hash, amount, sender, isFungible) {
	const client = setClient();
    const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(1000000)
		.setFunction(
			"createDeposit",
			new ContractFunctionParameters()
				.addString(id)
				.addString(tokenId)
				.addBytes32(fromHexString(hash))
				.addUint256(amount)
				.addString(sender)
				.addBool(isFungible)
		);
	const contractExecuteSubmit = await contractExecuteTx.execute(client);
	const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	console.log(`- executeCreateDeposit: ${contractExecuteRx.status} \n`);
    
    return {
		depositId: id,
        transactionId: contractExecuteSubmit.transactionId.toString(),
        result: contractExecuteRx.status.toString()
    }
}

async function callValidateClaim(id, pwd) {
	const client = setClient();
    const contractQueryTx = new ContractCallQuery()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction("validateClaim", 
			new ContractFunctionParameters()
				.addString(id)
				.addString(pwd)
		)
		.setQueryPayment(new Hbar(2));
	
		try {
			const contractQuerySubmit = await contractQueryTx.execute(client);
			const contractQueryResult = contractQuerySubmit.getString(0);
			console.log(`- callValidateClaim: ${contractQueryResult} \n`);
			return {
				err: false,
				result: contractQueryResult
			}
		} catch (error) {
			return {
				err: true,
				result: "INVALID_ID_PASSWORD"
			}
		}
}

async function executeClaim(id, pwd, beneficiary) {
    const client = setClient();
    const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(1000000)
		.setFunction(
			"executeClaim",
			new ContractFunctionParameters()
				.addString(id)
				.addString(pwd)
				.addAddress(AccountId.fromString(beneficiary).toSolidityAddress())
		);
	const contractExecuteSubmit = await contractExecuteTx.execute(client);
	const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	console.log(`- executeClaim: ${contractExecuteRx.status} \n`);
    
    return {
        response: contractExecuteSubmit,
        result: contractExecuteRx
    }
}


module.exports = {
	associateToken,
    requestAccountInfo,
    executeCreateDeposit,
    callValidateClaim,
    executeClaim,
}