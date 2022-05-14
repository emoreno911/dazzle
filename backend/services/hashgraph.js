const { 
    Client,
    AccountInfoQuery,
    ContractCallQuery,
    ContractFunctionParameters 
} = require('@hashgraph/sdk');

require('dotenv').config()

//Grab the account ID and private key of the operator account from the .env file
const operatorAccount = process.env.OPERATOR_ID;
const operatorPrivateKey = process.env.OPERATOR_PVKEY;
const contractId = "0.0.34711058";

const setClient = () => Client.forTestnet().setOperator(operatorAccount, operatorPrivateKey);

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

async function callContract(username) {
    const client = setClient();
    const contractQueryTx = new ContractCallQuery()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction("getMobileNumber", new ContractFunctionParameters().addString(username));
	const contractQuerySubmit = await contractQueryTx.execute(client);
	const contractQueryResult = contractQuerySubmit.getUint256(0);
	//console.log(`- Here's the phone number that you asked for: ${contractQueryResult} \n`);
    return {
        response: contractQuerySubmit, 
        result: contractQueryResult
    }
}

async function executeContract() {
    const client = setClient();
    const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction(
			"setMobileNumber",
			new ContractFunctionParameters().addString("Bob").addUint256(222222)
		);
	const contractExecuteSubmit = await contractExecuteTx.execute(client);
	const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	//console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);
    
    return {
        response: contractExecuteSubmit,
        result: contractExecuteRx
    }
}


module.exports = {
    requestAccountInfo,
    executeContract,
    callContract
}