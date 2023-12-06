import React from 'react';
import './scss/sub.scss';
import './scss/sub6_id_pw_search.scss';
import { useDispatch, useSelector } from 'react-redux';
import { confirmModal } from '../../reducer/confirmModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Sub6LogInIdSearchComponent(){

    const dispatch = useDispatch();
    const selector = useSelector((state)=>state);
    const navigate = useNavigate();

    const [state, setState] = React.useState({
        isHp: true,
        isEmail: false,
        휴대폰: '',
        발급된인증번호: null,
        입력인증번호: '',
        이름: '',
        이메일: '',
        아이디: '',
        가입일: '',
        isOff: true,
        isOff2: false,
        isGuideTextName: false,
        isGuideTextHp: false,
        isGuideTextEmail: false,
        isHpAuthenNumberBox: false, // 휴대폰 인증번호 박스
        isEmailAuthenNumberBox: false, // 이메일 인증번호 박스
    });

    const onChangeName=(e)=>{
        let isGuideTextName = false;
        if(e.target.value===''){
            isGuideTextName = true;
        }
        else {
            isGuideTextName = false;
        }
        setState({
            ...state,
            이름: e.target.value,
            isGuideTextName: isGuideTextName
        });
    }

    const onChangeHp=(e)=>{
        const regExp1 = /^01[0-9]+[0-9]{3,4}[0-9]{4}$/g;
        const regExp2 = /[^\d]/g;
        let 휴대폰 = '';
        let isGuideTextHp = false;
        휴대폰 = e.target.value.replace(regExp2, '');

        if(e.target.value==='' || regExp1.test(휴대폰)===false){
            isGuideTextHp = true;
        }
        else {
            isGuideTextHp = false;
        }
        setState({
            ...state,
            휴대폰: 휴대폰,
            isGuideTextHp: isGuideTextHp
        });
    }

    const onChangeEmail=(e)=>{
        let isGuideTextEmail = false;
        const regExp = /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ`~!#$%^&*\-_=+{}|'?]+((\.)?[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ`~!#$%^&*\-_=+{}|'?]+)*@[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-_.]+((\.)?[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ.\-_]+)*\.[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-_]+$/g;
        if(e.target.value==='' || regExp.test(e.target.value)===false){
            isGuideTextEmail = true;
        }
        else {
            isGuideTextEmail = false;
        }
        setState({
            ...state,
            이메일: e.target.value,
            isGuideTextEmail: isGuideTextEmail
        });
    }

    // 핸드폰 인증번호 입력창 
    const onChangeHpAuthen=(e)=>{
        setState({
            ...state,
            입력인증번호: e.target.value
        });
    }

    const onClickDeleteNameBtn=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            이름: ''
        });
    }

    const onClickDeleteHpBtn=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            휴대폰: ''
        });
    }

    const onClickDeleteEmailBtn=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            이메일: ''
        });
    }

    const onClickTabBtn=(e, p)=>{
        e.preventDefault();
        let isHp = false;
        let isEmail = false;
        if(p==='휴대폰인증'){
            isHp = true;
            isEmail = false;
        }
        else if(p==='이메일인증'){
            isHp = false;
            isEmail = true;
        }
        setState({
            ...state,
            isHp: isHp,
            isEmail: isEmail
        });
    }

    // 리덕스 디스패쳐 컨펌모달메서드 생성하기
    const confirmModalMethod=(msg)=>{
        const value = {
            isConfirmModal: true,
            confirmMsg: msg,
            member: false
        }
        dispatch(confirmModal(value));
        const htmlEl = document.getElementsByTagName('html')[0]; 
        htmlEl.classList.add('on');
    }

    // 3분 카운트 상태변수 - 1초에 한번씩 값이 바껴서 저장되므로, state 상태변수에 같이 변수 생성하면 그 안의 true/false 값을 가지고 있는 변수들에 영향을 미침 => 따로 설정
    const [count, setCount] = React.useState({
        M: 3,
        S: 0,
        setId: 0
    });

    // 3분 카운트다운 함수
    const timer3MinutesCount=()=>{
        let countTime = 3; // 3분 minutes
        let M = 0; // 분
        let S = 0; // 초
        let now = new Date(); // 현재지금날짜시간
        let endTime = now.setMinutes( now.getMinutes() + countTime );
        let setId = 0;
        // 1초에 한번씩 현재 날짜시간을 가져와서 endTime과 비교 연산 endTime - 현재시간
        setId = setInterval(()=>{
            now = new Date();
            const result = endTime - now; // 1970년 1월 1일부터 오늘까지 1/1000초 단위 시간
            // console.log(result); // 타임스트링
            // console.log(Math.floor(result/(60*1000)%countTime)); // 타임스트링 남은 분(Minutes)
            // console.log(Math.floor(result/(1000)%60)); // 타임스트링 남은 초(Seconds)
            // console.log(new Date(result));

            if( now >= endTime){
                clearInterval(setId);
                // clearInterval(타이머메모리변수);
                M = 0;
                S = 0;
            }
            else {
                M = Math.floor(result/(60*1000)%countTime);
                S = Math.floor(result/(1000)%60);
            }
            setCount({
                ...count,
                M: M<10?`0${M}`:M,
                S: S<10?`0${S}`:S,
                setId: setId
            });

        },1000);
    }

    // 휴대폰인증 폼전송 이벤트 > 인증번호 발급(7자리)
    const onSubmitHpAuthen=(e)=>{
        e.preventDefault();
        let formData = new FormData();
        const regExp = /^(\d{3})([0-9]{3,4})([0-9]{4})$/g;
        formData.append('userName', state.이름);
        formData.append('userHp', state.휴대폰.replace(regExp, '$1-$2-$3'));
        axios({
            url: 'http://kkoma1221.dothome.co.kr/kurly_project/kurly_id_search_name_hp_select.php',
            method: 'POST',
            data: formData
        }).then((res)=>{
            //console.log('AXOIS 성공!');
            //console.log(res.data);
            if(res.data === ''){
                confirmModalMethod('가입 시 입력하신 회원 정보가 맞는지 다시 한번 확인해 주세요.');
            }
            else {
                // 가입된 회원만 인증번호 발송
                const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/g;
                let num = 0;
                num = Math.floor(Math.random()*9000000 + 1000000); // 7자리 휴대폰 인증번호
                if(regExp.test(state.휴대폰)===false){
                    confirmModalMethod('잘못된 휴대폰 번호 입니다. 확인 후 다시 시도해 주세요');
                }
                else {
                    // 타이머 동작 시작
                    // 3분 카운트: 분 초
                    confirmModalMethod(`${num}\n인증번호가 발송되었습니다. 3분 안에 인증번호를 입력해 주세요.\n카카오톡이 설치된 경우 카카오 알림톡으로 발송됩니다.`);
                    clearInterval(count.setId); // 메모리 학당된 인덱스 번호를(랜덤하게 바뀜) 제거한 후 > 타이머함수 실행해야 타이머가 중복해서 실행되지 않음
                    timer3MinutesCount();
                }
                setState({
                    ...state,
                    isHpAuthenNumberBox: true,
                    발급된인증번호: num,
                    아이디: res.data.아이디,
                    가입일: res.data.가입일
                });
            }
        }).catch((err)=>{
            console.log('AXOIS 실패!');
            console.log(err);
        })
    }

    // 확인 버튼 클릭 이벤트 > 인증번호 확인 후 navigate
    const onClickOkBtn=(e)=>{
        e.preventDefault();
        if(Number(state.입력인증번호)===state.발급된인증번호){
            navigate('/sub6IdPwSearchResult', {
                state: {
                    아이디: state.아이디,
                    가입일: state.가입일
                }
            });
        }
        else {
            confirmModalMethod('인증번호를 확인하세요!');
        }
    }

    // 이메일인증 폼전송 이벤트
    const onSubmitEmailAuthen=(e)=>{
        e.preventDefault();
    }

    // 이름, 휴대폰 입력이 완료되면 동작 이벤트
    React.useEffect(()=>{
        const regExp1 = /^01[0-9]+[0-9]{3,4}[0-9]{4}$/g;
        let isOff = true;
        if(regExp1.test(state.휴대폰)===true && state.이름!==''){
            isOff = false;
        }
        else {
            isOff = true;
        }
        setState({
            ...state,
            isOff: isOff
        });

        return;
    },[state.이름, state.휴대폰]);

    // 이름, 이메일이 완료되면 동작 이벤트
    React.useEffect(()=>{
        let isOff2 = false;
        const regExp = /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ`~!#$%^&*\-_=+{}|'?]+((\.)?[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ`~!#$%^&*\-_=+{}|'?]+)*@[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-_.]+((\.)?[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ.\-_]+)*\.[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-_]+$/g;
        if(regExp.test(state.이메일)===true && state.이름!==''){
            isOff2 = true;
        }
        else {
            isOff2 = false;
        }
        setState({
            ...state,
            isOff2: isOff2
        });

        return;
    },[state.이름, state.이메일]);

    return (
        <div id='sub6IdSearch' className='id-pw-search'>
            <section id="section1">
                <div className="container">
                    <div className="title">
                        <h2 className='title-text'>아이디 찾기</h2>
                    </div>
                    <div className="content sub6-content">
                        <div className="tab-button-box">
                            <button onClick={(e)=>onClickTabBtn(e, '휴대폰인증')} className={state.isHp?'on':''}>휴대폰 인증</button>
                            <button onClick={(e)=>onClickTabBtn(e, '이메일인증')} className={state.isEmail?'on':''}>이메일 인증</button>
                        </div>
                        {
                            state.isHp && (
                                <form onSubmit={onSubmitHpAuthen} id='hpAuthen' autoComplete='off'>
                                    <ul>
                                        <li>
                                            <div className="gap">
                                                <label htmlFor="userName">이름</label>
                                                <input 
                                                    type="text"
                                                    name="userName"
                                                    id="userName"
                                                    placeholder='이름을 입력해주세요'
                                                    onChange={onChangeName}
                                                    value={state.이름}
                                                />
                                                {
                                                    state.이름 !== '' && (
                                                        <button className='delete-btn' onClick={onClickDeleteNameBtn}><img src="./images/sub/icon_delete.svg" alt="" /></button>
                                                    )
                                                }
                                            </div>
                                            <p className={`guide-text${state.isGuideTextName?' on':''}`}>가입 시 등록한 이름을 입력해주세요.</p>
                                        </li>
                                        <li>
                                            <div className="gap">
                                                <label htmlFor="userHp">휴대폰 번호</label>
                                                <input
                                                    type="text"
                                                    name='userHp'
                                                    id='userHp'
                                                    placeholder='휴대폰 번호를 입력해주세요'
                                                    onChange={onChangeHp}
                                                    value={state.휴대폰}
                                                    maxLength={11}
                                                />
                                                {
                                                    state.휴대폰 !=='' && (
                                                        <button className='delete-btn' onClick={onClickDeleteHpBtn}><img src="./images/sub/icon_delete.svg" alt="" /></button>
                                                    )
                                                }
                                            </div>
                                            <p className={`guide-text${state.isGuideTextHp?' on':''}`}>가입 시 등록한 휴대폰 번호를 입력해주세요.</p>
                                        </li>
                                        {
                                            state.isHpAuthenNumberBox && (
                                                <>
                                                    <li>
                                                        <div className="gap authen-number">
                                                            <label htmlFor="hpAuthen">인증번호</label>
                                                            <div className="box">
                                                                <input
                                                                    type="text"
                                                                    name='hpAuthen'
                                                                    id='hpAuthen'
                                                                    placeholder='인증번호 7자리'
                                                                    onChange={onChangeHpAuthen}
                                                                    value={state.입력인증번호}
                                                                    maxLength={7}
                                                                />
                                                                <button onClick={onSubmitHpAuthen}>재발송</button>
                                                            </div>
                                                            <span className='time-box'><em>{count.M}</em><em> : </em><em>{count.S}</em></span>
                                                        </div>
                                                        <p className={`guide-text${state.isGuideTextHp?' on':''}`}>인증번호를 입력해 주세요</p>
                                                    </li>
                                                    <li>
                                                        <div className="gap">
                                                            <input 
                                                                type="button"
                                                                name='okBtn'
                                                                id='okBtn'
                                                                onClick={onClickOkBtn}
                                                                value={'확인'} />
                                                        </div>
                                                    </li>
                                                </>
                                            )
                                        }
                                        {
                                            state.발급된인증번호 === null && (
                                                <li>
                                                    <div className="gap">
                                                        <input 
                                                            type="submit"
                                                            className={state.isOff?'off':''}
                                                            disabled={state.isOff}
                                                            name='submitBtn'
                                                            id='submitBtn'
                                                            value={'인증번호받기'} />
                                                    </div>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </form>
                            )
                        }
                        {
                            state.isEmail && (
                                <form onSubmit={onSubmitEmailAuthen} id='emailAuthen' autoComplete='off'>
                                    <ul>
                                        <li>
                                            <div className="gap">
                                                <label htmlFor="userName">이름</label>
                                                <input
                                                    type="text"
                                                    name='userName'
                                                    id='userName'
                                                    placeholder='이름을 입력해주세요'
                                                    value={state.이름}
                                                    onChange={onChangeName}
                                                />
                                                {
                                                    state.이름 !=='' && (
                                                        <button className='delete-btn' onClick={onClickDeleteNameBtn}><img src="./images/sub/icon_delete.svg" alt="" /></button>
                                                    )
                                                }
                                            </div>
                                            <p className={`guide-text${state.isGuideTextName?' on':''}`}>가입 시 등록한 이름을 입력해주세요.</p>
                                        </li>
                                        <li>
                                            <div className="gap">
                                                <label htmlFor="userEmail">이메일</label>
                                                <input 
                                                    type="text"
                                                    name='userEmail'
                                                    id='userEmail'
                                                    placeholder='이메일을 입력해주세요'
                                                    value={state.이메일}
                                                    onChange={onChangeEmail}
                                                />
                                                {
                                                    state.이메일 !== '' && (
                                                        <button className='delete-btn' onClick={onClickDeleteEmailBtn}><img src="./images/sub/icon_delete.svg" alt="" /></button>
                                                    )
                                                }
                                            </div>
                                            <p className={`guide-text${state.isGuideTextEmail?' on':''}`}>가입 시 등록한 이메일을 입력해주세요.</p>
                                        </li>
                                        <li>
                                            <div className="gap">
                                                <input
                                                    type="submit"
                                                    className={state.isOff2?'':'off'}
                                                    disabled={!state.isOff2}
                                                    name='submitBtn'
                                                    id='submitBtn'
                                                    value={'확인'}
                                                />
                                            </div>
                                        </li>
                                    </ul>
                                </form>
                            )
                        }
                    </div>
                </div>
            </section>
        </div>
    );
};