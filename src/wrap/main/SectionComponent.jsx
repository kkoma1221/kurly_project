import React from "react";
import './scss/Section.scss';
import SectionComponentChild from "./SectionComponentChild.jsx";
import axios from "axios";

export default function SectionComponent({num}){
    const [state, setState] =React.useState({
        이미지경로: '',
        타이틀: '',
        타이틀옵션: false,
        서브타이틀:'',
        애니메이션: false,
        칸수: 0,
        배너: false,
        제품: [],
        n:0,

        타임세일: {
            타임세일: false,
            타이머일시: '1970-01-01 00:00:00', // 초기값 > 없으면 타이머가 깜박거리는 오류 발생
            세일시간: 0,
            캡션1: '',
            캡션2: '',
            캡션3: ''
        }
    })

    React.useEffect(()=>{
        // 컴포넌트이름을 이용 json파일이름, 이미지경로를 지정
        // let folderName = Section2Component.name.split('Component')[0].toString().toLocaleLowerCase();
        //console.log(Section2Component.name.split('Component'));
        //console.log(folderName); // Section2 => 문자열 => 문자 / 소문자
        let folderName = `section${num}`;
        axios({ 
            url: `./data/intro/${folderName}.json`,
            method: 'GET' 
        })
        .then((result)=>{
            // console.log("AXIOS 성공");

            setState({
                ...state,
                이미지경로: folderName,
                타이틀: result.data.title,
                타이틀옵션: result.data.titleOption,
                서브타이틀: result.data.subTitle,
                애니메이션: result.data.animation,
                칸수: result.data.cols,
                배너: result.data.imageBanner,

                타임세일: {
                    타임세일: result.data.timeSale.timeSale,
                    타이머일시: result.data.timeSale.timeSaleDate,
                    세일시간: result.data.timeSale.timeSaleHours,
                    캡션1: result.data.timeSale.caption1,
                    캡션2: result.data.timeSale.caption2,
                    캡션3: result.data.timeSale.caption3
                },

                제품: result.data.product,
                n: result.data.product.length
            });
        })  
        .catch((error)=>{
            console.log("AXIOS 오류" + error);
        })
    },[])

    return(
        <section id={`section${num}`} className="section">
            <div className="container">
                {/* <div className={`title ${state.타이틀옵션?'':` hide`}`}> */}
                { 
                    state.타이틀옵션 && (
                        <div className="title">
                            <h2><a href="!#">{state.타이틀} <img src="./images/intro/icon_arrow.svg" alt="" /></a></h2>
                            <p>{state.서브타이틀}</p>
                        </div>
                    )
                }
                <div className="content">
                    <SectionComponentChild 타임세일={state.타임세일} 제품={state.제품} n={state.n} 애니메이션={state.애니메이션} 칸수={state.칸수} 배너={state.배너} 이미지경로={state.이미지경로} />
                </div>
            </div>
        </section>
    )
}