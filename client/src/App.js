/* eslint-disable */

import React, {useEffect, useState} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {Main, Header, Signin, Signup, Write, Read} from "./components";
import './App.css';

function App() {
  
  // 로그인 상태 관리
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
 
  useEffect(() => {
    if(sessionStorage.getItem('username') === null){
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 없다면
      console.log('isLogin ?? :: ', isLogin)
    } else {
    // sessionStorage 에 user_id 라는 key 값으로 저장된 값이 있다면
    // 로그인 상태 변경
      setIsLogin(true);
      setUsername(sessionStorage.getItem('username'));
      console.log('isLogin ?? :: ', isLogin);
    }
  })

  return (
    <BrowserRouter>
      <React.Fragment>
        <Header name={username}/>
          <Routes>
            <Route path="/" element={<Main isLogin={isLogin} />}/> 
            <Route path="/Signin" element={<Signin isLogin={isLogin} />}/>
            <Route path="/Signup" element={<Signup />}/>
            <Route path="/Write" element={<Write name={username} />}/>
            <Route path="/Read/:text_id/:user_id/:user_name/:user_addr/:title/:content/:selecok/:reg_date" element={<Read name={username} isLogin={isLogin} />} />
          </Routes>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;

