// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Wallet {
    address owner;
    uint totalBalance;
    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require (msg.sender == owner);
        _;
    }
    struct account {
        uint balance;
    }

    mapping (address => account) accounts;

    function send() external payable {
        accounts[msg.sender].balance += msg.value;
        totalBalance += msg.value;
    }
    function getBalance() external view returns(uint) {
        return accounts[msg.sender].balance;
    }
    function withdrawAll() external {
        uint _balance = accounts[msg.sender].balance;
        require(_balance != 0);
        require(_balance <= address(this).balance);
        payable(msg.sender).transfer(_balance);
        totalBalance -= _balance;
    }
    function withdrawAllAdmin() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
        totalBalance -= address(this).balance;
    }
    receive() external payable {}
    fallback() external payable {}

}
