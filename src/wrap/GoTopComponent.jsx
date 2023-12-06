import React from "react";
import './scss/GoTop.scss';

export default function GoTopComponent(){

    const [isShow, setIsShow] = React.useState(false);


    React.useEffect(()=>{
        window.addEventListener('scroll', function(){
            let isShow = false;
            if(this.window.scrollY >= 1900){
                isShow = true;
            }
            else {
                isShow = false;
            }
            setIsShow(isShow);
        });
    },[]);

    return(
        <div id="goTop" className={isShow?'on':''}>
            <a href="#wrap"><img src="./images/intro/go_top.png" alt="" /></a>
        </div>
    )
}