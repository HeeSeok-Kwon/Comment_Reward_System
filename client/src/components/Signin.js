import React, {useEffect, useState} from "react";
import Axios from 'axios';
import { Link } from "react-router-dom";
import "./css/signin.css";

function Signin(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginStatus, setloginStatus] = useState("");
    const [checkLogin, setCheckLogin] = useState("");

    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get("http://localhost:3001/login").then((response) => {
            console.log(response);
            if(response.data.loggedIn == true) {
                setloginStatus(response.data.user[0].user_name);   
            }
        })
    }, [])


    const login = () => {
        Axios.post("http://localhost:3001/login", {
            username: username,
            password: password,
        }).then((response) => {
            if(response.data.message) {
                setCheckLogin(response.data.message);
            } else {
                setCheckLogin("로그인 완료!!");
                sessionStorage.setItem('username', username)
                window.location.href="/";
            }
        });
    };
    
    return (
        <React.Fragment>
            <div class="member_box">
                <div class="member_title">
                    <div class="btit">로그인</div>
                    <div class="stxt">스마트 컨트랙트 서비스 이용을 위해 로그인 해주세요.</div>
                </div>
                <form id="login_form">
                    <div class="member_form">
                        <ul>
                            <li>
                                <div class="form_title">아이디</div>
                                <input type="text" id="email_id" onChange={(e) => {setUsername(e.target.value);}} placeholder="아이디 입력" />
                            </li>
                            <li>
                                <div class="form_title">비밀번호</div>
                                <input type="password" id="pwd" onChange={(e) => {setPassword(e.target.value);}} placeholder="비밀번호 입력" />
                            </li>
                            {/* <li class="cred" id="login_error">가입되지 않은 아이디거나, 잘못된 비밀번호입니다.</li> */}
                            <li><a onClick={login} class="loginBtn">로그인</a></li>
                        </ul>
                    </div>
                    <div>{checkLogin}</div>

                    <div class="membtBox">
                        <ul>
                            <li><Link to="/">메인화면 돌아가기</Link></li>
                            <li>첫 방문이면? <Link to="/Signup"><b>회원가입</b></Link></li>
                        </ul>
                    </div>
                </form>
            </div>
        </React.Fragment>
    )
}

export default Signin;