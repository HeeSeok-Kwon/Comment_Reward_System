const Comment = artifacts.require("./Comment.sol");

contract ("Comment", function(accounts) {
  var CommentInstance;
  it("컨트랙트 소유자 초기화 테스팅", async () => {
    return Comment.deployed().then(function(instance) {
      CommentInstance = instance;
      return CommentInstance.owner.call();
    }).then(function(owner) {
      assert.equal(owner.toUpperCase(), accounts[0].toUpperCase(), "owner가 가나슈 0번째 계정과 일치하지 않습니다.");
    });
  });

  it("컨트랙트 writeText 함수 테스팅", function() {
    return Comment.deployed().then(function(instance) {
      CommentInstance = instance;
      return CommentInstance.writeText(0, "testname", {from: accounts[1], value: web3.utils.toWei("1.1", "ether")});
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "이벤트 하나가 생성되지 않음");
      assert.equal(receipt.logs[0].event, "LogWriteText", "이벤트가 LogWriteText가 아님");
      assert.equal(receipt.logs[0].args._writer, accounts[1], "글 작성자가 가냐슈 첫번째 계정이 아님");
      assert.equal(receipt.logs[0].args._id, 0, "글 아이디가 0이 아님");
    });
  });
});

