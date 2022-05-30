import React, {useEffect, useState} from "react";
import Axios from 'axios';
import "./css/main.css";
import { Link } from "react-router-dom";

function Main(props) {
    const [viewContent, setViewContent] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:3001/getTexts").then((response) => {
            console.log(response.data);
            setViewContent(response.data);
        })
    }, [])
    
    return (
        <React.Fragment>
            <div class="qna_box">
                <div class="qna_top_wrap fixed-bar-box-shadow">
                    <div class="qna_title">
                        작성된 글 목록
                    </div>
                    <div class="board_top_asbtn">
                        {props.isLogin ? <Link to='/Write'>글쓰기</Link> : <a href="javascript:alert('로그인 후 이용가능합니다.')">글쓰기</a>}
                    </div>
                </div>
                <div class="qna_bottom_wrap">
                    <ul>
                        {
                            viewContent.map((element, i) => {
                                return <li>
                                <Link to={`Read/${element.text_id}/${element.user_id}/${element.user_name}/${element.user_addr}/${element.title}/${element.content}/${element.selectOK}/${element.reg_date}`}>
                                    <span class="tit" key={i}>
                                        {element.title}
                                    </span>
                                    <span class="contents" key={i}>
                                        {element.content}
                                    </span>
                                </Link>
                            </li>
                            })
                        }
                        {/* <li>
                            <a href="#">
                                <span class="tit">
                                    제목이 들어갑니다.
                                </span>
                                <span class="contents">
                                    내용이 들어갑니다.
                                </span>
                            </a>
                        </li> */}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Main;