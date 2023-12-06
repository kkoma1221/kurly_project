import React from 'react';
import './scss/sub7_myadmin.scss';
import './scss/sub6.scss';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../../reducer/signIn';

export default function Sub7AdminSigninComponent() {

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
        navigate('/sub7AdminIdSearch');
    }

    const onClickPwSearch=(e)=>{
        e.preventDefault();
        navigate('/sub7AdminPwSearch');
    }

    // 관리자 회원가입폼으로 이동
    const onClickGoSignup=(e)=>{
        e.preventDefault();
        navigate('/sub7AdminSignup'); 
    }

    const onSubmitLoginBtn=(e)=>{
        e.preventDefault();
        let formData = new FormData();
        formData.append('adminId', state.아이디);
        formData.append('adminPw', state.비밀번호);
        axios({
            url: 'http://kkoma1221.dothome.co.kr/kurly_project/green_kurly_admin_signin.php',
            method: 'POST',
            data: formData
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data!==''){
                    // 로그인 시작, 3일간 저장
                    let toDay = new Date();
                    toDay.setDate(toDay.getDate() + 3);
                    const 로그인정보 = {
                        회원등급: '관리자',
                        아이디: res.data.아이디,
                        이름: res.data.이름,
                        휴대폰: res.data.휴대폰,
                        주소: res.data.주소
                    }

                    // 만료일까지 영구히 보관
                    localStorage.setItem('KURLY_SIGNIN_INFORMATION', JSON.stringify(로그인정보)); // JSON 객체를 문자열로 변환해서 저장
                    dispatch(signIn(로그인정보));
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
        <main id='sub6' className='sub7-myadmin'>
            <section id='section1'>
                <div className="container">
                    <div className="title">
                        <h2 className='title-text'>MyAdmin</h2>
                        <h3 className='title-text'>로그인</h3>
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
                                            style={{background:'#fcfcfc'}}
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
                                            style={{background:'#fcfcfc'}}
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
