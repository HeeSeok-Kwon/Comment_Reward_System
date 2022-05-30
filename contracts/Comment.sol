// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;


contract Comment {
  struct Writer {
    address WriterAddress;
    string name;
  }

  struct Commenter {
    address CommenterAddress;
    string name;
    uint writerId;
  }

  mapping (uint => Writer) public WriterInfo;
  mapping (uint => Commenter) public CommenterInfo;
  mapping (address => uint) balance;

  address public owner;

  event LogWriteText(address _writer, uint _id);
  event LogWriteComment(address _commenter, uint _commentId, uint _writerId);

  constructor() public {
      owner = msg.sender;
  }

  function writeText(uint _id, string memory _name) public payable {
    WriterInfo[_id] = Writer(msg.sender, _name);

    payable(owner).transfer(msg.value); // 0.1 ether
    emit LogWriteText(msg.sender, _id);
  }

  function writeComment(address _commenterAddr, uint _id, string memory _name, uint _writerId) public payable {
    CommenterInfo[_id] = Commenter(msg.sender, _name, _writerId);

    payable(_commenterAddr).transfer(msg.value); // 1 ether
    emit LogWriteComment(_commenterAddr, _id, _writerId);
  }
}