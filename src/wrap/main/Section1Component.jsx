import React from "react";
import './scss/Section1.scss'
import Section1ComponentChild from './Section1ComponentChild';
import axios from "axios";

export default function Section1Component(){
    const[state, setState] = React.useState({
        슬라이드: [],
        n: 0 // 슬라이드 전체 갯수변수 , 초기값 0 또는 ''
    });

    //외부파일(데이터) 가져오기
    // 비동기식 방식 처리
    // axios(); 패키지 AXIOS REST API 설치, controller
    // npm i axios <= axios 설치하기
    // axios 구현하기 

    React.useEffect(()=>{ // 로딩시에
        // axios().then().catch(); // 비동기식 코딩. 순차적으로 처리 then(정상실행) catch( 오류가 났을 때 실행, 예외처리)
        axios({ // 외부파일 가져옴
            url: './data/intro/section1.json',
            method: 'GET' // 받을 땐 get

        })
        .then((result)=>{ //성공하면 결과를 보내줌
            // console.log("AXIOS 성공");
            // console.log(result);
            // console.log(result.data);
            setState({
                ...state,
                슬라이드: result.data.slide, // json파일 이름 
                n: result.data.slide.length
            });
        })  
        .catch((error)=>{ // 오류가 생기면
            console.log("AXIOS 오류" + error);
        })
    },[]); // ,[] 공백처리 > 한번만 수행하고 끝, 없으면 계속 수행

    return(
        <section id="section1">
            <Section1ComponentChild 슬라이드={state.슬라이드} n={state.n}/>
        </section>
    )
}