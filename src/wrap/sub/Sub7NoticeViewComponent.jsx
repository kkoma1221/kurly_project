import React from 'react';
import './scss/sub7_view.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { confirmModal } from '../../reducer/confirmModal.js';

export default function Sub7NoticeViewComponent(){

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const selector = useSelector((state)=>state);

    //console.log(location.state);
    //console.log(location.state.유형);
    //console.log(location.state.제목);
    //console.log(location.state.내용);
    //console.log(location.state.작성자);
    //console.log(location.state.작성일);
    //console.log(location.state.아이디);

    const onClickGoList=(e)=>{
        e.preventDefault();
        navigate('/sub7');
    }

    const onClickUpdate=(e)=>{
        e.preventDefault();
        navigate('/sub7Update', {state: location.state});
    }

    const confirmModalMethod=(msg)=>{
        const obj = {
            isConfirmModal: true,
            confirmMsg: msg,
            member: false
        }
        dispatch(confirmModal(obj));
        const htmlEl = document.getElementsByTagName('html')[0];
        htmlEl.classList.add('on');
    }

    const onClickDelete=(e)=>{
        e.preventDefault();
        let formData = new FormData();
        formData.append('idx', location.state.번호);

        axios({
            url: 'http://kkoma1221.dothome.co.kr/kurly_project/green_kurly_notice_table_delete.php',
            method: 'POST',
            data: formData
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data===1){
                    //console.log(res.data);
                    confirmModalMethod('공지사항이 삭제되었습니다.');
                    navigate('/sub7');
                }
                else if(res.data===0){
                    confirmModalMethod('공지사항 삭제 실패!');
                }
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return (
        <div id='sub7View'>
            <section id="section1">
                <div className="container">
                    <div className="title">
                        <h2>공지사항</h2>
                        <h3>컬리의 새로운 소식들과 유용한 정보들을 한곳에서 확인하세요.</h3>
                    </div>
                    <div className="content">
                        <div className="view-box">
                            <ul> {/* 전체박스 */}
                                <li> {/* 제목, 작성자, 작성일 박스 */}
                                    <ul>
                                        <li>
                                            <div className="left">
                                                <strong>제목</strong>
                                            </div>
                                            <div className="right">
                                                <p>{location.state.제목}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="left">
                                                <strong>작성자</strong>
                                            </div>
                                            <div className="right">
                                                <p>{location.state.작성자}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="left">
                                                <strong>작성일</strong>
                                            </div>
                                            <div className="right">
                                                <p>{`${new Date(location.state.작성일).getFullYear()}.${new Date(location.state.작성일).getMonth()+1}.${new Date(location.state.작성일).getDate()}`}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li> {/* 내용박스 */}
                                    <div className="gap">
                                        <div className='contents'>
                                        {
                                            location.state.내용.split('<br />').map((item, idx)=>{
                                                return (
                                                    <p key={idx}>{item}</p>
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="button-box">
                            {
                                selector.signIn.로그인정보!==null && (
                                    selector.signIn.로그인정보.회원등급==='관리자' && (
                                        <>
                                            <button type='button' onClick={onClickDelete}>삭제</button>
                                            <button type='button' onClick={onClickUpdate}>수정</button>
                                        </>
                                    )
                                )
                            }
                            <button type='button' onClick={onClickGoList}>목록</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
