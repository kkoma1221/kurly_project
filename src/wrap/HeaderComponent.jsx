import React from "react";
import './scss/Header.scss';
import {Link, Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { address } from "../reducer/address";
import { isAddress } from "../reducer/isAddress";
import { signIn } from "../reducer/signIn";

export default function HeaderComponent(){

    const selector = useSelector((state)=>state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // 라우트에서 지원하기때문에 React. 안쓴다.

    // 선택자 변수 선언
    const row3 = React.useRef();
    
    // 상태관리변수 선언
    // state 변수, setState 변수값 변경
    const [state, setState] = React.useState({
        isBar: false,
        isCustomer: false,
        isMap: false,
        isFixed: false,
        isSigninTooltip: false
    });

    // 윈도우 스크롤 이벤트 
    // React.useEffect(()=>{}); //(윈도우 전체, 특정영역이 아닌경우) resize, scroll event
    React.useEffect(()=>{

        let row3Top = row3.current.offsetTop+42; // 초기값 = 142 (row3 top높이 + top modal 높이)

        // 이벤트 window.addEventListener
        window.addEventListener('scroll', function(){
            //console.log(window.scrollY);
            if(window.scrollY >= row3Top){ // row3의 offsettop()값
                setState({
                    ...state,
                    isFixed: true
                });
            }
            else {
                setState({
                    ...state,
                    isFixed: false
                });
            }
        });
    },[]);

    // row1
    const onMouseEnterIsCustomer=(e)=>{
        e.preventDefault()
        setState({
            ...state,
            isCustomer: true
        });
    }

    const onMouseLeaveIsCustomer=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            isCustomer: false
        });
    }

    //마우스엔터(오버) 이벤트 onMouseEnter (권장) / onMouseOver (오류생길 가능성 높아)
    const onMouseEnterIsBar=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            isBar: true
        });
    }

    //마우스리브(아웃) 이벤트 onMouseLeave (권장) / onMouseOut
    const onMouseLeaveIsBar=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            isBar: false
        });
    }

    const onMouseEnterIsMap=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            isMap: true
        });
    }

    const onMouseLeaveIsMap=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            isMap: false
        });
    }

    // 배송지 변경 클릭이벤트
    const onClickAddressUpdate=(e)=>{
        e.preventDefault();
        dispatch(isAddress(true));
    }
    
    const onMouseEnterSignIn=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            isSigninTooltip: true
        });
    }

    const onMouseLeaveSignIn=(e)=>{
        e.preventDefault();
        setState({
            ...state,
            isSigninTooltip: false
        });
    }

    const onClickLogOut=(e)=>{
        e.preventDefault(); // 버튼이 아니기 때문에 안해도 됨
        dispatch(signIn(null)); // 로그인정보 삭제 => 로그인정보 삭제 동기화
        dispatch(address(''));
        localStorage.removeItem('KURLY_SIGNIN_INFORMATION');
        navigate('/index'); // 메인페이지로 이동
    }

    return(
        <>
            <header id="header">
                <div className="row1 row">
                    <div className="container">
                        <div className="content">
                            <aside id="aside">
                                {
                                    selector.signIn.로그인정보===null && (
                                    <>
                                        <Link to="/sub5" className="on">회원가입</Link>
                                        <i> | </i>
                                        <Link to="/sub6">로그인</Link>
                                    </>
                                    )
                                }
                                {
                                    selector.signIn.로그인정보!==null && (
                                        <div className="signin-box" onMouseLeave={onMouseLeaveSignIn}>
                                            <Link to="/sub6" className="on signIn" onMouseEnter={onMouseEnterSignIn}>
                                                <span>{selector.signIn.로그인정보.회원등급}</span>
                                                <span>{selector.signIn.로그인정보.이름} 님</span>
                                                <i className="new"></i>
                                                <i className="arrow"></i>
                                            </Link>
                                            {
                                                state.isSigninTooltip && (
                                                    <div className="sign-tooltip" >
                                                        <ul>
                                                            <li><Link to="!#">주문 내역</Link></li>
                                                            <li><Link to="!#">선물 내역</Link></li>
                                                            <li><Link to="!#">찜한 상품</Link></li>
                                                            <li><Link to="!#">배송지 관리</Link></li>
                                                            <li><Link to="!#">상품 후기</Link></li>
                                                            <li><Link to="!#">결제수단·컬리페이</Link></li>
                                                            <li><Link to="!#">상품 문의</Link></li>
                                                            <li><Link to="!#">적립금·컬리캐시</Link></li>
                                                            <li><Link to="!#">쿠폰</Link></li>
                                                            <li><Link to="!#">개인 정보 수정</Link></li>
                                                            <li><Link to="!#"><span>나의 컬리 스타일</span><i className="arrow"></i></Link></li>
                                                            <li><Link to="!#">컬리멤버스</Link></li>
                                                            <li><a href="!#" onClick={onClickLogOut}>로그아웃</a></li>{/* a를 버튼으로 사용한다. Link가 아닌 */}
                                                        </ul>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                <i> | </i>
                                <Link to="/sub7"
                                    onMouseEnter={onMouseEnterIsCustomer}
                                > 고객센터 <img src="./images/intro/ico_down_16x10.png" alt="" /></Link>
                                {/* && 참이면 보이고, 거짓이면 보이지 않음 () 해줘도 되고 안해줘도 됨. 구분을 위한 것 
                                        a 태그에 마우스 올리면 나타나고, 서브메뉴를 벗어나면 사라지게 함 */}
                                {
                                    state.isCustomer && (<div 
                                                            className="customer-center" 
                                                            onMouseLeave={onMouseLeaveIsCustomer}>
                                        <ul>
                                            <li><Link to="/sub7">공지사항</Link></li>
                                            <li><a href="!#">자주하는 질문</a></li>
                                            <li><a href="!#">1:1 문의</a></li>
                                            <li><a href="!#">대량주문 문의</a></li>
                                        </ul>
                                    </div> )
                                }
                                {
                                    selector.signIn.로그인정보===null && (
                                        <>
                                            <i>|</i>
                                            <Link to="/sub7AdminSignin">MyAdmin</Link>
                                        </>
                                    )
                                }
                            </aside>
                        </div>
                    </div>
                </div>
                <div className="row2 row">
                    <div className="container">
                        <div className="content">
                            <div className="left">
                                <Link to="/index">
                                    <img src="./images/intro/icon_logo.svg" alt="" />
                                    <span>마켓컬리</span>
                                </Link>
                                <i>|</i>
                                <a href="!#">뷰티컬리<img src="./images/intro/icon_new.svg" alt="" /></a>
                            </div>
                            <div className="center">
                                <input type="text" name="search" id="search" /* value={state.검색어} */ placeholder="검색어를 입력해주세요"/>
                                <button><img src="./images/intro/icon_search_purple.svg" alt="" /></button>
                            </div>
                            <div className="right">
                                <span>
                                    <a href="!#" onMouseEnter={onMouseEnterIsMap}><img src="./images/intro/icon_map.svg" alt="" /></a>
                                    <a href="!#"><img src="./images/intro/icon_heart.svg" alt="" /></a>
                                    <a href="!#"><img src="./images/intro/icon_cart.svg" alt="" /></a>
                                </span>
                                { state.isMap && (
                                    <div className="map-address" onMouseLeave={onMouseLeaveIsMap}>
                                        {
                                            selector.address.주소==='' && (
                                                <ul>
                                                    <li><strong>배송지 등록</strong>하고</li>
                                                    <li>구매 가능한 상품을 확인하세요!</li>
                                                    <li>
                                                        <a href="!#">로그인</a>
                                                        <button onClick={onClickAddressUpdate}>
                                                            <img src="./images/intro/icon_search_white.png" alt="" />
                                                            <span>주소검색</span>
                                                        </button>
                                                    </li>
                                                </ul>
                                            )
                                        }
                                        {
                                            selector.address.주소!=='' && (
                                                selector.address.주소.주소1!=='' && (
                                                    <ul>
                                                        <li><h4>{`${selector.address.주소.주소1}  ${selector.address.주소.주소2}`}</h4></li>
                                                        <li><h5>{'샛별배송'}</h5></li>
                                                        <li>
                                                            <button className="address-update" onClick={onClickAddressUpdate}>
                                                                <span>배송지 변경</span>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                )
                                            )
                                        }
                                    </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* 기존 클래스에 조건부 추가 > `빽틱`으로 묶고 ${3항 연산자. 변수로 인식} > `${state. ? : }` 공백없이 쓰고 추가될 클래스 이름 앞에만 공백 지정' '
                    ref={} 선택자로 사용하겠다라고 선언 */}
                <div ref={row3} className={`row3 row${state.isFixed?' fixed':''}`}>
                    <div className="container">
                        <div className="content">
                            <div className="left">
                                <a href="!#"
                                    onMouseEnter={onMouseEnterIsBar} 
                                    onMouseLeave={onMouseLeaveIsBar} 
                                    className={state.isBar ? "on" : ""}
                                >
                                    {/* is---- 논리변수
                                        상태변수 isBar 이용 조건부(3항 연산자) 연산 이미지 선택 
                                        변수는 {} 중괄호 안에 넣어서 사용
                                    */}
                                    <img 
                                        src={state.isBar ? "./images/intro/icon_3bar_on.svg":"./images/intro/icon_3bar.svg"}
                                    alt="" />
                                    <span>카테고리</span>
                                </a>
                            </div>
                            <div className="center">
                                <nav> {/* useNavigate() => 송신 / location = useLocation() => 수신 */}
                                    <Link to={{pathname:"./sub1"}} className={location.pathname==='/sub1'?"on":''}>신상품</Link>
                                    <Link to={{pathname:"/sub2", state:{name:"이순신", age:29}}} className={location.pathname==='/sub2'?"on":''}>베스트</Link>
                                    <Link to={{pathname:"./sub3"}} className={location.pathname==='/sub3'?"on":''}>알뜰쇼핑</Link>
                                    <Link to={{pathname:"./sub4"}} className={location.pathname==='/sub4'?"on":''}>특가/혜택</Link>
                                </nav>
                            </div>
                            <div className="right">
                                <a href="!#">
                                    <em>샛별・택배</em><span>배송안내</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Outlet /> {/* main을 담아두는 박스 */}

        </> /* 빈태그 로 묶어줌 */
    )
}