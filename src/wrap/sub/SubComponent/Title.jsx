import React from 'react';

export default function Title({타이틀}){
    return (
        <div className="title">
            <div className="title-image">
                <a href="!#"><img src={`./images/sub/sub1/${타이틀.이미지}`} alt="" /></a>
            </div>
            <h2 className='title-text'>{타이틀.텍스트}</h2>
        </div>
    );
};
