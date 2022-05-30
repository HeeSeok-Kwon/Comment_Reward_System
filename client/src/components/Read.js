import React, {useEffect, useState} from "react";
import Axios from 'axios';
import { Link, useParams } from "react-router-dom";
import "./css/read.css";
import Web3 from "web3";

function Read(props) {
    console.log("Read Page");
    let commentAddr = "0x45d1D7570c999Add3546a804629cB23318D821A2";
    let commentABI = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "_commenter", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_commentId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "_writerId", "type": "uint256" } ], "name": "LogWriteComment", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "_writer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_id", "type": "uint256" } ], "name": "LogWriteText", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "CommenterInfo", "outputs": [ { "internalType": "address", "name": "CommenterAddress", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "writerId", "type": "uint256" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "WriterInfo", "outputs": [ { "internalType": "address", "name": "WriterAddress", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function", "constant": true }, { "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_name", "type": "string" } ], "name": "writeText", "outputs": [], "stateMutability": "payable", "type": "function", "payable": true }, { "inputs": [ { "internalType": "address", "name": "_commenterAddr", "type": "address" }, { "internalType": "uint256", "name": "_id", "type": "uint256" }, { "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "uint256", "name": "_writerId", "type": "uint256" } ], "name": "writeComment", "outputs": [], "stateMutability": "payable", "type": "function", "payable": true } ];
    let owner;
    let commentContract;
    let account;
    const initWeb3 = async () => {
    
        if(window.ethereum){

            var web3 = new Web3(window.ethereum);

            console.log('메타마스크 연결해서 실행이 잘 됩니다.');
            console.log(web3);
            
            try{
                await window.ethereum.enable();
            }catch (error){
                console.log(`error ouccur ${error}`);
            }
        } else if(window.web3){
            var web3 = new Web3(Web3.curentProvider);
        } else{
            console.log('메타마스크 연결이 필요합니다...');
        }

        account = await web3.eth.getAccounts();
        console.log("현재 활성화된 계정이 나옵니다 : " + account); 
        setGetWeb3UserAddr(account);

        commentContract = new web3.eth.Contract(commentABI, commentAddr);
        owner = await commentContract.methods.owner().call();
        console.log('owner:', owner);
        setGetOwnerAddr(owner);
    }

    useEffect( async()=>{
        await initWeb3();
    },[]);

    const [commentReg, setCommentReg] = useState("");
    const [viewComment, setViewComment] = useState([]);
    // const [viewCommentId, getViewCommentId] = useState(0);
    const [viewSelectedComment, setViewSelectedComment] = useState([]);
    const [getOwnerAddr, setGetOwnerAddr] = useState(""); // owner 계정 주소 
    const [getWeb3UserAddr, setGetWeb3UserAddr] = useState(""); // 메타마스크 활성화된 주소

    const params = useParams();
    console.log(props.name);

    let username = props.name;

    function checkOwner(_commenterAddr, _id, _name, _writerId) {
        if(getOwnerAddr == getWeb3UserAddr) {
            selectComment(_id);
            console.log("댓글 채택 성공");
            
            executeSelectComment(_commenterAddr, _id, _name, _writerId);
            console.log("댓글 채택 Smart Contract 성공");

        } else {
            alert("Owner 계정 활성화가 필요합니다.");
        }
    }

    const executeSelectComment = async(_commenterAddr, _id, _name, _writerId) => {
        if(window.ethereum){
            var web3 = new Web3(window.ethereum);
            commentContract = new web3.eth.Contract(commentABI, commentAddr);
            let result = await commentContract.methods.writeComment(_commenterAddr, _id, _name, _writerId).send({from: getOwnerAddr, value: '1000000000000000000'});
            console.log("이더 전송 결과 : "+ result);
        }
    }
    
    useEffect(() => {
        Axios.post("http://localhost:3001/getComments", {textId: params.text_id}).then((response) => {
            console.log("댓글 쿼리");
            console.log(response.data);
            setViewComment(response.data);
        })
    }, [])

    useEffect(() => {
        Axios.post("http://localhost:3001/getSelectedComments", {textId: params.text_id}).then((response) => {
            console.log("댓글 채택 쿼리");
            console.log(response.data);
            setViewSelectedComment(response.data);
        })
    }, [])

    const writeComment = () => {
        Axios.post("http://localhost:3001/writeComment", {
            textId: params.text_id,
            username: username,
            comment: commentReg,
        }).then((response) => {
            console.log(response.data);
            window.location.reload();
        });
    };

    console.log(viewComment);

    const selectComment = (comment_id) => {
        Axios.post("http://localhost:3001/selectComment", {
            textId: params.text_id,
            commentId: comment_id,
        }).then((response) => {
            console.log(response.data);
            if(response.data.message == "채택된 글이 존재합니다.") {
                alert(response.data.message);
                return false;
            } else {
                alert("댓글 채택이 완료되었습니다.");
            }
        });
    };

    return (
        <React.Fragment>
            <div class="read_qna_box">
                <div class="qna_top_wrap fixed-bar-box-shadow">
                    <div class="board_top_asbtn">
                        <Link to="/">돌아가기</Link>
                    </div>
                    <ul>
                        <li>
                            <div class="tit_box">
                                <div class="tit">
                                    {params.title}
                                </div>
                                <div class="username">
                                    {params.user_name}
                                </div>
                                <div class="reg_date">
                                    {params.reg_date}
                                </div>
                            </div>
                            <span class="contents">
                                {params.content}
                            </span>
                        </li>
                        {
                            viewSelectedComment.length == 0 ?
                            <li>
                                <div class="tit_box">
                                    <div class="tit">
                                        답변 대기중입니다.
                                    </div>
                                    <div class="username">
                                        글쓴이
                                    </div>
                                    <div class="reg_date">
                                        날짜
                                    </div>
                                </div>
                                <span class="contents">
                                    답변 대기중입니다.
                                </span>
                            </li> :
                            viewSelectedComment.map((element, i) => {
                                return <li>
                                <div class="tit_box">
                                    <div class="tit">
                                        답변 완료
                                    </div>
                                    <div class="username">
                                        {element.user_name}
                                    </div>
                                    <div class="reg_date">
                                        {element.reg_date}
                                    </div>
                                </div>
                                <span class="contents">
                                    {element.comment}
                                </span>
                            </li>
                            })
                        }
                    </ul>
                </div>
                <div class="qna_bottom_wrap">
                    <section class="botm1">
                        <textarea class="comment" onChange={(e) => {setCommentReg(e.target.value);}}></textarea>
                        {props.isLogin ? <button onClick={() => writeComment()} class="writeComment">댓글 달기</button> : <a href="javascript:alert('로그인 후 이용가능합니다.')"><button class="writeComment">댓글 달기</button></a>}
                    </section>
                    <section class="botm2">
                        <ul>
                            {
                                viewComment.map((element, i) => {
                                    return <li>
                                        <div class="reply_box" key={i}>
                                            <div class="username" key={i}>
                                                {element.user_name}
                                            </div>
                                            <div class="reg_date" key={i}>
                                                {element.reg_date}
                                            </div>
                                            {props.isLogin && username == params.user_name ? <a onClick={() => checkOwner(element.user_addr, element.comment_id, element.user_name, element.text_id)} class="select" key={i}>채택</a> : null}
                                        </div>
                                        <span class="contents" key={i}>
                                            {element.comment}  
                                        </span>
                                    </li>
                                })
                            }
                        </ul>
                    </section>
                </div>
            </div>   
        </React.Fragment>
    )
}
export default Read;