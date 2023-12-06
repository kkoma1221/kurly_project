import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { viewProductCurrent } from '../../reducer/viewProductCurrent';
import { viewProductIsFlag } from '../../reducer/viewProductIsFlag';
import { quickMenuViewProduct } from '../../reducer/quickMenuViewProduct'

export default function SectionComponentChild({타임세일, 제품, n, 애니메이션, 칸수, 배너, 이미지경로}){

    const dispatch = useDispatch();
    const selector = useSelector((state)=>state);

    const slideWrap = React.useRef();
    const slide = React.useRef(); // 타이머 칸
    const refSlide = React.useRef([]); // 그 외 선택자 배열
    
    React.useEffect(()=>{
        if(타임세일.타임세일){
            try{
                let slideWidth = 1068 / 칸수;
                slide.current.style.width = `${slideWidth}px`; // 타이머 칸
                for(let i=0; i<n; i++){
                    if(칸수===3 && n===1){
                        refSlide.current[i].style.width = `${slideWidth*2}px`;
                    }
                    else {
                        refSlide.current[i].style.width = `${slideWidth}px`;
                    }

                }
                // 3칸 기준 이미지 1개 => 이미지 너비칸 슬라이드 너비 * 2
            }catch(e){
                return;
            }
        }
        if(배너){
            try{
                let slideWidth = 1068 / 칸수;
                for(let i=0; i<n; i++){
                    refSlide.current[i].style.width = `${slideWidth}px`;
                }
            }catch(e){
                return;
            }
        }
        if(애니메이션){
            try{
                let slideWidth = 1068 / 칸수;
                for(let i=0; i<n; i++){
                    refSlide.current[i].style.width = `${slideWidth}px`;
                }
                slideWrap.current.style.width = `${slideWidth * n}px`;
            }catch(e){
                // console.log(e);
                return;
            }
        }
    },[칸수]);

    // 2. 상태변수 

    const [state, setState] = React.useState({
        isLeftArrow : false,
        isRightArrow : false,
        isLeftShow : false,
        isRightShow : false,
        cnt: 0,
        H: 0, 
        M: 0, 
        S: 0
    });

    // 1. 최근 본 상품 클릭 이벤트
    const onClickViewProduct =(e, item, path)=>{
        e.preventDefault();

        let altImg = "d4f339c4-5758-42ac-80fa-9a434fe6f3ce.jpeg";
        let obj = {
            번호: item.번호,
            이미지: `${process.env.PUBLIC_URL}${path}${이미지경로}/${이미지경로==='section5'?altImg:item.이미지}`, // 상대주소 => 절대주소 ${process.env.PUBLIC_URL} 안쓰면 배포시 문제가 됨.
            제품명: item.제품명,
            정가: item.정가, // 장바구니 계산 시 원데이터 필요
            할인율: item.할인율, // 장바구니 계산 시 원데이터 필요
            판매가: Math.round(item.정가 * (1 - item.할인율)),
            상품설명: item.상품설명,
            제조사: item.제조사,
            제조일시: item.제조일시,
            판매처: item.판매처,
            보관방법: item.보관방법,
            배송: item.배송,
            일시: new Date().getTime() // 최근본 상품 클릭시 상품정보의 날짜와 시간 저장
        }
        console.log(obj);
        dispatch(viewProductCurrent(obj));
    }

    // 2. viewProduct.current 최근 현재 본 상품 상태변수 변경되면 (값이 들어오면) 
    React.useEffect(()=>{
        // localStorage에 저장하기 => 이전에 저장된 데이터를 가져와서 지금데이터와 결합, 누적보관
        // 1. localStorage(키 'KURLY_VIEW_PRODUCT')에 저장된 데이터 없는 경우 => 배열로 1행(record)만 저장한다.
        let imsi = [];
        if(localStorage.getItem('KURLY_VIEW_PRODUCT')===null){
            if(Object.keys(selector.viewProductCurrent.current).length > 0){ // 빈객체 확인
                imsi = [selector.viewProductCurrent.current]; //[{...}] 점검, [] 곽괄호해야 배열로 데이터가 누적 보관이 됨.
                localStorage.setItem('KURLY_VIEW_PRODUCT', JSON.stringify(imsi));
                dispatch(viewProductIsFlag(!selector.viewProductIsFlag.isFlag));
            }
        }
        // 2. localStorage에 저장된 데이터 있는 경우 => 가져와서 누적 보관(Stack)
        else {
            let result = JSON.parse(localStorage.getItem('KURLY_VIEW_PRODUCT'));
            // 중복검사 => 제외
            let filterResult = result.map((item)=>item.번호===selector.viewProductCurrent.current.번호? true : false);
            if(filterResult.includes(true)!==true){
                if(Object.keys(selector.viewProductCurrent.current).length > 0){
                    result = [selector.viewProductCurrent.current, ...result]
                    // localStorage 저장소 저장하기
                    localStorage.setItem('KURLY_VIEW_PRODUCT', JSON.stringify(result));
                    dispatch(viewProductIsFlag(!selector.viewProductIsFlag.isFlag));
                }
            }
        }
    },[selector.viewProductCurrent.current]);

    // 3. 최근 본 상품 상태변수에 localStorage 저장소 데이터 가져와서 저장
    React.useEffect(()=>{
        // 저장소 데이터 가져오기
        if(localStorage.getItem('KURLY_VIEW_PRODUCT')!==null){
            let result = JSON.parse(localStorage.getItem('KURLY_VIEW_PRODUCT'));
            if(result.length > 0){
                dispatch(quickMenuViewProduct(result));
            }
        }
    },[selector.viewProductIsFlag.isFlag]);


    // cnt 변화 감지 => 버튼 이벤트
    // cnt <= 0 이하 좌측화살 버튼 숨김 / cnt > 0 보다 크면 좌측화살 보임
    React.useEffect(()=>{
        if(state.cnt<=0){
            setState({
                ...state,
                isLeftShow: false,
                isRightShow: true
            });
        }
        else if(state.cnt>0 && state.cnt<4){
            setState({
                ...state,
                isLeftShow: true,
                isRightShow: true
            });
        }
        else if(state.cnt>=4){
            setState({
                ...state,
                isLeftShow: true,
                isRightShow: false
            });
        }
    },[state.cnt]);

    // 3. 메인슬라이드 함수
    const mainSlide=()=>{
        slideWrap.current.style.transition = 'all 0.6s ease-in-out';
        slideWrap.current.style.left = `${-1068 * state.cnt}px`; 
    }

    // 5. 슬라이드 애니메이션 구현
    React.useEffect(()=>{
        mainSlide();
    }, [state.cnt]);

    const onMouseEnterLeftArrow=()=>{
        setState({
            ...state,
            isLeftArrow: true
        });
    }

    const onMouseEnterRightArrow=()=>{
        setState({
            ...state,
            isRightArrow: true
        });
    }

    const onMouseLeaveLeftArrow=()=>{
        setState({
            ...state,
            isLeftArrow: false
        });
    }

    const onMouseLeaveRightArrow=()=>{
        setState({
            ...state,
            isRightArrow: false
        });
    }

    // 4-1. 다음 슬라이드 카운트 클릭이벤트
    const onClickNextBtn=(e)=>{
        e.preventDefault();
        if(state.cnt >= 4){
            setState({
                ...state,
                cnt: 4
            });
        }
        else {
            setState({
                ...state,
                cnt: state.cnt+1
            });
        }

    }
    // 4-2. 이전 슬라이드 카운트 클릭이벤트
    const onClickPrevBtn=(e)=>{
        e.preventDefault();
        if(state.cnt === 0){
            setState({
                ...state,
                cnt: 0,
            });
        }
        else {
            setState({
                ...state,
                cnt:state.cnt-1
            });
        }
    }

    // 5. 카운트 타이머
    React.useEffect(()=>{
        // console.log(JSON.stringify(타임세일.타이머일시));
        // console.log(타임세일.타이머일시);
        if(타임세일.타임세일){
            const setId = setInterval(function(){
            
                let timeSale = 타임세일.타이머일시;
                let timeHours = 타임세일.세일시간;
                let start = new Date( timeSale );
                    start.setHours( start.getHours() + timeHours ); 
                let now = new Date(); 
                let countTime = start - now; 
                let H = 0; 
                let M = 0;
                let S = 0;
    
                // 타임세일 종료 시점 조건문
                if(now >= start){
                    clearInterval(setId);
                    H= 0;
                    M= 0;
                    S= 0;
                }
                else {
                    H= Math.floor(countTime/(60*60*1000)) % 24;
                    M= Math.floor(countTime/(60*1000)) % 60; 
                    S= Math.floor(countTime/(1000)) % 60; 
                }
    
                setState({
                    ...state,
                    H: H < 10 ? `0${H}`: H,
                    M: M < 10 ? `0${M}`: M,
                    S: S < 10 ? `0${S}`: S
                });
            },1000); // 로딩시에 1초에 한번씩 카운트 돌아감
        }
    },[타임세일, 제품]);


    return (
        <div className="slide-container">
            <div className="slide-view">
                <ul className="slide-wrap" ref={slideWrap}>
                {
                    타임세일.타임세일 && (
                    <li ref={slide} className="slide slide1 timerSlide">
                    <div className="col-gap">
                        <div className="text-box">
                            <h2>{타임세일.캡션1}</h2>
                            <h3>{타임세일.캡션2}</h3>
                            <h4>
                                <span className='icon-timer'>
                                    <img src="./images/intro/icon_timer.svg" alt="" />
                                </span>
                                <span className='count-timer'>
                                    <strong>{state.H}</strong>
                                    <i>:</i>
                                    <strong>{state.M}</strong>
                                    <i>:</i>
                                    <strong>{state.S}</strong>      
                                </span>
                            </h4>
                            <h5>{타임세일.캡션3}</h5>
                        </div>
                    </div>
                    </li>
                    )
                }
                {   
                    제품.map((item, idx)=>{
                        return(
                            <li ref={(element)=> refSlide.current[idx] = element} className={`slide slide${idx}`} key={item.번호}>
                                <div className="col-gap" onClick={(e)=>onClickViewProduct(e, item, './images/intro/')}>
                                    <div className="img-box">
                                        <a href="!#"><img src={`./images/intro/${이미지경로}/${item.이미지}`} alt="" /></a>
                                    </div>
                                    {
                                        !배너 && (
                                        <div className="text-box">
                                            <p><a href="!#"><img src="./images/intro/icon_cart2.svg" alt="" />담기</a></p>
                                            <h3>{item.제품명}</h3>
                                            <p className='description'>{item.상품설명}</p>
                                            {/* 금액 3자리마다 ,콤마 찍기 .toLocaleString('ko-KO') */}
                                            <h4>{item.정가.toLocaleString('ko-KO')}원</h4>
                                            <h5><em>{Math.round(item.할인율*100)}%</em><strong>{Math.round(item.정가*(1-item.할인율)).toLocaleString('ko-KO')}원</strong></h5>
                                            <h6><img src="./images/intro/review.svg" alt="" />{item.리뷰}</h6>
                                        </div>
                                        )
                                    }
                                </div>
                            </li>
                        )
                    })             
                    }
                </ul>
            </div>
            {
                애니메이션 && (
                    <a
                        href="!#"
                        onMouseEnter={onMouseEnterLeftArrow}
                        onMouseLeave={onMouseLeaveLeftArrow}
                        onClick={onClickPrevBtn}
                        className={`sec2-left-arrow${state.isLeftShow?' on':''}`}>
                        <img src={`./images/intro/${state.isLeftArrow?'icon_circle_left_arrow_purple.svg':'icon_circle_left_arrow_black.svg'}`} alt="" />
                    </a>
                )
            }
            {
                애니메이션 && (
                    <a
                        href="!#"
                        onMouseEnter={onMouseEnterRightArrow}
                        onMouseLeave={onMouseLeaveRightArrow}
                        onClick={onClickNextBtn}
                        className={`sec2-right-arrow${state.isRightShow?' on':''}`}>
                        <img src={`./images/intro/${state.isRightArrow?'icon_circle_left_arrow_purple.svg':'icon_circle_left_arrow_black.svg'}`} alt="" />
                    </a>
                )
            }

        </div>

    );
};
