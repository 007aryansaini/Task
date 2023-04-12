//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

struct IdoDetails {
    uint256 startTime;
    uint256 endTime;
    uint256 hardCap;
    address[] whiteListUsers;
}

contract IDO {
    uint256 public totalFundRaised;
    address public owner;

    mapping(address => bool) public isWhiteList;
    mapping(address => uint256) public investorContribution;

    IdoDetails public idoDetails;

    modifier onlyWhiteList() {
        require(isWhiteList[msg.sender], "User is not White Listed");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not Owner");
        _;
    }

    modifier onlyActive() {
        require(
            block.timestamp >= idoDetails.startTime &&
                block.timestamp <= idoDetails.endTime &&
                idoDetails.startTime < idoDetails.endTime,
            "Sale must be active."
        );

        _;
    }

    event Invested(address _investor, uint256 _amount);
    event Transfer(address indexed _to, uint256 _amount);

    constructor() {
        owner = msg.sender;
        isWhiteList[msg.sender] = true;
    }

    function createIDO(IdoDetails calldata _idoDetails) external onlyOwner {
        require(
            _idoDetails.startTime < _idoDetails.endTime,
            "Invalud Time To Start IDO"
        );
        idoDetails = _idoDetails;
        for (uint256 i = 0; i < _idoDetails.whiteListUsers.length; i++) {
            isWhiteList[_idoDetails.whiteListUsers[i]] = true;
        }
    }

    function fundIdo() external payable onlyWhiteList onlyActive {
        uint256 fundAmount = msg.value;
        require(fundAmount > 0, "O investment not allowed");
        require(
            fundAmount + totalFundRaised <= idoDetails.hardCap,
            "Hard Cap Reached"
        );

        totalFundRaised += fundAmount;
        investorContribution[msg.sender] += fundAmount;

        emit Invested(msg.sender, fundAmount);
    }

    function transferIdoFund(address _to, uint256 _amount) external onlyOwner {
        require(_to != address(0), "Cannot transfer to 0 address");

        require(address(this).balance >= _amount, "Not Enough Balance");

        (bool sent, ) = payable(_to).call{value: _amount}("");
        require(sent, "Failed to Transfer");

        emit Transfer(_to, _amount);
    }
}
