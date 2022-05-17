const { 
	Hbar,
    Client,
    AccountId,
	PrivateKey,
    AccountInfoQuery,
    ContractCallQuery,
	TransferTransaction,
	AccountCreateTransaction,
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
        result: contractExecuteRx.status.toString()
    }
}

async function executeClaimToken(id, pwd, tokenId, amount, isFungible, beneficiary) {
	let claimStatusCheck = await changeClaimStatus(id, pwd, true);
	
	if (claimStatusCheck.result !== 'SUCCESS')
		return claimStatusCheck;

	let transferResult = await executeTokenTransfer(tokenId, amount, isFungible, beneficiary);
	return transferResult;
}

async function changeClaimStatus(id, pwd, isClosed) {
    const client = setClient();
    const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(1000000)
		.setFunction(
			"changeClaimStatus",
			new ContractFunctionParameters()
				.addString(id)
				.addString(pwd)
				.addBool(isClosed)
		);
	
		try {
			const contractExecuteSubmit = await contractExecuteTx.execute(client);
			const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
			console.log(`- changeClaimStatus: ${contractExecuteRx.status} \n`);
			
			return { result: contractExecuteRx.status.toString() }
		} catch (error) {
			return { result: 'CLAIM_STATUS_FAIL' }
		}
}

async function executeTokenTransfer(tokenId, amount, isFungible, beneficiary) {
	const client = setClient();
	let transaction;

	if (isFungible) {
		transaction = await new TransferTransaction()
			.addTokenTransfer(tokenId, contractId, -1*amount)
            .addTokenTransfer(tokenId, beneficiary, 1*amount)
            .freezeWith(client);
	}
	else {
		// for nfts tokenId comes like 0.0.3434345#${serial}
		const [_tokenId, serialNumber] = tokenId.split('#');
		transaction = await new TransferTransaction()
			.addNftTransfer(_tokenId, serialNumber, contractId, beneficiary)
			.freezeWith(client);
	}

	try {
		//Sign with the sender account private key
		const signTx = await transaction.sign(PrivateKey.fromString(operatorPrivateKey));
		//Sign with the client operator private key and submit to a Hedera network
		const txResponse = await signTx.execute(client);
		//Request the receipt of the transaction
		const receipt = await txResponse.getReceipt(client);
		//Obtain the transaction consensus status
		const transactionStatus = receipt.status;
		console.log("The transaction consensus status " +transactionStatus.toString());

		return {
			response: transactionStatus.toString(),
			result: receipt.status.toString()
		}
	} catch (error) {
		return {
			response: error,
			result: "TRANSFER_FAIL"
		}
	}
}

async function generateNewWallet(tokenId) {
	const client = setClient();
	const newKey = PrivateKey.generate();

	try {
		const response = await new AccountCreateTransaction()
			.setKey(newKey.publicKey)
			//.setInitialBalance(new Hbar(1)) 
			.setMaxAutomaticTokenAssociations(3)
			.execute(client);

		const receipt = await response.getReceipt(client);
		console.log(`account id = ${receipt.accountId}`);

		return {
			result: 'SUCCESS',
			data: {
				privateKey: newKey.toStringRaw(),
				publicKey: newKey.publicKey.toString(),
				accountId: receipt.accountId.toString()
			}
		}
	} catch (error) {
		return {
			result: 'FAIL',
		}
	}
}


module.exports = {
	associateToken,
    requestAccountInfo,
    executeCreateDeposit,
    callValidateClaim,
	executeClaimToken,
    executeClaim,
	generateNewWallet
}