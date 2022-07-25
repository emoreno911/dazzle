// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./ITRC20.sol";
import "./ITRC721.sol";

contract BaseWallet {
    ITRC20 _token20;
    ITRC721 _token721;
    
    string public name;
    address private owner;
    bytes32 private pincode;

    constructor(string memory _name, bytes32 _pincode) {
        owner = payable(msg.sender);
        pincode = _pincode;
        name = _name;
    }

    receive() external payable {}
    
    modifier onlyOwner() {
      require(msg.sender == owner, "caller is not owner");
      _;
    }
    
    function getPinHash() external view onlyOwner returns (bytes32) {
        return pincode;
    }

    function withdraw(uint amount, address beneficiary) external onlyOwner {
        payable(beneficiary).transfer(amount);
    }
    
    function withdrawToken(address contractAddr, uint amount, address beneficiary) external onlyOwner {
        _token20 = ITRC20(contractAddr);
        _token20.transfer(beneficiary, amount);
    }

    function withdrawNft(address contractAddr, uint tokenId, address beneficiary) external onlyOwner {
        _token721 = ITRC721(contractAddr);
        _token721.safeTransferFrom(address(this), beneficiary, tokenId);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}