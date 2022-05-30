import React, {useState} from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import "./css/signin.css";
import "./css/signup.css";

function Signup() {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [addressReg, setAddressReg] = useState("");

    const register = () => {
        Axios.post("http://localhost:3001/register", {
            username: usernameReg,
            password: passwordReg,
            address: addressReg,
        }).then((response) => {
            console.log(response.data);
            window.location.href='/Signin';
        });
    };

    return (
        <React.Fragment>
            <div class="member_box">
                <div class="member_title">
                    <div class="btit">회원가입</div>
                    <div class="stxt">회원가입을 통해 서비스를 이용해보세요!</div>
                </div>

                
                    <div class="member_form">
                        <ul>
                            <li>
                                <div class="form_title">아이디 <span class="nec">*</span> </div>
                                <input type="text" id="email_id" onChange={(e) => {setUsernameReg(e.target.value);}} placeholder="아이디 입력" />
                            </li>
                            <li>
                                <div class="form_title">비밀번호 <span class="nec">*</span> </div>
                                <input type="password" id="pwd" onChange={(e) => {setPasswordReg(e.target.value);}} placeholder="비밀번호 입력" />
                            </li>
                            <li>
                                <div class="form_title">주소 <span class="nec">*</span> </div>
                                <input type="text" id="address" onChange={(e) => {setAddressReg(e.target.value);}} placeholder="이더리움 주소" />
                            </li>
                            <li><a onClick={register} class="loginBtn" id="">회원가입</a></li>
                        </ul>
                    </div>
                
                <div class="membtBox full">
                    이미 회원이신가요? <a href="javascript:history.back()">뒤로가기</a>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Signup;