import { HashConnect } from 'hashconnect';
import { 
    TransferTransaction,
    AccountInfoQuery,
    ContractCallQuery, 
    ContractFunctionParameters, 
    ContractExecuteTransaction, 
    TransactionReceipt,
    Hbar, 
    HbarUnit
} from '@hashgraph/sdk';
import { SigningService } from './signing';
import { appMetadata } from './utilities';

export class HashconnectService {

    constructor() { 
        
    }

    hashconnect;
    status = "Initializing";
    accIndex = 0;
    
    availableExtensions = []

    saveData = {
        topic: "",
        pairingString: "",
        privateKey: undefined,
        pairedWalletData: undefined,
        pairedAccounts: []
    }

    async initHashconnect() {
        //create the hashconnect instance
        this.hashconnect = new HashConnect(true);

        if(!this.loadLocalData()){
            //first init, store the private key in localstorage
            let initData = await this.hashconnect.init(appMetadata);
            this.saveData.privateKey = initData.privKey;

            //then connect, storing the new topic in localstorage
            const state = await this.hashconnect.connect();
            console.log("Received state", state);
            this.saveData.topic = state.topic;
            
            //generate a pairing string, which you can display and generate a QR code from
            this.saveData.pairingString = this.hashconnect.generatePairingString(state, "testnet", false);
            
            //find any supported local wallets
            this.hashconnect.findLocalWallets();

            this.status = "Connected";
        }
        else {
            await this.hashconnect.init(appMetadata, this.saveData.privateKey);
            await this.hashconnect.connect(this.saveData.topic, this.saveData.pairedWalletData);

            this.status = "Paired";
        }

        this.setUpEvents();
        
        return this.saveData; 
    }

    setUpEvents() {
        console.log("Paired Accounts", this.saveData.pairedAccounts)
        this.SigningService = new SigningService(
            this.saveData.pairedAccounts[this.accIndex], 
            this.saveData.privateKey
        );

        this.hashconnect.foundExtensionEvent.on((data) => {
            this.availableExtensions.push(data);
            console.log("Found extension", data);
        })


        // this.hashconnect.additionalAccountResponseEvent.on((data) => {
        //     console.log("Received account info", data);
            
        //     data.accountIds.forEach(id => {
        //         if(this.saveData.pairedAccounts.indexOf(id) == -1)
        //             this.saveData.pairedAccounts.push(id);
        //     })
        // })

        this.hashconnect.pairingEvent.on((data) => {
            console.log("Paired with wallet", data);
            this.status = "Paired";

            this.saveData.pairedWalletData = data.metadata;

            data.accountIds.forEach(id => {
                if(this.saveData.pairedAccounts.indexOf(id) == -1)
                    this.saveData.pairedAccounts.push(id);
            })

            this.saveDataInLocalstorage();
        });


        this.hashconnect.transactionEvent.on((data) => {
            //this will not be common to be used in a dapp
            console.log("transaction event callback");
        });
    }

    async connectToExtension() {
        this.hashconnect.connectToLocalWallet(this.saveData.pairingString);
    }

    async makeTransaction(signer) {
        let trans = await new TransferTransaction()
            //.addHbarTransfer(this.saveData.pairedAccounts[0], -1)
            //.addHbarTransfer("0.0.34407878", 1)
            .addNftTransfer("0.0.34736300", 1, this.saveData.pairedAccounts[0], "0.0.34407878")
            .freezeWithSigner(signer);

        let res = await trans.executeWithSigner(signer);

        return res
    }

    saveDataInLocalstorage() {
        let data = JSON.stringify(this.saveData);
        
        localStorage.setItem("hashconnectData", data);
    }

    loadLocalData() {
        let foundData = localStorage.getItem("hashconnectData");

        if(foundData){
            this.saveData = JSON.parse(foundData);
            console.log("Found local data", this.saveData)
            return true;
        }
        else
            return false;
    }

    clearPairings() {
        this.saveData.pairedAccounts = [];
        this.saveData.pairedWalletData = undefined;
        this.status = "Connected";
        localStorage.removeItem("hashconnectData");
        console.log('Pairings Cleared!')
    }

    /*showResultOverlay(data) {
            const dialogPopup = new DialogInitializer(ResultModalComponent);
    
            dialogPopup.setCustomData({ data: data });
            
            dialogPopup.setConfig({
                Width: '500px',
                LayoutType: DialogLayoutDisplay.NONE
            });
    
            dialogPopup.setButtons([
                new ButtonMaker('Done', 'send', ButtonLayoutDisplay.SUCCESS)
            ]);
    
            dialogPopup.openDialog$().subscribe(resp => { });
    }*/
}