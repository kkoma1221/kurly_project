import React from 'react';
import './scss/sub.scss';
import './scss/sub6.scss';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../../reducer/signIn';
import { address } from '../../reducer/address';

export default function Sub6LoginComponent() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selector = useSelector((state)=>state);

    const [state, setState] = React.useState({
        아이디: '',
        비밀번호: '',
    });

    const onChangeId=(e)=>{
        setState({
            ...state,
            아이디: e.target.value
        });
    }

    const onChangePw=(e)=>{
        setState({
            ...state,
            비밀번호: e.target.value
        });
    }

    const onClickIdSearch=(e)=>{
        e.preventDefault();
        navigate('/sub6IdSearch');
    }

    const onClickPwSearch=(e)=>{
        e.preventDefault();
        navigate('/sub6PwSearch');
    }

    const onClickGoSignup=(e)=>{
        e.preventDefault();
        navigate('/sub5');
    }

    const onSubmitLoginBtn=(e)=>{
        e.preventDefault();
        let formData = new FormData();
        formData.append('userId', state.아이디);
        formData.append('userPw', state.비밀번호);
        axios({
            url: 'http://kkoma1221.dothome.co.kr/kurly_project/kurly_signin.php',
            method: 'POST',
            data: formData
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data!==''){
                    // console.log(res.data);
                    // 로그인 시작
                    // 3일간 로그인 유지하기
                    let toDay = new Date(); // 현재날짜, 시간
                    // toDay.setDate(현재날짜 + 3);
                    toDay.setDate(toDay.getDate() + 3);
                    // 상태관리 저장
                    // 이름, 아이디, 휴대폰, 주소, 만료일
                    const 로그인정보 = {
                        회원등급: '일반',
                        아이디: res.data.아이디,
                        이름: res.data.이름,
                        휴대폰: res.data.휴대폰,
                        주소: res.data.주소,
                        만료일: toDay.getTime() // 1/1000 초단위로 저장
                    }

                    // 만료일까지 영구히 보관
                    localStorage.setItem('KURLY_SIGNIN_INFORMATION', JSON.stringify(로그인정보)); // JSON 객체를 문자열로 변환해서 저장
                    dispatch(signIn(로그인정보));
                    dispatch(address(res.data.주소));
                    // console.log(dispatch(signIn(로그인정보)));
                    navigate('/index');
                }
                else {
                    alert('아이디, 비밀번호를 확인하세요.');
                }
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return (
        <main id='sub6' className='sub'>
            <section id='section1'>
                <div className="container">
                    <div className="title">
                        <h2 className='title-text' >로그인</h2>
                    </div>
                    <div className="content sub6-content">
                        <form action="" onSubmit={onSubmitLoginBtn} autoComplete='off'>
                            <ul>
                                <li>
                                    <div className="gap">
                                        <input
                                            type="text"
                                            name='userId'
                                            id='userId'
                                            placeholder='아이디를 입력해주세요'
                                            value={state.아이디}
                                            onChange={onChangeId}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className="gap">
                                        <input
                                            type="password"
                                            name='userPw'
                                            id='userPw'
                                            placeholder='비밀번호를 입력해주세요'
                                            value={state.비밀번호}
                                            onChange={onChangePw}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className="gap">
                                        <span>
                                            <a href="!#" onClick={onClickIdSearch}>아이디 찾기</a>
                                            <i>|</i>
                                            <a href="!#" onClick={onClickPwSearch}>비밀번호 찾기</a>
                                        </span>
                                    </div>
                                </li>
                                <li>
                                    <div className="gap">
                                        <input
                                            type="submit"
                                            name='submitBtn'
                                            id='submitBtn'
                                            value={'로그인'}
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className="gap">
                                        <input type="button" onClick={onClickGoSignup} name='signupBtn' id='signupBtn' value={'회원가입'} />
                                    </div>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
};
