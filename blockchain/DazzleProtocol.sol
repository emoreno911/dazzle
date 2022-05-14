// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract DazzleProtocolV1 {
    enum TokenType {
        FUNGIBLE_COMMON,
        NON_FUNGIBLE_UNIQUE
    }

    enum ClaimStatus {
        Opened,
        Closed
    }

    struct Deposit {
        string tokenId; 
        uint amount;
        address sender;
        TokenType tokenType; 
        ClaimStatus status;  
    }

    mapping(string => Deposit) public deposits;

    mapping(string => bytes32) private hashes;

    event DepositCreated(string id, string tokenId);

    event DepositClaimed(string id, address beneficiary);

    event TransferReceived(address indexed _from, uint _value);

    receive() external payable {
        emit TransferReceived(msg.sender,msg.value);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // 12345678 - abcd - 4321
    address constant private addr1 = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    address constant private addr2 = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;
    address constant private addr3 = 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db;
    uint private amount1 = 2000000000000000000; // 2ETH
    uint private amount2 = 5000000000000000000; // 5ETH
    constructor() {
        createDeposit("d865027b-9ea1-4c99-9053-0e4da90403b3", "0", 0xef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f, amount1, addr1, TokenType.FUNGIBLE_COMMON);
        createDeposit("578975a5-3f4d-4a79-905f-0a3c8457042b", "0", 0x88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589, amount2, addr2, TokenType.FUNGIBLE_COMMON);
        createDeposit("1e91ba71-6f88-42bd-a9a6-3842fc9fec8a", "0", 0xfe2592b42a727e977f055947385b709cc82b16b9a87f88c6abf3900d65d0cdc3, amount1, addr3, TokenType.FUNGIBLE_COMMON);
    }

    /**  **/
    function createDeposit(
        string memory id,
        string memory tokenId,
        bytes32 hash,
        uint amount,
        address sender,
        TokenType tokenType
    ) public {
        Deposit memory deposit;
        deposit = Deposit(
            tokenId,
            amount,
            payable(sender),
            tokenType,
            ClaimStatus.Opened
        );

        deposits[id] = deposit;
        hashes[id] = hash;
        emit DepositCreated(id, tokenId);

        // associate token first (BE) then send response and make transfer in FE
    }

    function validateClaim(string memory id, string memory pwd) public view returns(Deposit memory deposit_) {
        require(makeAndCompareHash(id, pwd), "Invalid password, hash doesn't match");
        deposit_ = deposits[id];
    }

    function executeClaim(
        string memory id, 
        string memory pwd,
        address payable beneficiary
    ) public payable {
        require(makeAndCompareHash(id, pwd), "Invalid password, hash doesn't match");
        require(deposits[id].status == ClaimStatus.Opened, "Deposit already claimed!");

        // check if is a token transfer or HBAR
        if (stringsEquals(deposits[id].tokenId, "0")) { // HBAR
            beneficiary.transfer(deposits[id].amount);
            deposits[id].status = ClaimStatus.Closed;
        }
        else {

            if (deposits[id].tokenType == TokenType.FUNGIBLE_COMMON) {

            }
            else { // Is a NFT

            }

        }

        // https://github.com/hashgraph/hedera-smart-contracts/blob/main/hts-precompile/HederaTokenService.sol
        // https://github.com/hashgraph/hedera-services/blob/master/test-clients/src/main/resource/contract/contracts/Transferring/Transferring.sol
        // https://github.com/hashgraph/hedera-services/blob/master/test-clients/src/main/resource/contract/contracts/TransferAmountAndToken/TransferAmountAndToken.sol

        // associate token for beneficiary in FE or BE (if new wallet)
        // https://github.com/ed-marquez/hedera-sdk-js/blob/main/examples/create-account.js

        emit DepositClaimed(id, beneficiary);
    }

    function stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
        bool result = keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
        return result;
    }

    function makeAndCompareHash(string memory id, string memory pwd) private view returns (bool) {
        bytes32 hash = sha256(abi.encodePacked(pwd));
        return hashes[id] == hash;
    }

}