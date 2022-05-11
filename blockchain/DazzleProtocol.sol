// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract DazzleProtocolV1 {
    
    enum ClaimStatus {
        Opened,
        Closed
    }

    struct Deposit {
        string tokenId; 
        uint amount;
        bool isFungible; 
        address sender; 
        ClaimStatus status;  
    }

    mapping(string => Deposit) public deposits;

    mapping(string => string) private hashes;

    event DepositCreated(string id, string tokenId);

    event DepositClaimed(string id, string beneficiary);

    //event TransferReceived(address indexed _from, uint _value);

    // function () external payable {
    //     emit TransferReceived(msg.sender,msg.value);
    // }

    /**  **/
    function createDeposit(
        string _id,
        string _hash,
        string _tokenId,
        uint _amount,
        address _sender,
        bool _isFungible,
        ClaimStatus _status
    ) public {
        Deposit memory deposit;
        deposit = Deposit(
            _tokenId,
            _amount,
            _isFungible,
            payable(msg.sender),
            ClaimStatus.Opened
        );

        deposits[_id] = deposit;
        hashes[_id] = _hash;
        emit DepositCreated(_id, _tokenId);

        // associate token first (BE) then send response and make transfer in FE
    }

    function validateClaim(string _id, string _hash) public view returns(Deposit deposit_) {
        require(hashes[_id] == _hash, "Invalid password, hash doesn't match");

        deposit_ = deposits[_id];
    }

    function executeClaim(
        string _id, 
        string _hash,
        string beneficiary
    ) public {
        require(hashes[_id] == _hash, "Invalid password, hash doesn't match");
        require(deposits[_id].status == ClaimStatus.Opened, "Deposit already claimed!");

        // check if is a token transfer or HBAR
        // https://github.com/hashgraph/hedera-smart-contracts/blob/main/hts-precompile/HederaTokenService.sol
        // https://github.com/hashgraph/hedera-services/blob/master/test-clients/src/main/resource/contract/contracts/Transferring/Transferring.sol
        // https://github.com/hashgraph/hedera-services/blob/master/test-clients/src/main/resource/contract/contracts/TransferAmountAndToken/TransferAmountAndToken.sol

        // associate token for beneficiary in FE or BE (if new wallet)
        // https://github.com/ed-marquez/hedera-sdk-js/blob/main/examples/create-account.js

        emit DepositClaimed(_id, beneficiary)
    }

}