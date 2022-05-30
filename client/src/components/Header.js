import React, {useEffect, useState} from "react";
import Axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import "./css/header.css";

function Header(props) {
    Axios.defaults.withCredentials = true;
    let username = props.name;

    const {pathname} = useLocation();
    console.log(pathname);
    let visible = true;
    if(pathname === "/Signin" || pathname === "/Signup") visible = false;

    const onLogout = () => {
    	// sessionStorage 에 user_id 로 저장되어있는 아이템을 삭제한다.
        sessionStorage.removeItem('username')
        // App 으로 이동(새로고침)
        window.location.href = '/'
    }
    
    return (
        <React.Fragment>
            <header id="fixed-bar" class="fixed-bar-box-shadow">
                <div id="fixed-bar-wrap">
                    <Link to="/">
                        <div id="fixed-bar-title">Smart Contract for Comment</div>
                    </Link>
                    {visible ? username != "" ? <div><span class="username">{username}</span><button class="logout-button" onClick={onLogout}><span class="button-text">로그아웃</span></button></div> : 
                    <Link to="/Signin" class="login-button"><span class="button-text">로그인</span></Link> 
                    : null}
                </div>
            </header>
        </React.Fragment>
    )
}
export default Header;