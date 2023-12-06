import React from 'react';
import Section1Component from './main/Section1Component';
import SectionComponent from './main/SectionComponent';
import './scss/Main.scss';
import axios from 'axios';

export default function MainComponent() {
    const [sectionCount, setSectionCount] = React.useState([]);

    React.useEffect(()=>{
        axios({
            url:'./data/intro/section_count.json',
            method:'GET'
        })
        .then((res)=>{
            if(res.status===200){
                setSectionCount(res.data.sectionCount); // res.data => json 파일만 가져온것. 배열 이름도 함께 가져와야 함
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    },[]);


    return (
        <main id="main">
            <Section1Component />
            {   
                sectionCount.length > 0 && (
                sectionCount.map((item)=>{
                return(
                    <SectionComponent num={item} />
            )
        })
        )
    }
        </main>
    );
};
