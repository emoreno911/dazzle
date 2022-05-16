console.clear();
require("dotenv").config();
const {
	AccountId,
	PrivateKey,
	Client,
	FileCreateTransaction,
	FileAppendTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	ContractCallQuery,
	Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

// 12345678 - abcd - 4321
let addr1 = "0.0.34806041";
let addr2 = "0.0.34806042";
let addr3 = "0.0.34264077";
let amount1 = 200000000; // 2HBAR (1 HBAR = 100000000 TINYBAR)
let amount2 = 500000000; // 5HBAR

// init values
const iv = [
	["d865027b-9ea1-4c99-9053-0e4da90403b3", "0", "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f", amount1, addr1, false],
	["578975a5-3f4d-4a79-905f-0a3c8457042b", "0", "88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589", amount2, addr2, false],
	["1e91ba71-6f88-42bd-a9a6-3842fc9fec8a", "0", "fe2592b42a727e977f055947385b709cc82b16b9a87f88c6abf3900d65d0cdc3", amount1, addr3, false]
]

async function main() {
	// Import the compiled contract bytecode
	const contractBytecode = fs.readFileSync("DazzleProtocol_sol_DazzleProtocolV1.bin");

	//Create a file on Hedera and store the contract bytecode
	const fileCreateTx = new FileCreateTransaction().setKeys([operatorKey]).freezeWith(client);
	const fileCreateSign = await fileCreateTx.sign(operatorKey);
	const fileCreateSubmit = await fileCreateSign.execute(client);
	const fileCreateRx = await fileCreateSubmit.getReceipt(client);
	const bytecodeFileId = fileCreateRx.fileId;
	console.log(`- The smart contract bytecode file ID is ${bytecodeFileId}`);

	// Append contents to the file
	const fileAppendTx = new FileAppendTransaction()
		.setFileId(bytecodeFileId)
		.setContents(contractBytecode)
		.setMaxChunks(10)
		.freezeWith(client);
	const fileAppendSign = await fileAppendTx.sign(operatorKey);
	const fileAppendSubmit = await fileAppendSign.execute(client);
	const fileAppendRx = await fileAppendSubmit.getReceipt(client);
	console.log(`- Content added: ${fileAppendRx.status} \n`);

	// Instantiate the smart contract
	const contractInstantiateTx = new ContractCreateTransaction()
		.setBytecodeFileId(bytecodeFileId)
		.setAdminKey(operatorKey.publicKey)
		.setGas(1000000)
		.setConstructorParameters(new ContractFunctionParameters().addUint256(100000000).addString("0.0.34806041"));
	const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
	const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
	const contractId = contractInstantiateRx.contractId;
	const contractAddress = contractId.toSolidityAddress();
	console.log(`- The smart contract ID is: ${contractId} \n`);
	console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);
}

// https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

async function testContract() {
	const bytecodeFileId = "0.0.34819104";
	const contractId = "0.0.34822145"; //"0.0.34819105";
	console.log(`- The smart contract bytecode file ID is ${bytecodeFileId}`);
	console.log(`- The smart contract ID is: ${contractId} \n`);
	//console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

	// Call contract function to update the state variable
	/*const iv1 = iv[1];
	const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(1000000)
		.setFunction(
			"createDeposit",
			new ContractFunctionParameters()
				.addString(iv1[0])
				.addString(iv1[1])
				.addBytes32(fromHexString(iv1[2]))
				.addUint256(iv1[3])
				.addString(addr1)
				.addBool(true)
		);
	const contractExecuteSubmit = await contractExecuteTx.execute(client);
	const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);

	// Query the contract to check changes in state variable
	const contractQueryTx = new ContractCallQuery()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction("validateClaim", 
			new ContractFunctionParameters()
				.addString("d865027b-9ea1-4c99-9053-0e4da90403b3")
				.addString("12345678")
		)
		.setQueryPayment(new Hbar(2));
	const contractQuerySubmit = await contractQueryTx.execute(client);
	const contractQueryResult = contractQuerySubmit.getString(0);
	console.log(`- Here's the phone number that you asked for: \n`, contractQueryResult);*/

	const contractQueryTx = new ContractCallQuery()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction("getBalance")
		.setQueryPayment(new Hbar(2));
	const contractQuerySubmit = await contractQueryTx.execute(client);
	const contractQueryResult = contractQuerySubmit.getUint256(0).toString();
	console.log(`- Here's the phone number that you asked for: \n`, contractQueryResult);

	const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(1000000)
		.setFunction(
			"executeClaim",
			new ContractFunctionParameters()
				.addString("d865027b-9ea1-4c99-9053-0e4da90403b3")
				.addString("12345678")
				.addAddress(AccountId.fromString(addr2).toSolidityAddress())
		);
	const contractExecuteSubmit = await contractExecuteTx.execute(client);
	const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	console.log(`- Contract function call status: ${contractExecuteRx.status} \n`);
}

main();
//testContract();