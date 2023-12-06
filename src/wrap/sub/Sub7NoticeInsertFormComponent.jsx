import React from 'react';
import Sub7NoticeLeftComponent from './Sub7NoticeLeftComponent.jsx';
import './scss/sub7.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { confirmModal } from '../../reducer/confirmModal.js';

export default function Sub7NoticeInsertFormComponent(){

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [state, setState] = React.useState({
        isSelect: false,
        유형: '',
        작성자: '김민재',
        아이디: 'leekim1065',
        제목: '',
        내용: ''
    });

    const onChangeWType=(e)=>{
        setState({
            ...state,
            유형: e.target.value
        });
    }

    const onChangeSubject=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            제목: e.target.value
        });
    }

    const onChangeContent=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            내용: e.target.value
        });
    }

    // 컨펌모달창 함수
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

    // 공지사항 글쓰기 onSubmit 이벤트
    const onSubmitNoticeForm=(e)=>{
        e.preventDefault();
        if(state.제목===''){
            confirmModalMethod('제목을 입력해주세요!');
        }
        else if(state.내용===''){
            confirmModalMethod('내용을 입력해주세요.');
        }
        else {
            let formData = new FormData();
            formData.append('wType', state.유형);
            formData.append('wName', state.작성자);
            formData.append('wId', state.아이디);
            formData.append('wSubject', state.제목);
            formData.append('wContent', state.내용);
            axios({
                url: 'http://kkoma1221.dothome.co.kr/kurly_project/green_kurly_notice_table_insert.php',
                method: 'POST',
                data: formData
            })
            .then((res)=>{
                if(res.status===200){
                    if(res.data===1){
                        // console.log(res.data);
                        confirmModalMethod('공지사항이 등록되었습니다.');
                        navigate('/sub7');
                    }
                    else if(res.data===0){
                        confirmModalMethod('공지사항 글쓰기 업로드 실패!');
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            })
        }
    }

    return (
        <main id='sub7'>
            <section id='section1'>
                <div className="container">
                    <div className="content">
                        {/* left 박스 */}
                        <Sub7NoticeLeftComponent />
                        <div className="right sub7-insert-form">
                            <div className="right-header">
                                <h2>공지사항 글쓰기</h2>
                            </div>
                            <div className="right-list">
                                {/* 공지사항 글쓰기 입력폼 */}
                                <form action="" autoComplete='off' onSubmit={onSubmitNoticeForm}>
                                    <div className="insert-form">
                                        <ul>
                                            <li>
                                                <div className="gap">
                                                    <label htmlFor="" className='left-label'>유형<i>*</i></label>
                                                    <select name="wType" id="wType" onChange={onChangeWType}>
                                                        <option value="" selected={state.유형.includes('')}>일반</option>
                                                        <option value="공지" selected={state.유형.includes('공지')}>공지</option>
                                                    </select>
                                                    <span className={`icon-arrow-down${state.isSelect?' on':''}`}></span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="gap">
                                                    <span className='left-label'>작성자<i>*</i></span>
                                                    <div className="admin-name">{state.작성자}</div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="gap">
                                                    <span className='left-label'>아이디<i>*</i></span>
                                                    <div className="admin-id">{state.아이디}</div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="gap">
                                                    <label htmlFor="wSubject" className='left-label'>제목<i>*</i></label>
                                                    <input
                                                        type="text"
                                                        name='wSubject'
                                                        id='wSubject'
                                                        placeholder='제목을 입력해주세요'
                                                        value={state.제목}
                                                        onChange={onChangeSubject}
                                                    />
                                                </div>
                                            </li>
                                            <li>
                                                <div className="gap">
                                                    <label htmlFor="wContent" className='left-label'>내용<i>*</i></label>
                                                    <textarea name="wContent" id="wContent" cols="30" rows="10" value={state.내용} onChange={onChangeContent}></textarea>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="button-box">
                                        <button type='submit'>등록</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};