// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.9.0;

import "./ITRC20.sol";
import "./ITRC721.sol";

// compile in https://nile.tronscan.org/#/contracts/contract-compiler with version 0.7.6
contract DazzleProtocolV2 {
    ITRC20 _token20;
    ITRC721 _token721;
    
    enum ClaimStatus {
        Opened,
        Closed
    }
    
    enum Category {
        NATIVE,
        TOKEN,
        NFT
    }

    struct Deposit {
        uint tokenId; 
        uint amount;
        string sender;
        bool isFungible; 
        ClaimStatus status; 
        address contractAddr;
        Category category; 
    }
    
    address public owner;
    
    mapping(string => address) public smartWallets;  // socialid => wallet

    mapping(string => Deposit) public deposits;

    mapping(string => bytes32) private hashes;

    event DepositCreated(string id, address contractAddr);

    event DepositClaimed(string id, address beneficiary);

    event TransferReceived(address indexed _from, uint _value);
    
    event SmartWalletCreated(address addr);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }

    receive() external payable {
        emit TransferReceived(msg.sender,msg.value);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    function getSmartWallet(string memory socialid) public view returns (address) {
        return smartWallets[socialid];
    }
    
    function addSmartWallet(string memory socialid, address walletAddr) public onlyOwner {
        smartWallets[socialid] = walletAddr;
        emit SmartWalletCreated(walletAddr);
    }

    function createDeposit(
        string memory id,
        uint tokenId,
        bytes32 hash,
        uint amount,
        string memory sender,
        bool isFungible,
        address contractAddr,
        Category category
    ) public {
        Deposit memory deposit;
        deposit = Deposit(
            tokenId,
            amount,
            sender,
            isFungible,
            ClaimStatus.Opened,
            contractAddr,
            category
        );

        deposits[id] = deposit;
        hashes[id] = hash;
        emit DepositCreated(id, contractAddr);
    }

    function validateClaim(string memory id, string memory pwd) public view returns(string memory, address) {
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

        if (deposits[id].category == Category.NFT) {
            executeClaimNft(id, beneficiary); // Is an NFT
        }
        else if (deposits[id].category == Category.TOKEN) {
            executeClaimToken(id, beneficiary); // Is a TRC20
        }
        else {
            beneficiary.transfer(deposits[id].amount); // Is TRX
        }
        
        deposits[id].status = ClaimStatus.Closed;
        emit DepositClaimed(id, beneficiary);
    }

    function executeClaimToken(string memory id, address beneficiary) internal {
        _token20 = ITRC20(deposits[id].contractAddr);
        _token20.transfer(beneficiary, deposits[id].amount);
    }

    function executeClaimNft(string memory id, address beneficiary) internal {
        _token721 = ITRC721(deposits[id].contractAddr);
        _token721.safeTransferFrom(address(this), beneficiary, deposits[id].tokenId);
    }

    function stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
        bool result = keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
        return result;
    }

    function makeAndCompareHash(string memory id, string memory pwd) private view returns (bool) {
        bytes32 hash = sha256(abi.encodePacked(pwd));
        return hashes[id] == hash;
    }

    function depositToString(string memory id) private view returns (string memory, address) {
        string memory category = deposits[id].category == Category.NATIVE ? "0" : deposits[id].category == Category.TOKEN ? "1" : "2";
        string memory claimed = deposits[id].status == ClaimStatus.Closed ? "1" : "0";
        string memory isFungible = deposits[id].isFungible ? "1" : "0";
        
        string memory deposit_ = joinStrings(
            uintToString(deposits[id].tokenId),
            uintToString(deposits[id].amount),
            deposits[id].sender,
            isFungible,
            claimed,
            category
        );

        return (deposit_, deposits[id].contractAddr);
    }

    function joinStrings(string memory a, string memory b, string memory c, string memory d, string memory e, string memory f) 
        internal pure returns (string memory result) {
            string memory sp = "|";
            result = string(abi.encodePacked(a, sp, b, sp, c, sp, d, sp, e, sp, f));
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