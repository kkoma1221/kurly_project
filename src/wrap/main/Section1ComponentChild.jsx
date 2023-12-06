// section1Component의 자식컴포넌트 Section1ComponentChild
// slide-wrap > slide > view data 생성

import React from 'react';

export default function Section1ComponentChild({슬라이드, n}){

    const slideWrap = React.useRef(); // 선택자 돔요소(태그) 선택 .slide-wrap

    // 슬라이드 slide-wrap 너비 자동화  scss > width: 100% * 24
    // 선택자변수.style.width = `${100 * state.n}%` // 부모컴포넌트, state 상태변수인 경우
    // 선택자 > 리엑트 요소 선택자 React.useRef()
    // React.useRef().style.width = `${100 * n}%`; // 부모컴포넌트에서 n만 가져오는 경우 state. 안씀

    // 슬라이드의 갯수가 들어오면 아래의 이벤트를 실행
    React.useEffect(()=>{
        slideWrap.current.style.width = `${100 * n}%`;
    },[n]); // n의 갯수가 들어오면

    // 메인슬라이드 컨트롤
    // 0. 상태변수
    const [cnt, setCnt] = React.useState(0); // cnt 초기값 0
    const [toggle, setToggle] = React.useState(0);
    const [isArrow, setIsArrow] = React.useState(false);

    // 1. 메인슬라이드 오른쪽 -> 왼쪽 부드럽게 이동
    const mainSlide=()=>{
        slideWrap.current.style.transition = 'all 0.6s ease-in-out'; // 리턴시 속도 변하기 때문에 여기서 style 지정
        slideWrap.current.style.left = `${-100 * cnt}%`; // left 사용하려면 position:relative 설정
        if(cnt!==0){ // cnt가 0이 아닌경우에 리턴. 로딩시 cnt=0, 리턴슬라이드 아직 구현X
            returnSlide();
        }
    }

    // 리턴슬라이드
    const returnSlide=()=>{
        if(cnt>n-2){ // next리턴
            setToggle(1);
            setCnt(1); // return시에 초기값 1, 2번째 이미지 슬라이드로 이동.
            slideWrap.current.style.transition = 'none'; // 속도 없음
            slideWrap.current.style.left = `${-100 * 0}%`; // 처음 슬라이드로 이동
        }
        if(cnt<0){ // prev 리턴
            setToggle(1);
            setCnt(n-2-1); // 마지막 이미지 cnt=21
            slideWrap.current.style.transition = 'none';
            slideWrap.current.style.left = `${-(100*(n-2))}%`;
        }
    }
    
    // 2. 슬라이드 구현하기
    // cnt 상태변수 변경되면 즉시 메인슬라이드 메서드 호출 발생
    React.useEffect(()=>{
        if(toggle===0){ // 리턴이 없는 경우
            mainSlide();
        }
        else { // 리턴이 있는 경우
            setToggle(0); // toggle값 초기화(리턴시 초기화)
            setTimeout(()=>{ // 타이머 동작 시 비동기로 처리(순차적 처리) for 버블 막기위해
                mainSlide();
            }, 100);
        }
    }, [cnt]); // cnt값이 있을 때만 실행

    // 3. 버튼클릭 이벤트
    // 화면이 바뀌는 모든 건 상태관리 변수로 관리
    const onClickNext=(e)=>{
        e.preventDefault();
        setCnt(cnt => cnt+1); // 또는 setCnt(cnt+1);
    }
    const onClickPrev=(e)=>{
        e.preventDefault();
        setCnt(cnt => cnt-1); // 또는 setCnt(cnt-1);
    }

    // 4. 마우스 이벤트
    const onMouseEnterContainer=()=>{
        setIsArrow(true)
    }
    const onMouseLeaveContainer=()=>{
        setIsArrow(false)
    }

    // 5. 자동타이머 4초 간격 자동 실행
    React.useEffect(()=>{
        if(isArrow===false){ // 버튼이 안보일 때에만 자동 타이머 실행, 버튼이 보이면(슬라이드에 마우스 올라가면) 실행 중지 
            let setId = 0;
            setId = setInterval(()=>{
                setCnt(cnt => cnt+1);
            }, 4000);
            return () => clearInterval(setId); // 한줄코딩 화살표 함수, 즉시 실행반환, 실행하고 꼭 리턴하라. for 버블링방지 
        }
    },[isArrow]);

    return (
        <div onMouseEnter={onMouseEnterContainer} onMouseLeave={onMouseLeaveContainer} className="slide-container">
            <div className="slide-view">
                <ul ref={slideWrap} className="slide-wrap">
                    {
                        슬라이드.map((item, idx)=>{
                            return( // 뷰템플릿 / 제이슨 데이터 = model
                                <li className="slide" key={item.번호}>
                                    <img src={`./images/intro/section1/${item.이미지}`} alt="" />
                                </li>
                            )
                        })

                    }
                </ul>
            </div>
            <a href="!#" onClick={onClickNext} className={`next-arrow-btn blind${isArrow?' on':''}`}>next</a>
            <a href="!#" onClick={onClickPrev} className={`prev-arrow-btn blind${isArrow?' on':''}`}>prev</a>
            <span className='page-num-box'><em>{cnt+1>n-2?1:cnt+1}</em><i>/</i><em>{n-2}</em></span>
        </div>
    );
};
