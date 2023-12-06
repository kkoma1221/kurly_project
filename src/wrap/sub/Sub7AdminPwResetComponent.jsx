import React from 'react';
import './scss/sub6_pw_reset.scss';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { confirmModal } from '../../reducer/confirmModal';

export default function Sub7AdminPwResetComponent() {

    const location = useLocation();
    const dispatch = useDispatch();
    // console.log( location.state.아이디 );
    // console.log( location.state.휴대폰 );

    const [state, setState] = React.useState({
        아이디: location.state.아이디,
        휴대폰: location.state.휴대폰,
        새비밀번호1: '', // 입력완료
        새비밀번호2: '', // 입력완료

        pw1GuideText1: null, // 포커스아웃 색상 빨강
        pw1GuideText2: null, // 포커스아웃 색상 빨강
        pw1GuideText3: null, // 포커스아웃 색상 파랑
        pw2GuideText1: null, // 포커스아웃 색상 빨강

        guideTextBox1: false, // 포커스 인 show => true
        guideTextBox2: false,  // 포커스 인 show => true

        submitBtn: true // 위 모든 제한조건에 오류가 없는 경우 > false로 설정, 전송 가능
    });

    // 새비밀번호 등록 : 입력상자 입력 이벤트
    const onChangeNewPw1=(e)=>{
        pw1RegExp(e.target.value);
    }

    // 비밀번호 등록 입력상자 제한조건 함수
    const pw1RegExp=(value)=>{
        let pw1GuideText1 = null;
        let pw1GuideText2 = null;
        let pw1GuideText3 = null;
        const regExp1 = /^(.){10,}$/g;  // 조건 1. 10자 이상
        const regExp2 = /((?=.*[A-Za-z])+(?=.*[0-9])+)|((?=.*[A-Za-z])+(?=.*[`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?])+)|((?=.*[0-9])+(=?.*[`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?])+)/g;
        const regExp3 = /\s/g; // 조건2. 공백제외
        const regExp4 = /[가-힣ㄱ-ㅎㅏ-ㅣ]/g; // 조건2. 한글제외
        const regExp5 = /(\d)\1\1/g; // 조건3. 동일한 숫자 3개 이상 연속 사용 불가

        if(regExp1.test(value)===false){
            pw1GuideText1 = true;
        }
        else{
            pw1GuideText1 = false;
        }

        if(regExp2.test(value)===false || regExp3.test(value)===true || regExp4.test(value)===true){
            pw1GuideText2 = true;
        }
        else {
            pw1GuideText2 = false;
        }

        if(regExp5.test(value)===true){
            pw1GuideText3 = true;
        }
        else{
            pw1GuideText3 = false;
        }

        setState({
            ...state,
            새비밀번호1: value,
            pw1GuideText1: pw1GuideText1,
            pw1GuideText2: pw1GuideText2,
            pw1GuideText3: pw1GuideText3
        });
    }

    // 비밀번호 등록 입력상자 포커스 인(onFocus()) 이벤트
    const onFocusNewPw1=()=>{
        setState({
            ...state,
            guideTextBox1: true,

        });
    }
    // 비밀번호 등록 입력상자 포커스 아웃(블러 onBlur()) 이벤트
    const onBlurNewPw1=()=>{
        pw1RegExp(state.새비밀번호1);
    }

    // 비밀번호 확인 입력상자 제한조건 함수
    const pw2Function=(value)=>{
        let pw2GuideText1 = null;
        if(value!==state.새비밀번호1 || value===''){
            pw2GuideText1 = true;
        }
        else {
            pw2GuideText1 = false;
        }
        setState({
            ...state,
            새비밀번호2: value,
            pw2GuideText1: pw2GuideText1
        });
    }

    const onChangeNewPw2=(e)=>{
        pw2Function(e.target.value);
    }

    // 비밀번호 확인 입력상자 포커스 인(onFocus()) 이벤트
    const onFocusNewPw2=()=>{
        setState({
            ...state,
            guideTextBox2: true
        });
    }
    // 비밀번호 확인 입력상자 포커스 아웃(블러 onBlur()) 이벤트
    const onBlurNewPw2=()=>{
        pw2Function(state.새비밀번호2);
    }

    // 새비밀번호1 값이 변경되면 
    React.useEffect(()=>{
        pw2Function(state.새비밀번호2);
        return;
    },[state.새비밀번호1]);


    // 확인버튼 활성화 시키기
    React.useEffect(()=>{
        if(state.pw2GuideText1===false){
            setState({
                ...state,
                submitBtn: false
            });
        }
        else {
            setState({
                ...state,
                submitBtn: true
            });
        }
        return;
    },[state.pw2GuideText1]);

    const confirmModalMethod=(msg)=>{
        const obj = {
            isConfirmModal: true,
            confirmMsg : msg,
            member: false
        }
        dispatch(confirmModal(obj));
        const htmlEl = document.getElementsByTagName('html')[0];
        htmlEl.classList.add('on');
    }

    // 전송
    const onSubmitPwReset=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('adminId', state.아이디);
        formData.append('adminHp', state.휴대폰);
        formData.append('adminPw', state.새비밀번호1);
        axios({
            url: 'http://kkoma1221.dothome.co.kr/kurly_project/green_kurly_admin_pw_update.php',
            method: 'POST',
            data: formData
        })
        .then((res)=>{
            // console.log('AXIOS 전송 성공!');
            // console.log(res.data);
            if(res.data===1){
                confirmModalMethod('비밀번호(admin) 변경이 완료되었습니다.');
            }
            else {
                confirmModalMethod('다시 확인하고 시도해주세요.'); 
            }

        })
        .catch((err)=>{
            console.log('AXIOS 전송 실패!');
            console.log(err);
        })
    }

    // 새비밀번호 등록 / 확인 : 입력상자 글자 삭제
    const onClickDeletePwBtn=(e, el)=>{
        e.preventDefault();
        if(el==='pw1'){
            setState({
                ...state,
                새비밀번호1: ''
            });
        }
        else if(el==='pw2'){
            setState({
                ...state,
                새비밀번호2: ''
            });
        }
    }

    const title1 = {
        fontSize: '28px',
        color: '#5f0080',
        fontWeight: '600',
        textAlign: 'center'
    }

    const title2 = {
        fontSize: '20px',
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
        padding: "0 0 50px 0"
    }

    const mainBg = {
        backgroundColor: '#fcfcfc'
    }

    return (
        <main id='pw-reset-form' className='pw-reset-form' style={mainBg}>
            <section id='section1'>
                <div className="container">
                    <div className="title">
                        <h2 className='title-text' style={title1}>MYADMIN</h2>
                        <h3 className='title-text' style={title2}>비밀번호 재설정</h3>
                    </div>
                    <div className="content sub6-content">
                        <form onSubmit={onSubmitPwReset} action="" autoComplete='off'>
                            <ul>
                                <li>
                                    <div className="gap">
                                        <label htmlFor="adminPw1">새 비밀번호 등록</label>
                                        <input 
                                            type="password"
                                            name='adminPw1'
                                            id='adminPw1'
                                            placeholder='새 비밀번호를 입력해 주세요'
                                            value={state.새비밀번호1}
                                            maxLength={16}
                                            onChange={onChangeNewPw1}
                                            onFocus={onFocusNewPw1}
                                            onBlur={onBlurNewPw1} /* focus out */
                                        />
                                        {
                                            state.새비밀번호1!=='' && (
                                                <button className='delete-btn' onClick={(e)=>onClickDeletePwBtn(e, 'pw1')}><img src="./images/sub/icon_delete.svg" alt="" /></button>
                                            )
                                        }
                                    </div>
                                    {
                                        state.guideTextBox1 && (
                                            <div className='guide-text-box'>
                                                <p className={state.pw1GuideText1===null?'':(state.pw1GuideText1?'red':'blue')}>10자 이상 입력</p>
                                                <p className={state.pw1GuideText2===null?'':state.pw1GuideText2?'red':'blue'}>영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합</p>
                                                <p className={state.pw1GuideText3===null?'':(state.pw1GuideText3?'red':'blue')}>동일한 숫자 3개 이상 연속 사용 불가</p>
                                            </div>
                                        )
                                    }
                                </li>
                                <li>
                                    <div className="gap">
                                        <label htmlFor="adminPw2">새 비밀번호 확인</label>
                                        <input
                                            type="password"
                                            name='adminPw2'
                                            id='adminPw2'
                                            placeholder='새 비밀번호를 한 번 더 입력해 주세요.'
                                            value={state.새비밀번호2}
                                            onChange={onChangeNewPw2}
                                            onFocus={onFocusNewPw2}
                                            onBlur={onBlurNewPw2}
                                            maxLength={16}
                                        />
                                        {
                                            state.새비밀번호2!=='' && (
                                                <button className='delete-btn' onClick={(e)=>onClickDeletePwBtn(e, 'pw2')}><img src="./images/sub/icon_delete.svg" alt="" /></button>
                                            )
                                        }
                                    </div>
                                    {
                                        state.guideTextBox2 && (
                                            <div className="guide-text-box">
                                                <p className={state.pw2GuideText1===null?'':(state.pw2GuideText1?'red':'blue')}>동일한 비밀번호를 입력해 주세요.</p>
                                            </div>
                                        )
                                    }
                                </li>
                                <li>
                                    <div className="gap">
                                        <input
                                            type="submit"
                                            name='submitBtn'
                                            id='submitBtn'
                                            value={'확인'}
                                            className={state.submitBtn===true?'':'on'}
                                            disabled={state.submitBtn}
                                        />
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
