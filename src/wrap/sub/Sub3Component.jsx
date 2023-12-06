import React from 'react';
import './scss/sub.scss';
import Title from "./SubComponent/Title.jsx";
import Submenu from './SubComponent/Submenu.jsx';
import ProductList from './SubComponent/ProductList';
import axios from 'axios';
import {useLocation, useNavigate} from 'react-router-dom';

export default function Sub3Component() {

    const location = useLocation(); // 받을 때 .getParameter
    // const navigate = useNavigate(); // 보낼 때 <= window.location.pathname = 'http://www.naver.com'

    const [state, setState] = React.useState({
        타이틀: { // 자바스크립트에서는 "" 써도 되고 안써도 됨
            이미지: '',
            텍스트: ''
        },
        서브메뉴:{
            카테고리: [],
            브랜드: {
                가나다순: [],
                상품많은순: []
            },
            가격: [],
            혜택: [],
            유형: [],
            특정상품제외: []
        },
        상품:[],
        필터: [],
        필터삭제: [],
        이미지경로: ''
    });

    // 서브메뉴 체크이벤트로 필터값 가져와서(끌어올리기)
    // 상태관리 변수 필터에 저장하는 메서드
    const filterSetterMethod=(f)=>{
        setState({
            ...state,
            필터: f
        });
    }

    // 필터 삭제 메서드 => 수정내용 즉각 적용
    const filterDeleteMethod=(삭제데이터)=>{
        let 필터 = state.필터;
        let result = 필터.filter((item)=>item!==삭제데이터);
        setState({
            ...state,
            필터: result,
            필터삭제: [...state.필터삭제, 삭제데이터]
        });

        if(result.length<=0){
            sessionStorage.removeItem('KURLY_SUB3_FILTER_ITEM');
        }
    }

    // 필터 변경시(삭제 또는 추가) useEffect 구현
    React.useEffect(()=>{
        // 로컬스토레이지에 저장
        if(state.필터.length > 0){ // 배열의 개수(길이 length)가 0보다 클 때 
            sessionStorage.setItem('KURLY_SUB3_FILTER_ITEM', JSON.stringify(state.필터)); // storage저장소는 반드시 문자열만 저장됨 배열 => 문자열 JSON.stringify
        }
    },[state.필터]);

    React.useEffect(()=>{
        // 세션스토레이지에 저장
        if(state.필터삭제.length > 0){ // 배열에 길이(length)를 세어야하는데
            sessionStorage.setItem('KURLY_SUB3_FILTER_DELETE_ITEM', JSON.stringify(state.필터삭제));    
        }        
    },[state.필터삭제]);


    //외부데이터 가져오기
    React.useEffect(()=>{
        let fileName = location.pathname.split('/')[1];

        axios({
            url:`./data/sub/${fileName}.json`,
            method:'GET'
        })
        .then((res)=>{
            // console.log(res.data);
            if(res.status === 200){
                // 세션storage 저장소 데이터 가져오기

                let result = []; 
                if(sessionStorage.getItem('KURLY_SUB3_FILTER_ITEM')!==null){
                    result = JSON.parse(sessionStorage.getItem('KURLY_SUB3_FILTER_ITEM')); // 배열객체로 변환
                }
                setState({
                    ...state,
                    타이틀: {
                        이미지: res.data.타이틀.이미지,
                        텍스트: res.data.타이틀.텍스트
                    },
                    서브메뉴:{
                        카테고리: res.data.서브메뉴.카테고리,
                        브랜드: {
                            가나다순: res.data.서브메뉴.브랜드.가나다순,
                            상품많은순: res.data.서브메뉴.브랜드.상품많은순
                        },
                        가격: res.data.서브메뉴.가격,
                        혜택: res.data.서브메뉴.혜택,
                        유형: res.data.서브메뉴.유형,
                        특정상품제외: res.data.서브메뉴.특정상품제외
                    },
                    상품: res.data.상품,
                    필터: result, // 세션 저장배열 가져오기
                    이미지경로: fileName
                });
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    },[]);

    return (
        <main id='sub3' className='sub'>
            <section id='section1'>
                <div className="container">

                    <Title 타이틀={state.타이틀} />

                    <div className="content">
                        <div className="left">
                            <div className="gap"> {/* 오른쪽여백 18px 주는 용도 */} 
                                <div className="header">
                                    <h3>필터</h3>
                                    <span>
                                        <img src="./images/sub/icon_refresh.svg" alt="" />
                                        <em>초기화</em>
                                    </span>
                                </div>

                                <Submenu 서브메뉴={state.서브메뉴} filterSetterMethod={filterSetterMethod} 필터={state.필터} />

                            </div>
                        </div>

                        <div className="right">
                            <div className="header">
                                <h3>총 254건</h3>
                                <span>
                                    <a href="!#"><em>추천순</em><img src="./images/sub/question_mark.svg" alt="" /></a>
                                    <a href="!#" className='on'>신상품순</a>
                                    <a href="!#">판매량순</a>
                                    <a href="!#">혜택순</a>
                                    <a href="!#">낮은 가격순</a>
                                    <a href="!#">높은 가격순</a>
                                </span>
                            </div>

                            <ProductList 상품={state.상품} 필터={state.필터} filterDeleteMethod={filterDeleteMethod} 이미지경로={state.이미지경로} />

                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

