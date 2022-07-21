import {
    Client,
    PrivateKey,
    HbarUnit,
    TransferTransaction,
    Transaction,
    AccountId,
    Hbar,
    TransactionId,
    PublicKey
} from "@hashgraph/sdk"

export class SigningService {

    constructor() {
        //this.init();
     }

    /*****************************
     * 
     *  PLEASE NOTE
     *  THIS SHOULD BE SERVER SIDE, 
     *  NEVER PUT YOUR DAPP PRIVATE KEYS CLIENT SIDE 
     *  GENERATE A FROZEN TRANSACTION ON YOUR SERVER USING YOUR KEYS AND RETURN IT
     */

    client = null;
    pk = "";
    publicKey = "";
    acc = "";

    async init() {
        this.client = Client.forTestnet();
        this.client.setOperator(this.acc, this.pk);
    }

    async signAndMakeBytes(trans, signingAcctId) {
        
        const privKey = PrivateKey.fromString(this.pk);
        const pubKey = privKey.publicKey;

        let nodeId = [new AccountId(3)];
        let transId = TransactionId.generate(signingAcctId)
        
        trans.setNodeAccountIds(nodeId);
        trans.setTransactionId(transId);
        
        trans = await trans.freeze();

        let transBytes = trans.toBytes();

        const sig = await privKey.signTransaction(Transaction.fromBytes(transBytes));

        const out = trans.addSignature(pubKey, sig);

        const outBytes = out.toBytes();
        
        console.log("Transaction bytes", outBytes);

        return outBytes;
    }

    async makeBytes(trans, signingAcctId) {
        let transId = TransactionId.generate(signingAcctId)
        trans.setTransactionId(transId);
        trans.setNodeAccountIds([new AccountId(3)]);

        await trans.freeze();
        
        let transBytes = trans.toBytes();

        return transBytes;
    }

    signData(data) {
        const privKey = PrivateKey.fromString(this.pk);
        const pubKey = privKey.publicKey;

        let bytes = new Uint8Array(Buffer.from(JSON.stringify(data)));

        let signature = privKey.sign(bytes);

        let verify = pubKey.verify(bytes, signature); //this will be true

        return { signature: signature, serverSigningAccount: this.acc }
    }

    verifyData(data, publicKey, signature) {
        const pubKey = PublicKey.fromString(publicKey);

        let bytes = new Uint8Array(Buffer.from(JSON.stringify(data)));

        let verify = pubKey.verify(bytes, signature);

        return verify;
    }
}