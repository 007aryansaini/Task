// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract chat {
    
    
     
      mapping(address => bool) public registered;
      mapping(address => uint) noOfMessagesSent;
      mapping(address => mapping(uint => string)) messages;

      event messageSent(address indexed from, address indexed to, string  message);

      function register() external returns(bool){
              
            require(registered[msg.sender] == false , "User already registered");
            registered[msg.sender] = true;
            return true;
      }

      function sendMessage(address _to , string calldata _message) external {
               require(_to != address(0) , "Enter a Valid Address");
               require(msg.sender != _to , "You cannot message to yourself");
               require(registered[msg.sender] , "You are not registered");
               require(registered[_to] , "The person you are trying to message is not registered");
               require(bytes(_message).length > 0 , "Enter a Valid message");

               
               messages[msg.sender][noOfMessagesSent[msg.sender]] = _message;
               noOfMessagesSent[msg.sender] += 1;

               emit messageSent(msg.sender , _to , _message);
      }

      function getAllMessages(address _user) external view returns(string[] memory){
            
            require(_user != address(0) , "User is not Valid");
            require(registered[_user] , "User is not registered");
            
            

            uint noOfMessages = noOfMessagesSent[_user];
            string[]  memory allMessages = new string[](noOfMessages);

            for(uint i=0 ; i < noOfMessages ; i++){
                     allMessages[i] = messages[_user][i];
            }


            return allMessages;
      }


}