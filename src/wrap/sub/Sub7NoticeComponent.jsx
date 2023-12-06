import React from 'react';
import './scss/sub7.scss';
import Sub7NoticeLeftComponent from './Sub7NoticeLeftComponent.jsx';
import Sub7NoticeComponentChild from './Sub7NoticeComponentChild.jsx';
import axios from 'axios';

export default function Sub7NoticeComponent() {
    
    const [state, setState] = React.useState({
        공지사항: [],
        공지카운트: 0,
        n: 0
    });

    React.useEffect(()=>{
        axios({
            url: 'http://kkoma1221.dothome.co.kr/kurly_project/green_kurly_notice_table_select.php',
            method: 'GET'
        })
        .then((res)=>{
            if(res.status===200){
                // console.log('axios 성공!');
                // console.log(res);
                // console.log(res.data);
                setState({
                    ...state,
                    공지사항: res.data
                });
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    },[]);

    React.useEffect(()=>{
        if(state.공지사항.length>0){
            let cnt = 0;
            state.공지사항.map((item, idx)=>{
                if(item.타입==='공지'){
                    cnt++;
                }
            });
            setState({
                ...state,
                공지카운트: cnt,
                n: state.공지사항.length
            });
        }
    },[state.공지사항]);

    return (
        <main id='sub7'>
            <section id='section1'>
                <div className="container">
                    <div className="content">
                        {/* left 박스 */}
                        <Sub7NoticeLeftComponent />
                        {/* right 박스 */}
                        <Sub7NoticeComponentChild 공지사항={state.공지사항} 공지카운트={state.공지카운트} n={state.n} />
                    </div>
                </div>
            </section>
        </main>
    );
};
