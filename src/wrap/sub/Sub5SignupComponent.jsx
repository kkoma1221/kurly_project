import React from 'react';
import './scss/sub5.scss';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { isAddress } from '../../reducer/isAddress';
import { confirmModal } from '../../reducer/confirmModal';
import { confirmService1Modal } from '../../reducer/confirmService1Modal';
import { confirmService2Modal } from '../../reducer/confirmService2Modal';
import { confirmService3Modal } from '../../reducer/confirmService3Modal';

export default function Sub5SignupComponent() {

    // 네비게이트 선언
    const navigate = useNavigate();

    const dispatch = useDispatch(); // 디스패치 선언
    const selector = useSelector((state)=>state); // 리덕스 상태관리 변수에서 주소 가져오기

    // onChange 이벤트 => 자신의 이벤트 구현
    // 상태변수 값 변경되면 => onChange 이벤트 => 자신의 이벤트 구현

    const [state, setState] = React.useState({
        아이디: '',
        idGuideText: '',
        아이디중복확인: false,

        비밀번호: '',
        pw1GuideText: '',

        비밀번호확인: '',
        pw2GuideText: '',

        이름: '',
        nameGuideText: '',

        이메일: '',
        이메일중복확인: false,
        emailGuideText: '',

        휴대폰: '',
        발급된인증번호: null,
        입력된인증번호: '', // 인증번호 받아서 키보드로 입력상자에 입력한 값,
        휴대폰인증: false,
        isHpNum: false,
        isHpNum2: false,
        isHpNum3: true, 

        주소1: '',  // 검색주소 
        주소2: '',  // 상세주소
        isAddress: false,

        성별: '선택안함', // 라디오버튼 이벤트 : 단일 항목

        생년: '',
        생월: '',
        생일: '',
        birthGuideText: '',

        isUserChoogaId: false, // 추가입력사항 추천인아이디
        isUserChoogaEvent: false, // 추가입력사항 참여이벤트명
        추가입력사항: '',
        추천인아이디: '',
        참여이벤트명: '',
        추천인아이디확인: false,

        이용약관: [
            '이용약관 동의(필수)',
            '개인정보 수집∙이용 동의(필수)',
            '개인정보 수집∙이용 동의(선택)',
            '무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)',
            'SMS',
            '이메일',
            '본인은 만 14세 이상입니다.(필수)'
        ],
        이용약관동의: [], // 체크박스 이벤트 : 여러항목 선택가능, 다중선택
        전체동의: '',
        회원가입완료: false
    });

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

    // 입력상자 키 입력
    // 1-1. 아이디
    const onChangeId=(e)=>{
        const {value} = e.target // 비구조화 e.target.value 
        let 아이디 = '' // 아이디 임시변수
        let idGuideText = '';
        const regExp1 = /[`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]/g; // 정규표현식 - 특수 문자 입력과 동시에 삭제 \- \] \\ 문자처리
        const regExp2 = /(?=.*[A-Za-z])+(?=.*[0~9])*/g; // 영문 필수+ 숫자 선택* 
        const regExp3 = /[가-힣ㄱ-ㅎㅏ-ㅣ]/g; //한글
        const regExp4 = /\s/g; // 공백 \s
        const regExp5 = /^(.){6,16}$/g; 

        아이디 = value.replace(regExp1, '');
        if(regExp2.test(value)===false || regExp3.test(value)===true || regExp4.test(value)===true || regExp5.test(value)===false){
            // console.log('영문필수, 숫자선택, 한글, 공백포함 오류'); // - 확인 체크
            idGuideText = '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
        }
        else {
            // console.log('영문필수, 숫자선택 정상')
            idGuideText = '';
        }
        setState({
            ...state,
            아이디: 아이디,
            idGuideText: idGuideText
        });
    }

    // 1-2. 아이디 중복확인 버튼 클릭 이벤트
    const onClickIdBtn=(e)=>{
        e.preventDefault();
        let value = state.아이디;
        let idGuideText = '';
        let 아이디중복확인 = false;
        const regExp1 = /[`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]/g; 
        const regExp2 = /(?=.*[A-Za-z])+(?=.*[0~9])*/g;
        const regExp3 = /[가-힣ㄱ-ㅎㅏ-ㅣ]/g; 
        const regExp4 = /\s/g;
        const regExp5 = /^(.){6,16}$/g; 

        if(regExp2.test(value)===false || regExp3.test(value)===true || regExp4.test(value)===true || regExp5.test(value)===false){
            idGuideText = '6자 이상 16자 이하의 영문 혹은 영문과 숫자를 조합';
            아이디중복확인 = false;
            confirmModalMethod(idGuideText);
            setState({
                ...state,
                아이디중복확인: 아이디중복확인
            });
        }
        else {
            // AXIOS API 구현
            const formData = new FormData();
            formData.append('userId', state.아이디);
            axios({
                url: 'http://kkoma1221.dothome.co.kr/kurly_project/kurly_id_duplicate_check.php',
                method: 'POST',
                data: formData
            })
            .then((res)=>{
                if(res.status===200){
                    if(res.data===0){
                        아이디중복확인 = true;
                        idGuideText = '사용 할 수 있는 아이디 입니다';
                    }
                    else if(res.data===1){
                        아이디중복확인 = false;
                        idGuideText = '사용불가능한 아이디 입니다';
                    }
                    confirmModalMethod(idGuideText);
                    setState({ // AXIOS는 비동기식이라 반응이 느려서 맨 밑에 쓰면 먼저 상태변수에 값이저장되고 then문이 실행됨 => 바로 저장할 수 있도록 안에서 저장
                        ...state,
                        아이디중복확인: 아이디중복확인
                    });
                }
            })
            .catch((err)=>{
                console.log('AXIOS 오류')
                console.log(err);
            })
        }
    }

    //2. 비밀번호
    const onChangePw=(e)=>{
        let pw1GuideText = '';
        const {value} = e.target;
        const regExp1 = /^(.){10,16}$/g;
        const regExp2 = /((?=.*[A-Za-z])+(?=.*[0-9])+)|((?=.*[A-Za-z])+(?=.*[`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?])+)|((?=.*[0-9])+(=?.*[`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?])+)/g;
        const regExp3 = /\s/g;
        const regExp4 = /[가-힣ㄱ-ㅎㅏ-ㅣ]/g;
        const regExp5 = /(\d)\1\1/g; // 숫자3자연속 // const regExp5 = /(.)\1\1/g; // 모든문자숫자3자연속

        if(regExp1.test(value)===false){
            pw1GuideText = '최소 10자 이상 입력';
        }
        else if(regExp2.test(value)===false || regExp3.test(value)===true || regExp4.test(value)===true){
            pw1GuideText = '영문/숫자/특수문자(공백 제외)만 허용하며, 2개 이상 조합';
        }
        else if(regExp5.test(value)===true){
            pw1GuideText = "동일한 숫자 3개 이상 연속 사용 불가";
        }
        else{
            pw1GuideText = '';
        }
        setState({
            ...state,
            비밀번호: value,
            pw1GuideText: pw1GuideText
        });
    }
    
    // 3. 비밀번호확인
    const onChangePw2=(e)=>{
        let pw2GuideText = '';
        const {value} = e.target;
        if(value===''){
            pw2GuideText = '비밀번호를 한번 더 입력해 주세요.';
        }
        else if(value!==state.비밀번호){
            pw2GuideText = '동일한 비밀번호를 입력';
        }
        else{
            pw2GuideText = '';
        }
        setState({
            ...state,
            비밀번호확인: value,
            pw2GuideText: pw2GuideText
        });
    }

    // 4. 이름
    const onChangeName=(e)=>{
        let nameGuideText = '';
        let 이름 = '';
        let {value} = e.target
        const regExp = /[`~!@#$%^&*()\-_=+[{\]}\\|'";:,<.>/?]/g;
        이름 = value.replace(regExp,'');
        if(value===''){
            nameGuideText = '이름을 입력해 주세요.';
        }
        else{
            nameGuideText = '';
        }
        setState({
            ...state,
            이름: 이름,
            nameGuideText: nameGuideText
        });
    }

    // 5-1. 이메일
    const onChangeEmail=(e)=>{
        let emailGuideText = '';
        let {value} = e.target;
        const regExp1 = /\s/g;
        const regExp2 = /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ`~!#$%^&*\-_=+{}|'?]+((\.)?[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ`~!#$%^&*\-_=+{}|'?]+)*@[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-_.]+((\.)?[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ.\-_]+)*\.[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-_]+$/g; // 앞과 뒤가 있어서 ^ $ 
        // /^[영문숫자한글특수]+((\.)?[영문숫자한글특수]+)*@[영문숫자한글특수]+((\.)?[영문숫자한글특수]+)*\.[영문숫자한글특수]+$/g;
        if(value===''){
            emailGuideText = '이메일을 입력해 주세요.';
        }
        else if(regExp1.test(value)===true || regExp2.test(value)===false){
            emailGuideText = '이메일 형식으로 입력해 주세요.';
        }
        else {
            emailGuideText = '';
        }
        setState({
            ...state,
            이메일: value,
            emailGuideText: emailGuideText
        });
    }

    // 5-2. 이메일 중복확인 버튼 클릭이벤트
    const onClickEmailBtn=(e)=>{
        e.preventDefault();
        const value = state.이메일;
        let emailGuideText = ''
        let 이메일중복확인 = false;
        const regExp1 = /\s/g;
        const regExp2 = /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ`~!#$%^&*\-_=+{}|'?]+((\.)?[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ`~!#$%^&*\-_=+{}|'?]+)*@[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-_.]+((\.)?[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ.\-_]+)*\.[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\-_]+$/g;
        if(value===''){
            emailGuideText = '이메일을 입력해 주세요.';
            이메일중복확인 = false;
            setState({
                ...state,
                이메일: value,
                이메일중복확인: 이메일중복확인
            });
            confirmModalMethod(emailGuideText);
        }
        else if(regExp1.test(value)===true || regExp2.test(value)===false){
            emailGuideText = '이메일 형식으로 입력해 주세요.';
            이메일중복확인 = false;
            setState({
                ...state,
                이메일: value,
                이메일중복확인: 이메일중복확인
            });
            confirmModalMethod(emailGuideText);
        }
        else {
            // AXIOS API 구현
            const formData = new FormData();
            formData.append('userEmail', state.이메일);
            axios({
                url: 'http://kkoma1221.dothome.co.kr/kurly_project/kurly_email_duplicate_check.php',
                method: 'POST',
                data: formData
            })
            .then((res)=>{
                if(res.status===200){
                    if(res.data===0){
                        이메일중복확인 = true;
                        emailGuideText = '사용 할 수 있는 이메일 입니다.';
                    }
                    else if(res.data===1){
                        이메일중복확인 = false;
                        emailGuideText = '사용 불가능한 이메일 입니다.';
                    }
                    confirmModalMethod(emailGuideText);
                    setState({ // AXIOS는 비동기식이라 반응이 느려서 맨 밑에 쓰면 먼저 상태변수에 값이저장되고 then문이 실행됨 => 바로 저장할 수 있도록 안에서 저장
                        ...state,
                        이메일중복확인: 이메일중복확인
                    });
                }
            })
            .catch((err)=>{
                console.log('AXIOS 오류')
                console.log(err);
            })
        }
    }

    // 6-1. 휴대폰번호입력상자 - 숫자 입력하는 순간 버튼 disabled 해제
    const onChangeHp=(e)=>{
        let isHpNum = false;
        let 휴대폰 = '';
        let {value} = e.target;
        const regExp = /[A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ`~!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?]/g;
        휴대폰 = value.replace(regExp, '');
        if (휴대폰.length>0){
            isHpNum = true;
        }
        else {
            isHpNum = false;
        }
        setState({
            ...state,
            휴대폰: 휴대폰,
            isHpNum: isHpNum
        });
    }

    // 6-2. 인증번호 받기 버튼 클릭이벤트
    const onClickHpBtn=(e)=>{
        e.preventDefault();
        // 0. 잘못된 휴대폰 번호 입니다. 확인 후 다시 시도해 주세요 => 정규표현식 3자리 01고정[0-9] 3-4자리 4자리
        // 1. 인증번호를 발급하고 6자리 랜덤(Random)번호 생성
        // 2. 컨펌모달창 열기 그리고 인증번호 전송하기
        // 3. 모달창 인증번호 확인하고 닫기
        //  - 잘못된 인증 코드 입니다.
        //  - 인증에 성공 하였습니다.
        const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/g;
        let num = 0;
        let isHpNum = false;
        let isHpNum2 = false;
        let isHpNum3 = true;
        if(state.isHpNum3===true){
            num = Math.floor(Math.random()*900000 + 100000); // Math.random 0~1까지의 무리수 * 자리수 +   => 정수
            if(regExp.test(state.휴대폰)===false){
                confirmModalMethod('잘못된 휴대폰 번호 입니다. 확인 후 다시 시도해 주세요');
            }
            else {
                confirmModalMethod(`인증번호가 발송되었습니다. ${num}`);
                isHpNum = false;    // 다시 버튼을 사용불가로 변환
                isHpNum2 = true;    // 아래 인증번호 입력상자가 보인다.
            }
            setState({
                ...state,
                isHpNum: isHpNum,
                isHpNum2: isHpNum2,
                발급된인증번호: num
            });
        }
        else{ // 다른번호인증 => 인증번호받기
            isHpNum = true; // 인증번호
            isHpNum3 = true;
            setState({
                ...state,
                휴대폰:'', // 입력된 휴대폰 삭제
                isHpNum: isHpNum,
                isHpNum3: isHpNum3
            });
        }
    }

    // 6-3. 인증번호 입력상자
    const onChangeHpAuthen=(e)=>{
        setState({
            ...state,
            입력된인증번호: e.target.value
        });
    }
    
    // 6-4. 인증번호 비교 확인 버튼 클릭 이벤트
    const onClickHpBtnOk=(e)=>{
        e.preventDefault();
        let isHpNum = false;
        let isHpNum2 = false;
        let isHpNum3 = true;
        let 입력된인증번호 = '';
        let 휴대폰인증 = false;
        if(state.발급된인증번호=== Number(state.입력된인증번호)){ // 발급된인증번호=>숫자 / 입력된 값=> 문자 문자열 숫자를 정수형 숫자로 강제형변환 Number()
            confirmModalMethod('인증에 성공 하였습니다.');
            isHpNum = true; // 완료 => 버튼 클릭 활성화
            isHpNum2 = false; // 완료 => 입력창 사라짐
            isHpNum3 = false; // 완료 => 다른번호인증 버튼으로 변경
            입력된인증번호 = '';
            휴대폰인증 = true;
        }
        else {
            confirmModalMethod('잘못된 인증 코드 입니다.');
            isHpNum = false;
            isHpNum2 = true; // 다시 입력 대기
            isHpNum3 = true;
            휴대폰인증 = false;
        }
        setState({
            ...state,
            isHpNum: isHpNum,
            isHpNum2: isHpNum2,
            isHpNum3: isHpNum3,
            입력된인증번호: 입력된인증번호,
            휴대폰인증: 휴대폰인증
        });
    }

    // 7-1. 주소1
    const onChangeAddress1=(e)=>{
        setState({
            ...state,
            주소1: e.target.value
        });
    }
    // 7-2. 주소2
    const onChangeAddress2=(e)=>{
        setState({
            ...state,
            주소2: e.target.value
        });
    }
    // 7-3. 주소 검색 버튼 클릭 이벤트 => 주소검색 모달창 오픈
    const onClickAddressSearch=(e)=>{
        e.preventDefault();
        dispatch(isAddress(true));
    }

    // 7-4. 리덕스 상태변수 값 주소1, 주소2 저장되면 => state 상태변수 주소1, 주소2 에 값 들어오고 isAddress 바뀜
    React.useEffect(()=>{
        // 페이지 이동하고 => 주소 화면에 띄우기
        setTimeout(()=>{
            if(selector.address.주소.주소1!=='' && selector.address.주소.주소2!==''){
                return ( // return 써주면 즉각 반영
                    setState({
                        ...state,
                        주소1: selector.address.주소.주소1,
                        주소2: selector.address.주소.주소2,
                        isAddress: true 
                    })
                )
            }
        },10); // 일정시간이 지난 후에 실행하라 setTimeout(); 10 = 0.01초
    },[selector.address.주소.주소1, selector.address.주소.주소2]);

    // 8. 성별
    const onChangeGender=(e)=>{
        setState({
            ...state,
            성별: e.target.value
        });
    }

    // 9-1. 생년월일 유효성검사
    //   생년/생월/생일 입력값 들어오면 유효검사체크
    React.useEffect(()=>{
        let birthGuideText = '';
        if(state.생년==='' && state.생월==='' && state.생일===''){ // 모두 빈칸이면
            birthGuideText = '';
        }
        else { // 모두 빈칸이 아니면
            const 오늘날짜 = new Date();
            if(state.생년.length < 4){ // 생년 4자리 미만이면
                birthGuideText = '태어난 년도 4자리를 정확하게 입력해주세요.';
            }
            else if(Number(state.생년) < (오늘날짜.getFullYear()-100)){ // 생년 100살 초과 입력불가
                birthGuideText = '생년월일을 다시 확인해주세요.';
            }
            else if(Number(state.생년) > 오늘날짜.getFullYear()){ // 크다 / 크거나 같다가 있을 때 '크다'가 먼저 나오고 '크거나 같다' 나중에 
                birthGuideText = '생년월일이 미래로 입력 되었습니다.';
            }
            else { // 생월 체크
                if(Number(state.생월) < 1 || Number(state.생월) > 12){
                    birthGuideText = '태어난 월을 정확하게 입력해주세요.';
                }
                else { // 생일 체크
                    if(Number(state.생일) < 1 || Number(state.생일) > 31){
                        birthGuideText = '태어난 일을 정확하게 입력해주세요.';
                    }
                    else { 
                            // 입력된 생년이 크면 무조건 14세 미만
                            // 입력된 생년이 같으면 => 생월이 현재 월보다 크면 만 14세 미만
                            // 입력된 생년이 같으면 => 생월이 현재 월과 같으면 => 생일과 비교 => 생일이 크면 만 14세 미만
                        if(Number(state.생년) === (오늘날짜.getFullYear()-14)){
                            if(Number(state.생월) === (오늘날짜.getMonth()+1)){ //getMonth() => 0부터 시작 => 1을 더해준다
                                if(Number(state.생일) > 오늘날짜.getDate()){
                                    birthGuideText = '만 14세 미만은 가입이 불가합니다.';
                                }
                                else{
                                    birthGuideText = '';
                                }
                            }
                            else if(Number(state.생월) > (오늘날짜.getMonth()+1)){
                                birthGuideText = '만 14세 미만은 가입이 불가합니다.';
                            }
                        }
                        else if(Number(state.생년) > (오늘날짜.getFullYear()-14)){ // 만 14세 미만
                            birthGuideText = '만 14세 미만은 가입이 불가합니다.';
                        }
                    }
                }
            }
        }
        setState({
            ...state,
            birthGuideText: birthGuideText
        });

    },[state.생년, state.생월, state.생일]);

    // 9-2. 생년 
    const onChangeYear=(e)=>{
        //입력값이 숫자가 아니면 모두 삭제 => 정규표현식
        const regExp = /[^0-9]/g;
        let {value} = e.target;
        let 생년 = ''
        생년 = value.replace(regExp, '');
        setState({
            ...state,
            생년: 생년
        });
    }
    // 9-3. 생월
    const onChangeMonth=(e)=>{
        //입력값이 숫자가 아니면 모두 삭제 => 정규표현식
        const regExp = /[^0-9]/g;
        let 생월 = e.target.value.replace(regExp, '');
        setState({
            ...state,
            생월: 생월
        });
    }
    // 9-4. 생일
    const onChangeDate=(e)=>{
        //입력값이 숫자가 아니면 모두 삭제 => 정규표현식
        const regExp = /[^0-9]/g;
        let 생일 = e.target.value.replace(regExp, '');
        setState({
            ...state,
            생일: 생일
        });
    }

    // 10-1. 추가입력사항 : 추천인아이디 & 참여이벤트명
    const onChangeChooga=(e)=>{
        setState({
            ...state,
            추가입력사항: e.target.value // 이벤트.지금선택한항목.값
        });
    }
    // 10-2. 추천인아이디
    const onChangeChooga1=(e)=>{
        setState({
            ...state,
            추천인아이디: e.target.value
        });
    }

    // 10-3. 추천인아이디 확인 버튼 클릭 이벤트
    const onClickIdCheckBtn=(e)=>{
        e.preventDefault();
        // AXIOS API 구현
        let 추천인아이디확인 = false;
        let idGuideText = '';
        const formData = new FormData();
        formData.append('userId', state.추천인아이디);
        axios({
            url: 'http://kkoma1221.dothome.co.kr/kurly_project/kurly_id_check.php',
            method: 'POST',
            data: formData
        })
        .then((res)=>{
            if(res.status===200){
                if(res.data===0){
                    idGuideText = '존재하지 않는 아이디 입니다.';
                    추천인아이디확인 = false;
                }
                else if(res.data===1){
                    idGuideText = '존재하는 아이디 입니다. 친구초대 이벤트에 참여 가능해요.';
                    추천인아이디확인 = true;
                }
                confirmModalMethod(idGuideText);
                setState({
                    ...state,
                    추천인아이디확인: 추천인아이디확인
                });
            }
        })
        .catch((err)=>{
            console.log('AXIOS 오류')
            console.log(err);
        })

    }

    // 10-3. 참여이벤트명
    const onChangeChooga2=(e)=>{
        setState({
            ...state,
            참여이벤트명: e.target.value
        });
    }
    // 10-4. 추가입력사항 값 변경되면 즉시 동작
    React.useEffect(()=>{
        let isUserChoogaId = false;
        let isUserChoogaEvent = false;
        if(state.추가입력사항==='친구초대 추천인 아이디'){
            isUserChoogaId = true;
            isUserChoogaEvent = false;
        }
        else if(state.추가입력사항==='참여 이벤트명'){
            isUserChoogaId = false;
            isUserChoogaEvent = true;
        }
        setState({
            ...state,
            isUserChoogaId: isUserChoogaId,
            isUserChoogaEvent: isUserChoogaEvent
        });
    },[state.추가입력사항]);


    // 11-0. 이용약관보기1 버튼 클릭 이벤트
    const onClickServiceView1Btn=(e)=>{
        e.preventDefault();
        dispatch(confirmService1Modal(true));
        const htmlEl = document.getElementsByTagName('html')[0];
        htmlEl.classList.add('on');
    }

    // 11-0. 이용약관보기2 버튼 클릭 이벤트
    const onClickServiceView2Btn=(e)=>{
        e.preventDefault();
        dispatch(confirmService2Modal(true));
        const htmlEl = document.getElementsByTagName('html')[0];
        htmlEl.classList.add('on');
    }

    // 11-0. 이용약관보기3 버튼 클릭 이벤트
    const onClickServiceView3Btn=(e)=>{
        e.preventDefault();
        dispatch(confirmService3Modal(true));
        const htmlEl = document.getElementsByTagName('html')[0];
        htmlEl.classList.add('on');
    }
    
    // 11-1. 이용약관동의 이벤트
    const onChangeServiceCheck=(e)=>{
        // 체크하면 값 저장 
        // 체크해제하면 값 삭제 (filter)
        /*  console.log(e);
            console.log(e.target);
            console.log(e.target.value);
            console.log(e.target.checked);
        */
        let 이용약관동의 = state.이용약관동의; // 상태변수에 기존에 저장된 내용 통째로 가져오기
        if(e.target.checked===true){ // 체크되면 저장
            if(e.target.value==='무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)'){
                // 이용약관동의 배열안에 SMS, 이메일 모두 없다면 둘다 삽입한다.
                // 이용약관동의 배열안에 없는 항목만 넣는다.
                if(이용약관동의.includes('SMS')===false && 이용약관동의.includes('이메일')===false){
                    이용약관동의 = [...이용약관동의, e.target.value, 'SMS', '이메일'];
                }
                else if(이용약관동의.includes('SMS')===true && 이용약관동의.includes('이메일')===false){
                    이용약관동의 = [...이용약관동의, e.target.value, '이메일'];
                }
                else if(이용약관동의.includes('SMS')===false && 이용약관동의.includes('이메일')===true){
                    이용약관동의 = [...이용약관동의, e.target.value, 'SMS'];
                }
            }
            else if(e.target.value==='SMS'){
                if(이용약관동의.includes('이메일')===true){
                    이용약관동의 = [...이용약관동의, e.target.value, '무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)'];
                }
                else {
                    이용약관동의 = [...이용약관동의, e.target.value];
                }
            }
            else if(e.target.value==='이메일'){
                if(이용약관동의.includes('SMS')===true){
                    이용약관동의 = [...이용약관동의, e.target.value, '무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)'];
                }
                else {
                    이용약관동의 = [...이용약관동의, e.target.value];
                }
            }
            else {
                이용약관동의 = [...이용약관동의, e.target.value];
            }
        }
        else {
            let arr = state.이용약관동의 // 이용약관 동의 배열 모두 가져오기, 배열변수

            if(e.target.value==='무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)'){
                arr = arr.filter((item)=>item!==e.target.value); // 추가는 한꺼번에 가능하지만 삭제는 하나씩 해야함
                arr = arr.filter((item)=>item!=='SMS');
                arr = arr.filter((item)=>item!=='이메일');
                이용약관동의 = arr;
            }
            else if(e.target.value==='SMS'){
                arr = arr.filter((item)=>item!==e.target.value);
                arr = arr.filter((item)=>item!=='무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)');
                이용약관동의 = arr;
            }
            else if(e.target.value==='이메일'){
                arr = arr.filter((item)=>item!==e.target.value);
                arr = arr.filter((item)=>item!=='무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)');
                이용약관동의 = arr; 
            }
            else {
                이용약관동의 = 이용약관동의.filter((item)=>item!==e.target.value);
            }
        }

        setState({ // 상태관리 변수는 if문 안에서 직접 값 변경하는 것이 아니라, 임시 변수를 만들어서 마지막에 한번만 변경한다.
            ...state,
            이용약관동의: 이용약관동의
        });
    }
    // 11-2. 이용약관 전체동의 이벤트
    const onChangeServiceAllCheck=(e)=>{
        let 이용약관동의 = [];
        if(e.target.checked){
            이용약관동의 = state.이용약관;
        }
        else {
            이용약관동의 = []; // 빈배열 => 배열삭제
        }
        setState({
            ...state,
            이용약관동의: 이용약관동의
        });
    }

    // 12. 전체 유효성 검사 후 폼전송 => DATABASE 서버에 전송
    const onsubmitForm=(e)=>{
        e.preventDefault();

        // 이용약관동의필수 항목 카운트
        let cnt = 0;
        state.이용약관동의.map((item)=>{
            if(item.includes('필수')){
                cnt++;
            }
        });
        console.log(state.이용약관동의);
        console.log(cnt);

        if(state.아이디===''){
            confirmModalMethod('아이디를 입력하세요.');
        }
        else if(state.아이디중복확인===false){
            confirmModalMethod('아이디 중복 체크를 해주세요.');
        }
        else if(state.비밀번호===''){
            confirmModalMethod('비밀번호를 입력하세요.');
        }
        else if(state.비밀번호확인===''){
            confirmModalMethod('비밀번호를 한번 더 입력하세요.');
        }
        else if(state.이름===''){
            confirmModalMethod('이름을 입력하세요.');
        }
        else if(state.이메일===''){
            confirmModalMethod('이메일을 입력하세요.');
        }
        else if(state.이메일중복확인===false){
            confirmModalMethod('이메일 중복 체크를 해주세요.');
        }
        else if(state.휴대폰===''){
            confirmModalMethod('휴대폰 번호를 입력하세요.');
        }
        else if(state.휴대폰인증===false){
            confirmModalMethod('휴대폰 번호를 인증 해주세요.');
        }
        else if(state.주소1===''){
            confirmModalMethod('주소를 검색 해주세요.');
        }
        else if(state.주소2===''){
            confirmModalMethod('세부주소를 입력하세요.');
        }
        else if(cnt < 3){
            confirmModalMethod('이용약관동의 필수 항목을 선택해주세요.');
        }
        else { // 유효성검사 성공적으로 완료되면 데이터 전송
            const regExp = /^(\d{3})([0-9]{3,4})([0-9]{4})$/g; // 휴대폰 정규표현식
            const formData = new FormData(); // formData 생성 반드시 해야함!
            formData.append('userId', state.아이디);
            formData.append('userPw', state.비밀번호);
            formData.append('userName', state.이름);
            formData.append('userEmail', state.이메일);
            formData.append('userHp', state.휴대폰.replace(regExp, '$1-$2-$3'));
            formData.append('userAddress', `${state.주소1}. ${state.주소2}`); // \t 탭키(일정한 공백을 준다) 역슬래시를 문자로 인식하기 위해 역슬래시를 한번 더 씀
            formData.append('userGender', state.성별);
            formData.append('userBirth', `${state.생년}-${state.생월}-${state.생일}`);
            formData.append('userAddInfo', `${state.추가입력사항} ${state.추천인아이디} ${state.추천인아이디확인} ${state.참여이벤트명}`);
            formData.append('userService', state.이용약관동의);

            axios({
                url: 'http://kkoma1221.dothome.co.kr/kurly_project/kurly_insert.php',
                method: 'POST',
                data: formData // 클라이언트가 서버에게 요청 Request
            })
            .then((res)=>{
                if(res.status===200){ // 전송성공
                    console.log( res.data ); // 서버가 클라이언트에게 응답 Response
                    // 회원가입 완료되면
                    if(res.data===1){ // 회원가입 성공 => 인트로 페이지로 이동하는 라우터 네비게이션 구현
                        // 미션 > 회원가입이 완료되면 => 가입축하인사 컨펌모달창 뜨고
                        // 컨펌 모달창을 닫으면 => 인트로 페이지로 이동하도록 네비게이션 구현
                        confirmModalMethod('마켓컬리 회원가입을 진심으로 감사드립니다.')
                    }
                    else if(res.data===0){ // 회원가입 실패 => 입력된 폼데이터 확인하고 다시 시도
                        confirmModalMethod('확인하고 다시 시도해주세요');
                    }
                }
            })
            .catch((err)=>{
                console.log("AXIOS 전송 실패!");
                console.log(err);
            })
        }
    }

    // 모달창 닫으면 실행되는 네비게이트
    // 회원가입 버튼 클릭 시 
    // 리덕스에 member 변수 값 true이면 => 회원가입 완료
    React.useEffect(()=>{
        if(selector.confirmModal.member===true){
            navigate('/index'); // 2. 리덕스 변수만 가지고 구현
            /*  setState({ // 1. 리덕스+상태변수 > 회원가입완료 상태변수를 true로 변경
                ...state,
                회원가입완료: true
            }); */
        }
    },[selector.confirmModal.member]);

    // 1. 리덕스+상태변수
    // 상태관리 변수에 회원가입완료===true이면 동작
    /*  React.useEffect(()=>{
        if(state.회원가입완료===true){
            navigate('/index');
        }
    },[state.회원가입완료]); */


    return (
        <main id='sub5' className='sub'>
            <section id='signup'>
                <div className="container">
                    <div className="title">
                        <h2 className='title-text' >회원가입</h2>
                        <div className="sub-title">
                            <h3><i>*</i><span>필수입력사항</span></h3>
                        </div>
                    </div>
                    <div className="content sub5-content">
                        <form onSubmit={onsubmitForm}> {/* submit버튼을 클릭하면 form 전체가 전달되므로 form에 이벤트를 건다. */}
                            <ul className='signup-form'>
                                <li className='list'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label htmlFor="userId"><span>아이디</span><i>*</i></label>
                                        </div>
                                        <div className="input-box">
                                            <input
                                                type="text"
                                                maxLength={16}
                                                id='userId'
                                                name='userId'
                                                placeholder='아이디를 입력해주세요'
                                                value={state.아이디}
                                                onChange={onChangeId}
                                            />
                                        </div>
                                        <div className="right-box">
                                            <button onClick={onClickIdBtn}>중복확인</button>
                                        </div>
                                        <p className={`guide-text${state.idGuideText!==''?' on':''}`}>{state.idGuideText}</p>
                                    </div>
                                </li>
                                <li className='list'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label htmlFor="userPw"><span>비밀번호</span><i>*</i></label>
                                        </div>
                                        <div className="input-box">
                                            <input
                                                type="password"
                                                maxLength={16}
                                                id='userPw'
                                                name='userPw'
                                                placeholder='비밀번호를 입력해주세요'
                                                value={state.비밀번호}
                                                onChange={onChangePw}
                                            />
                                        </div>
                                        <div className="right-box">
                                        </div>
                                        <p className={`guide-text${state.pw1GuideText!==''?' on':''}`}>{state.pw1GuideText}</p>
                                    </div>
                                </li>
                                <li className='list'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label htmlFor="userPwCheck"><span>비밀번호확인</span><i>*</i></label>
                                        </div>
                                        <div className="input-box">
                                            <input
                                                type="password"
                                                maxLength={16}
                                                id='userPwCheck'
                                                name='userPwCheck'
                                                placeholder='비밀번호를 한번 더 입력해주세요'
                                                value={state.비밀번호확인}
                                                onChange={onChangePw2}
                                            />
                                        </div>
                                        <div className="right-box">
                                        </div>
                                        <p className={`guide-text${state.pw2GuideText!==''?' on':''}`}>{state.pw2GuideText}</p>
                                    </div>
                                </li>
                                <li className='list'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label htmlFor="userName"><span>이름</span><i>*</i></label>
                                        </div>
                                        <div className="input-box">
                                            <input
                                                type="text"
                                                id='userName'
                                                name='userName'
                                                maxLength={20}
                                                placeholder='이름을 입력해주세요'
                                                value={state.이름}
                                                onChange={onChangeName}
                                            />
                                        </div>
                                        <div className="right-box">
                                        </div>
                                        <p className={`guide-text${state.nameGuideText!==''?' on':''}`}>{state.nameGuideText}</p>
                                    </div>
                                </li>
                                <li className='list'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label htmlFor="userEmail"><span>이메일</span><i>*</i></label>
                                        </div>
                                        <div className="input-box">
                                            <input
                                                type="text"
                                                id='userEmail'
                                                name='userEmail'
                                                placeholder='예: marketkurly@kurly.com'
                                                value={state.이메일}
                                                onChange={onChangeEmail}
                                            />
                                        </div>
                                        <div className="right-box">
                                            <button onClick={onClickEmailBtn}>중복확인</button>
                                        </div>
                                        <p className={`guide-text${state.emailGuideText!==''?' on':''}`}>{state.emailGuideText}</p>
                                    </div>
                                </li>
                                <li className='list hp1'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label htmlFor="userHp"><span>휴대폰</span><i>*</i></label>
                                        </div>
                                        <div className="input-box">
                                            <input
                                                type="text"
                                                maxLength={11}
                                                id='userHp'
                                                name='userHp'
                                                placeholder='숫자만 입력해주세요'
                                                value={state.휴대폰} 
                                                onChange={onChangeHp}
                                            />
                                        </div>
                                        <div className="right-box">
                                            <button /* disabled true 버튼 사용 불가능, false는 버튼 사용 가능 => state.isHpNum 초기값 false이므로 ! 붙임*/
                                                disabled={!state.isHpNum}
                                                className={`hp-btn${state.isHpNum?'':' off'}`}
                                                onClick={onClickHpBtn}
                                            >{state.isHpNum3?'인증번호 받기':'다른번호 인증'}</button>
                                        </div>
                                    </div>
                                </li>
                                {
                                    state.isHpNum2 && (
                                        <>
                                            <li className='list hp2'>
                                                <div className="list-box">
                                                    <div className="input-box">
                                                        <input
                                                            type="text"
                                                            id='userHpAuthen'
                                                            name='userHpAuthen'
                                                            placeholder='인증번호를 입력하세요'
                                                            value={state.입력된인증번호}
                                                            onChange={onChangeHpAuthen}
                                                        />
                                                        <span className='time-box'><em>03</em><em>00</em></span>
                                                    </div>
                                                    <div className="right-box">
                                                        <button onClick={onClickHpBtnOk}>인증번호 확인</button>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className='list hp3'>
                                                <div className="list-box">
                                                    <p className='guide-text show'>인증번호가 오지 않는다면, 통신사 스팸 차단 서비스 혹은 휴대폰 번호 차단 여부를 확인해주세요. (컬리 1644-1107)</p>
                                                </div>
                                            </li>
                                        </>
                                    )
                                }
                                <li className='list address1'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label htmlFor="userAddress1"><span>주소</span><i>*</i></label>
                                        </div>
                                        <div className="input-box">
                                            {
                                                !state.isAddress && ( // true가 아니면 보인다.
                                                    <button onClick={onClickAddressSearch} className='address-search-btn'>주소검색</button>
                                                )
                                            }
                                            {
                                                state.isAddress && (
                                                    <input
                                                        type="text"
                                                        id='userAddress1'
                                                        name='userAddress1'
                                                        value={state.주소1}
                                                        onChange={onChangeAddress1}
                                                    />
                                                )
                                            }
                                        </div>
                                        <div className="right-box">
                                            {
                                                state.isAddress && (
                                                    <button onClick={onClickAddressSearch} className='re-search'>재검색</button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </li>
                                {
                                    state.isAddress && (
                                        <>
                                            <li className='list address2'>
                                                <div className="list-box">
                                                    <div className="input-box">
                                                        <input
                                                            type="text"
                                                            id='userAddress2'
                                                            name='userAddress2'
                                                            placeholder='나머지 주소를 입력해주세요'
                                                            value={state.주소2}
                                                            onChange={onChangeAddress2}
                                                        />
                                                    </div>
                                                </div>
                                            </li>
                                            <li className='list address3'>
                                                <div className="list-box">
                                                    <p className='guide-text show'>
                                                        <strong>샛별배송</strong>
                                                        배송지에 따라 상품 정보가 달라질 수 있습니다.
                                                    </p>
                                                </div>
                                            </li>
                                        </>
                                    )
                                }
                                <li className='list radio gender'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label><span>성별</span></label>
                                        </div>
                                        <div className="input-box">
                                            <label htmlFor="userMale">
                                                <input
                                                    type="radio"
                                                    id='userMale'
                                                    name='userGender'
                                                    value={'남자'}
                                                    onChange={onChangeGender}
                                                    checked={state.성별.includes('남자')}
                                                />
                                                <span>남자</span>
                                            </label>
                                            <label htmlFor="userFemale">
                                                <input
                                                    type="radio"
                                                    id='userFemale'
                                                    name='userGender'
                                                    value={'여자'}
                                                    onChange={onChangeGender}
                                                    checked={state.성별.includes('여자')}
                                                />
                                                <span>여자</span>
                                            </label>
                                            <label htmlFor="userNone">
                                                <input
                                                type="radio"
                                                id='userNone'
                                                name='userGender'
                                                value={'선택안함'}
                                                onChange={onChangeGender}
                                                /* defaultChecked   // 기본선택 체크는 되지만, 상태관리와는 연결이 되지 않음 */
                                                checked={state.성별.includes('선택안함')} /* 상태관리와 연결됨 */
                                                />
                                                <span>선택안함</span>
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li className='list birth'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label htmlFor="userYear"><span>생년월일</span></label>
                                        </div>
                                        <div className="input-box">
                                            <ul>
                                                <li>
                                                    <input
                                                        type="text"
                                                        maxLength={4}
                                                        id='userYear'
                                                        name='userYear'
                                                        placeholder='YYYY'
                                                        value={state.생년}
                                                        onChange={onChangeYear}
                                                    />
                                                </li>
                                                <li><i>/</i></li>
                                                <li>
                                                    <input
                                                        type="text"
                                                        maxLength={2}
                                                        id='userMonth'
                                                        name='userMonth'
                                                        placeholder='MM'
                                                        value={state.생월}
                                                        onChange={onChangeMonth}
                                                    />
                                                </li>
                                                <li><i>/</i></li>
                                                <li>
                                                    <input
                                                        type="text"
                                                        maxLength={2}
                                                        id='userDate'
                                                        name='userDate'
                                                        placeholder='DD'
                                                        value={state.생일}
                                                        onChange={onChangeDate}
                                                    />
                                                </li>
                                            </ul>
                                        </div>
                                        <p className={`guide-text${state.birthGuideText!==''?' on':''}`}>{state.birthGuideText}</p>
                                    </div>
                                </li>
                                <li className='list radio chooga'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label><span>추가입력사항</span></label>
                                        </div>
                                        <div className="input-box">
                                            <label htmlFor="userChooga1">
                                                <input
                                                    type="radio"
                                                    id='userChooga1'
                                                    name='userChooga'
                                                    value={'친구초대 추천인 아이디'}
                                                    onChange={onChangeChooga}
                                                    checked={state.추가입력사항.includes('친구초대 추천인 아이디')}
                                                />
                                                <span>친구초대 추천인 아이디</span>
                                            </label>
                                            <label htmlFor="userChooga2">
                                                <input
                                                    type="radio"
                                                    id='userChooga2'
                                                    name='userChooga'
                                                    value={'참여 이벤트명'}
                                                    onChange={onChangeChooga}
                                                    checked={state.추가입력사항.includes('참여 이벤트명')===true?true:false}
                                                />
                                                <span>참여 이벤트명</span>
                                            </label>
                                        </div>
                                    </div>
                                </li>
                            { 
                                state.isUserChoogaId && (                               
                                    <li className='list chooga userChoogaId'>
                                        <div className="list-box">
                                            <div className="input-box">
                                                <input
                                                    type="text"
                                                    id='userChoogaId'
                                                    name='userChoogaId'
                                                    placeholder='추천인 아이디를 입력해 주세요.'
                                                    value={state.추천인아이디}
                                                    onChange={onChangeChooga1}
                                                />
                                            </div>
                                            <div className="right-box">
                                                <button onClick={onClickIdCheckBtn}>아이디 확인</button>
                                            </div>
                                            <p className='guide-text show'>가입 후 7일 내 첫 주문 배송완료 시, 친구초대 이벤트 적립금이 지급됩니다.</p>
                                        </div>
                                    </li>
                                )
                            }
                            {
                                state.isUserChoogaEvent && (
                                    <li className='list chooga userChoogaEvent'>
                                        <div className="list-box">
                                            <div className="input-box">
                                                <input
                                                    type="text"
                                                    id='userChoogaEvent'
                                                    name='userChoogaEvent'
                                                    placeholder='참여 이벤트명을 입력해 주세요.'
                                                    value={state.참여이벤트명}
                                                    onChange={onChangeChooga2}
                                                />
                                            </div>
                                            <p className='guide-text show'>추천인 아이디와 참여 이벤트명 중 하나만 선택 가능합니다.<br/>
                                            가입 이후는 수정이 불가능 합니다. <br />
                                            대소문자 및 띄어쓰기에 유의해주세요.
                                            </p>
                                        </div>
                                    </li>
                                )
                            }                      
                                <li className='list hr'>
                                    <div className="list-box">
                                        <hr />
                                    </div>
                                </li>
                                <li className='list service service1'>
                                    <div className="list-box">
                                        <div className="left-box">
                                            <label><span>이용약관동의</span><i>*</i></label>
                                        </div>
                                        <div className="input-box">
                                            <label htmlFor="userServiceAll">
                                                <input
                                                    type="checkbox" 
                                                    id='userServiceAll'
                                                    name='userServiceAll'
                                                    value={'전체 동의합니다.'}
                                                    onChange={onChangeServiceAllCheck}
                                                    checked={state.이용약관동의.length===7}
                                                    /* checked={state.이용약관동의.length===7?true:false} */
                                                />
                                                <span>전체 동의합니다.</span>
                                            </label>
                                        </div>
                                        <p className='guide-text show'>선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</p>
                                    </div>
                                </li>
                                <li className='list service'>
                                    <div className="list-box">
                                        <div className="input-box">
                                            <label htmlFor="userService1">
                                                <input
                                                    type="checkbox"
                                                    id='userService1'
                                                    name='userService'
                                                    value={'이용약관 동의(필수)'}
                                                    onChange={onChangeServiceCheck}
                                                    checked={state.이용약관동의.includes('이용약관 동의(필수)')}
                                                />
                                                <span>이용약관 동의</span><em>(필수)</em>
                                            </label>
                                        </div>
                                        {/* 약관보기 */}
                                        <button className='service-view' onClick={onClickServiceView1Btn}><span>약관보기</span><img src="./images/sub/icon_arrow_right.svg" alt="" /></button>
                                    </div>
                                </li>
                                <li className='list service'>
                                    <div className="list-box">
                                        <div className="input-box">
                                            <label htmlFor="userService2">
                                                <input
                                                    type="checkbox"
                                                    id='userService2'
                                                    name='userService'
                                                    value={'개인정보 수집∙이용 동의(필수)'}
                                                    onChange={onChangeServiceCheck}
                                                    checked={state.이용약관동의.includes('개인정보 수집∙이용 동의(필수)')}
                                                />
                                                <span>개인정보 수집∙이용 동의</span><em>(필수)</em>
                                            </label>
                                        </div>
                                        <button className='service-view' onClick={onClickServiceView2Btn}><span>약관보기</span><img src="./images/sub/icon_arrow_right.svg" alt="" /></button>
                                    </div>
                                </li>
                                <li className='list service'>
                                    <div className="list-box">
                                        <div className="input-box">
                                            <label htmlFor="userService3">
                                                <input
                                                    type="checkbox"
                                                    id='userService3'
                                                    name='userService'
                                                    value={'개인정보 수집∙이용 동의(선택)'}
                                                    onChange={onChangeServiceCheck}
                                                    checked={state.이용약관동의.includes('개인정보 수집∙이용 동의(선택)')}
                                                />
                                                <span>개인정보 수집∙이용 동의</span><em>(선택)</em>
                                            </label>
                                        </div>
                                        <button className='service-view' onClick={onClickServiceView3Btn}><span>약관보기</span><img src="./images/sub/icon_arrow_right.svg" alt="" /></button>
                                    </div>
                                </li>
                                <li className='list service'>
                                    <div className="list-box">
                                        <div className="input-box">
                                            <label htmlFor="userService4">
                                                <input
                                                    type="checkbox"
                                                    id='userService4'
                                                    name='userService'
                                                    value={'무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)'}
                                                    onChange={onChangeServiceCheck}
                                                    checked={state.이용약관동의.includes('무료배송, 할인쿠폰 등 혜택/정보 수신 동의(선택)')}
                                                />
                                                <span>무료배송, 할인쿠폰 등 혜택/정보 수신 동의</span><em>(선택)</em>
                                            </label>
                                        </div>
                                    </div>
                                </li>
                                <li className='list service service5'>
                                    <div className="list-box">
                                        <div className="input-box">
                                            <label htmlFor="userService5">
                                                <input
                                                    type="checkbox"
                                                    id='userService5'
                                                    name='userService'
                                                    value={'SMS'}
                                                    onChange={onChangeServiceCheck}
                                                    checked={state.이용약관동의.includes('SMS')}
                                                />
                                                <span>SMS</span>
                                            </label>
                                            <label htmlFor="userService6">
                                                <input
                                                    type="checkbox"
                                                    id='userService6'
                                                    name='userService'
                                                    value={'이메일'}
                                                    onChange={onChangeServiceCheck}
                                                    checked={state.이용약관동의.includes('이메일')}
                                                />
                                                <span>이메일</span>
                                            </label>
                                        </div>
                                        <p className='guide-text show'>동의 시 한 달간 [5%적립] + [2만원 이상 무료배송] 첫 주문 후 안내</p>
                                    </div>
                                </li>
                                <li className='list service'>
                                    <div className="list-box">
                                        <div className="input-box">
                                            <label htmlFor="userService7">
                                                <input
                                                    type="checkbox"
                                                    id='userService7'
                                                    name='userService'
                                                    value={'본인은 만 14세 이상입니다.(필수)'}
                                                    onChange={onChangeServiceCheck}
                                                    checked={state.이용약관동의.includes('본인은 만 14세 이상입니다.(필수)')}
                                                />
                                                <span>본인은 만 14세 이상입니다.</span><em>(필수)</em>
                                            </label>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div className="button-box">
                                <button type='submit'>가입하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
};
