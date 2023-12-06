import React from "react";
import './scss/QuickMenu.scss';
import { useSelector } from "react-redux";
// import $ from "jquery"; // jQuery 선언 $ 기호로 바꾸면 $사용 가능

export default function QuickMenuComponent(){

    const selector = useSelector((state)=>state);

    const quickMenu = React.useRef();
    const [isFixed, setIsFixed] = React.useState(false);

    React.useEffect(()=>{

        window.addEventListener('scroll', function(){
            let isFixed = false;
            if(this.window.scrollY > 400){
                isFixed = true;
            }
            else {
                isFixed = false;
            }

            setIsFixed(isFixed);
        });

    },[]);

    // 퀵메뉴 위 아래 슬라이드 구현 기획 & 설계
    // 1. slideWrap 애니메이션 구현 => 선택자 useRef();
    // 2. 상태변수 => cnt, setCnt
    // 3-1. 아래(down버튼) 클릭이벤트 => onClickEvent cnt++ 올라간다
    // 3-2. 위(up버튼) 클릭이벤트 => onClickEvent cnt-- 내려간다
    // 4. 메인슬라이드(slideWrap) 메서드 애니메이션 구현
    // 5. 상태변수 cnt 값이 변경되면 즉시 실행하는 useEffect(); 훅(함수, 메서드) 구현 => 메인슬라이드 함수 호출

    const refSlideWrap = React.useRef(); // 1. 선택자
    const [cnt, setCnt] = React.useState(0); // 2. 상태변수

    // 클릭 이벤트 메서드 등록(이벤트e, 방향 direction) 매개변수 이용해서 구현
    const onClickUpDownEvent=(e, direction)=>{
        e.preventDefault();
        // console.log(direction);
        if(direction==='down'){ // = 대입(값이 변수에 적용됨) / === 비교연산자(같은지 다른지 비교)
            if(cnt > selector.quickMenuViewProduct.quickMenuViewProduct.length-4){ // quickMenuViewProduct.length(전체이미지개수) 화면에 보이는 이미지 3 + 1 = 4
                return;
            }
            else{
                setCnt(cnt+1);
            }
        }
        else if(direction==='up'){
            if(cnt > 0){ // 0보다 크면 감소
                setCnt(cnt-1); 
            }
            else{
                return;
            }
        }
    }

    // 4. 메인슬라이드 메서드
    const mainSlide=()=>{
        try{
            refSlideWrap.current.style.transition = 'all 0.3s ease-in-out';
            refSlideWrap.current.style.transform = `translateY(${-88.95 * cnt}px)`;
        }
        catch(e){}
    }

    // 5.
    React.useEffect(()=>{
        mainSlide();
    },[cnt]);

    return(
        <div id="quickMenu" className={isFixed?'on':''} ref={quickMenu}>
            <ul>
                <li id="row1">
                    <a href="!#"><img src="./images/intro/deliveryInfo.png" alt="" /></a>
                </li>
                <li id="row2">
                    <ul>
                        <li><a href="!#">등급별 혜택</a></li>
                        <li><a href="!#">레시피</a></li>
                    </ul>
                </li>
                {
                    selector.quickMenuViewProduct.quickMenuViewProduct.length > 0 && (
                    <li id="row3">
                        <ul>
                            <li><button onClick={(e)=>onClickUpDownEvent(e, 'up')} className="up-arrow-btn"></button></li>
                            <li><h2>최근 본 상품</h2></li>
                            <li>
                                <ul ref={refSlideWrap} className="slide-wrap">
                                    {
                                        selector.quickMenuViewProduct.quickMenuViewProduct.map((item)=>{
                                            return(
                                                <li key={item.번호}>
                                                    <a href="!#">
                                                        <img src={item.이미지} alt="" />
                                                    </a>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </li>
                            <li><button onClick={(e)=>onClickUpDownEvent(e, 'down')} className="down-arrow-btn"></button></li>
                        </ul>
                    </li>
                    )
                }
            </ul>
        </div>
    )
}