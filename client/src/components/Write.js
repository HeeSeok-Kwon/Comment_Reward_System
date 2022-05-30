import React, {useEffect, useState, useReducer} from "react";
import Axios from 'axios';
import "./css/write.css";
import Web3 from "web3";

function Write(props) {
    console.log("Write Page");
    let commentAddr = "0x45d1D7570c999Add3546a804629cB23318D821A2";
    let commentABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "_commenter", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_commentId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "_writerId", "type": "uint256" } ], "name": "LogWriteComment", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "_writer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "LogWriteText", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "CommenterInfo", "outputs": [ { "internalType": "address", "name": "CommenterAddress", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "writerId", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "WriterInfo", "outputs": [ { "internalType": "address", "name": "WriterAddress", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_name", "type": "string" } ], "name": "writeText", "outputs": [], "stateMutability": "payable", "type": "function", "payable": true }, { "inputs": [ { "internalType": "address", "name": "_commenterAddr", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "uint256", "name": "_writerId", "type": "uint256" } ], "name": "writeComment", "outputs": [], "stateMutability": "payable", "type": "function", "payable": true } ];
    let owner;
    let commentContract;
    let account;
    const initWeb3 = async () => {
        
        if(window.ethereum){

            var web3 = new Web3(window.ethereum);

            console.log('메타마스크 연결해서 실행이 잘 됩니다.')
            console.log(web3)
            
            try{
                await window.ethereum.enable();
            }catch (error){
                console.log(`error ouccur ${error}`)
            }
        } else if(window.web3){
            var web3 = new Web3(Web3.curentProvider);
        } else{
            console.log('메타마스크 연결이 필요합니다...')
        }

        account = await web3.eth.getAccounts();
        console.log("현재 활성화된 계정이 나옵니다 : " + account); 
        setGetWeb3UserAddr(account);

        commentContract = new web3.eth.Contract(commentABI, commentAddr);
        owner = await commentContract.methods.owner().call();
        console.log('owner:', owner);
    }

    useEffect( async()=>{
        await initWeb3();
    },[]);
   
    Axios.defaults.withCredentials = true;
    let username = props.name;
    
    const [titleReg, setTitleReg] = useState("");
    const [contentReg, setContentReg] = useState("");
    const [getUserId, setGetUserId] = useState(0);
    const [getUserAddr, setGetUserAddr] = useState(""); // DB에 저장된 주소
    const [getWeb3UserAddr, setGetWeb3UserAddr] = useState(""); // 메타마스크 활성화된 주소

    const registerText = async() => {
        if(window.ethereum){
            var web3 = new Web3(window.ethereum);
            commentContract = new web3.eth.Contract(commentABI, commentAddr);
            let result = await commentContract.methods.writeText(getUserId, username).send({from: getUserAddr, value: '2000000000000000000'});
            console.log("이더 전송 결과 : "+ result);
        }
    }

    function checkAddr() {
        if(getUserAddr == getWeb3UserAddr) {
            writeText(); // DB 저장
            console.log("DB 저장 완료");
            registerText(); // Smart Contract 실행
            alert("글쓰기 완료 & 이더 전송 성공");
            console.log("Smart Contract 실행 완료");
        } else {
            alert("글쓰기 실패 & 이더 전송 실패");
        }
        window.location.href='/';
    }

    const writeText = () => {
        Axios.post("http://localhost:3001/writeText", {
            username: username,
            title: titleReg,
            content: contentReg,
        }).then((response) => {
            console.log(response.data);
            console.log("DB 저장 성공");
        });
    };

    useEffect(() => {
        Axios.post("http://localhost:3001/getUserId", {username: props.name}).then((response) => {
            console.log("UserId 가져옵니다.");
            console.log(response.data);
            setGetUserAddr(response.data[0].user_addr);
            setGetUserId(response.data[0].user_id);
        })
    }, [])

    return (
        <React.Fragment>
            <div class="qna_box">
                <div class="qna_top_wrap fixed-bar-box-shadow">
                    <div class="qna_title">
                        질문하기
                    </div>
                    <div class="board_top_asbtn">
                        <button onClick={checkAddr}>완료</button>
                    </div>
                </div>
                <div class="qna_bottom_wrap">
                    <section class="botm1">
                        <form action='#' method="post" name="frm" >   
                            <input type="hidden" name="idx" value="<?=$idx?>" />
                            <div class="sgap"></div>
                            <div class="boardWriter">
                                <ul>
                                    <li>
                                        <div class="title">제목</div>
                                        <input type="text" id="title" onChange={(e) => {setTitleReg(e.target.value);}} placeholder="제목을 입력해주세요" />
                                    </li>
                                    <li>
                                        <div class="title">내용</div>
                                        <textarea name="contents" id="content" onChange={(e) => {setContentReg(e.target.value);}}></textarea>
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </section>
                    <section class="botm2">
                        <div class="board_bottom_asbtn">
                            <a href="javascript:history.back()">돌아가기</a>
                        </div>
                    </section>
                </div>
            </div>           
        </React.Fragment>
    )
}
export default Write;