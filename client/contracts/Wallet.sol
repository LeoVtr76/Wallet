// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Wallet {
    address owner;
    uint totalBalance;
    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require (msg.sender == owner, "not the owner");
        _;
    }
    struct account {
        string name;
        uint balance;
    }

    mapping (address => account) accounts;
    function setName(string memory _name) external {
        accounts[msg.sender].name = _name;
    }
    function getName() external view returns(string memory){
        return accounts[msg.sender].name;
    }
    function sendEth() external payable {
        accounts[msg.sender].balance += msg.value;
        totalBalance += msg.value;
    }
    function getBalance() external view returns(uint) {
        return accounts[msg.sender].balance;
    }
    function withdrawAll() external {
        uint _balance = accounts[msg.sender].balance;
        require(_balance != 0, "Votre balance est nulle !");
        require(_balance <= address(this).balance, "votre solde est superieur a la quantite d'ether disponible");
        payable(msg.sender).transfer(_balance);
        totalBalance -= _balance;
        accounts[msg.sender].balance = 0;
    }
    function withdrawAllAdmin() external onlyOwner {
        uint _balance = address(this).balance;
        totalBalance -= _balance;
        payable(msg.sender).transfer(_balance);
    }
    receive() external payable {}
    fallback() external payable {}

}
