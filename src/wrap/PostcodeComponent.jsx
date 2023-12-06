import React from 'react';
import './scss/Postcode.scss'
import PostCode from 'react-daum-postcode';
import { useDispatch } from 'react-redux';
import { isAddress } from '../reducer/isAddress';
import { address } from '../reducer/address';

export default function PostcodeComponent(){

    const dispatch = useDispatch();

    const refAddress2 = React.useRef();

    const [state, setState] = React.useState({
        주소1: '', // 입력상자에 입력되어 저장되는 주소
        주소2: '', // 입력상자에 입력되어 저장되는 주소
        isAddrAPIShow: true,
        isMoreview: false
    });

    const postCodeStyle = { // 객체를 만듬, 내부스타일, 객체기반은 '' ,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2 // - 연결부호 인식 못해 => camelCase로 쓴다.
    }

    const onCompletePostCode=(data)=>{
        let 주소1 = '';
        let 엑스트라주소 = '';
        let extraAddr = '';
        // console.log(data);
        // console.log(data.address);
        // console.log(data.zonecode);

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if(data.userSelectedType === 'R'){
            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                extraAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if(data.buildingName !== '' && data.apartment === 'Y'){
                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if(extraAddr !== ''){
                extraAddr = ' (' + extraAddr + ')';
            }
            // 조합된 참고항목을 해당 필드에 넣는다.
            엑스트라주소 = extraAddr;
        } else {
            엑스트라주소 = '';
        }

        if(data.userSelectedType==='R'){ // 사용자가 선택한 값 이용하기
            주소1 = `(${data.zonecode}) ${data.roadAddress} ${엑스트라주소}`; // 도로명주소
        }
        else {
            주소1 = `(${data.zonecode}) ${data.jibunAddress} ${엑스트라주소}`; // 지번주소
        }
        setState({
            ...state,
            주소1: 주소1
        });
    }

    // 주소 1 입력 끝나고 주소2 입력창에 cursor 깜빡깜빡하는 효과
    React.useEffect(()=>{
        if(state.주소1!==''){
            refAddress2.current.focus();
        }
    },[state.주소1]);

    // 나머지 주소 입력
    const onChangeAddress=(e)=>{
        setState({
            ...state,
            주소2: e.target.value
        });
    }

    // 저장버튼 클릭이벤트 =>
    // 주소1, 주소2 최상위 컴포넌트의
    // 1. 저장소(session)에 저장하기 sessionStorage()
    // 2. 리덕스 상태관리변수에 주소저장 dispatch()
    // 3.  => 닫기
    const onClickSaveBtn=(e)=>{
        e.preventDefault();
        const addr = {
            주소1: state.주소1,
            주소2: state.주소2
        }
        sessionStorage.setItem('KURLY_ADDRESS_KEY', JSON.stringify(addr));

        dispatch(address(addr));
        dispatch(isAddress(false));
    }

    // 재검색 버튼 클릭 이벤트
    const onClickReSearchBtn=(e)=>{
        e.preventDefault();
        dispatch(isAddress(false)); // 그냥 true로 하면 이미 열려있기 때문에 적용이 안되서 닫은 다음 다시 열기 
        setTimeout(()=>{ // 시간차이를 줘야함(비동기 방식)
            dispatch(isAddress(true));
        },10);

    }

    // 주소검색 모달창 닫기
    const onClickClose=(e)=>{
        e.preventDefault();
        dispatch(isAddress(false));
    }

    return (
        <div id='postCode'>
            <div className="container">
                <div className="window-title">
                    <h1>
                        <img src="./images/intro/favicon-192x192.png" alt="" />
                        <em>컬리 - 마켓컬리/뷰티컬리</em>
                    </h1>
                    <button onClick={onClickClose} title='닫기'> {/* title='' 마우스 올리면 글씨가 보임 */}
                        <i className="material-icons">close</i>
                    </button>
                </div>
                <div className="content">
                    { 
                        state.isAddrAPIShow && (
                            <PostCode 
                            style={postCodeStyle}
                            onComplete={onCompletePostCode}
                        />
                        )
                    }
                    <div className="binding-box">
                        <div className="title">
                            <h1><strong>샛별배송</strong><span> 지역입니다.</span></h1>
                            <h2>매일 새벽, 문 앞까지 신선함을 전해드려요.</h2>
                        </div>
                        <ul className='list-box'>
                            <li>
                                <div className="gap row1">
                                    <input
                                        type="text"
                                        name='address1'
                                        id='address1'
                                        value={state.주소1}
                                        disabled={true}
                                    />
                                    <button onClick={onClickReSearchBtn}><img src="./images/sub/sub5/ico_search.svg" alt="" /><span>재검색</span></button>
                                </div>
                            </li>
                            <li>
                                <div className="gap row2">
                                    <input
                                        type="text"
                                        name='address2'
                                        id='address2'
                                        value={state.주소2}
                                        onChange={onChangeAddress} /* 손으로 입력하는 것은 onChange 이벤트를 걸어야 작성 가능 */
                                        placeholder='나머지 주소를 입력해 주세요'
                                        ref={refAddress2}
                                    />
                                </div>
                            </li>
                            <li>
                                <div className="gap row3">
                                    <p>
                                        ※ 저장된 배송지는 최대 7일 간 임시 저장 후 자동 삭제됩니다. <br />
                                        로그인 할 경우, 회원님의 배송지 목록에 추가됩니다.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <div className="gap row4">
                                    <button onClick={onClickSaveBtn}>저장</button>
                                </div>
                            </li>
                            <li>
                                <div className="gap row5">
                                    <img src="./images/sub/icon_information.svg" alt="" />
                                    <span>샛별배송 지역 중 배송불가 장소 안내</span>
                                </div>
                            </li>
                            <li>
                                <div className="gap row6">
                                    <span>관공서 / 학교 / 병원 / 시장 / 공단지역 / 산간지역 / 백화점 등</span>
                                    <button><em>자세히 보기</em><img src="./images/sub/icon_arrow_down.svg" alt="" /></button>
                                    {
                                        state.isMoreview && (
                                            <div className="more-view">
                                                <ul>
                                                    <li>가락동농수산물도매시장</li>
                                                    <li>가락동농수산물시장</li>
                                                    <li>가천대학교</li>
                                                    <li>고려대학교안암캠퍼스</li>
                                                    <li>고매동 일부(일부지역만 배송가능)</li>
                                                    <li>국립중앙박물관</li>
                                                    <li>국민대학교</li>
                                                    <li>덕성여자대학교</li>
                                                    <li>덕양구 신원동 일부(일부지역만 배송가능)</li>
                                                    <li>도내동 일부(원흥지구만 배송가능)</li>
                                                    <li>동덕여자대학교</li>
                                                    <li>반월특수지구</li>
                                                    <li>서경대학교</li>
                                                    <li>서울사이버대학교</li>
                                                    <li>서울시립대학교</li>
                                                    <li>서울여자대학교</li>
                                                    <li>성균관대학교</li>
                                                    <li>성신여자대학교</li>
                                                    <li>세종대학교</li>
                                                    <li>연세대학교</li>
                                                    <li>이화여자대학교</li>
                                                    <li>한국외국어대학교</li>
                                                    <li>홍익대학교</li>
                                                </ul>
                                            </div>
                                        )
                                    }
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
