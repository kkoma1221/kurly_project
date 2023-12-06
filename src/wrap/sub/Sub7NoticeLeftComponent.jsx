import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sub7NoticeLeftComponent() {
    
    const navigate = useNavigate();

    const onClickNotice=(e)=>{
        e.preventDefault();
        navigate('/sub7');
    }

    return (
        <div className="left">
            <div className="left-header">
                <h2>고객센터</h2>
            </div>
            <div className="left-list">
                <ul>
                    <li><a href="!#" onClick={onClickNotice}>공지사항</a></li>
                    <li><a href="!#">자주하는 질문</a></li>
                    <li><a href="!#">1:1 문의</a></li>
                    <li><a href="!#">대량주문 문의</a></li>
                </ul>
                <div className="help-me">
                    <p>
                        <a href="!#">
                            <strong>도움이 필요하신가요 ?</strong>
                            <span>1:1 문의하기</span>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
