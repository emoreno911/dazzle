// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract DazzleProtocolV1 {

    enum ClaimStatus {
        Opened,
        Closed
    }

    struct Deposit {
        string tokenId; 
        uint256 amount;
        string sender;
        bool isFungible; 
        ClaimStatus status;  
    }

    mapping(string => Deposit) public deposits;

    mapping(string => bytes32) private hashes;

    event DepositCreated(string id, string tokenId);

    event DepositClaimed(string id, address beneficiary);

    event TransferReceived(address indexed _from, uint256 _value);

    constructor(uint256 initAmount, string memory sender) {
        bytes32 hash = sha256(abi.encodePacked("12345678"));
        createDeposit("d865027b-9ea1-4c99-9053-0e4da90403b3","0",hash,initAmount,sender,true);
    }

    receive() external payable {
        emit TransferReceived(msg.sender,msg.value);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function createDeposit(
        string memory id,
        string memory tokenId,
        bytes32 hash,
        uint256 amount,
        string memory sender,
        bool isFungible
    ) public {
        Deposit memory deposit;
        deposit = Deposit(
            tokenId,
            amount,
            sender,
            isFungible,
            ClaimStatus.Opened
        );

        deposits[id] = deposit;
        hashes[id] = hash;
        emit DepositCreated(id, tokenId);

        // associate token first (BE) then send response and make transfer in FE
    }

    function validateClaim(string memory id, string memory pwd) public view returns(string memory deposit_) {
        require(makeAndCompareHash(id, pwd), "Invalid password, hash doesn't match");
        return depositToString(id);
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

            if (deposits[id].isFungible) {

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

    function depositToString(string memory id) private view returns (string memory deposit_) {
        string memory claimed = deposits[id].status == ClaimStatus.Closed ? "1" : "0";
        string memory isFungible = deposits[id].isFungible ? "1" : "0";

        deposit_ = joinStrings(
            deposits[id].tokenId,
            uintToString(deposits[id].amount),
            deposits[id].sender,
            isFungible,
            claimed
        );

        return deposit_;
    }

    function joinStrings(string memory a, string memory b, string memory c, string memory d, string memory e) 
        internal pure returns (string memory result) {
            string memory sp = "|";
            result = string(abi.encodePacked(a, sp, b, sp, c, sp, d, sp, e));
    }

    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

}