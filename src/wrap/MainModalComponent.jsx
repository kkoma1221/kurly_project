import React from "react";
import './scss/MainModal.scss';
import { useDispatch } from "react-redux";
import { mainModal } from "../reducer/mainModal";

export default function MainModalComponent(){

    const dispatch = useDispatch();

    // 닫기 버튼 클릭이벤트
    const onClickMainCloseBtn=(e)=>{
        e.preventDefault();
        dispatch(mainModal(false));
    }

    // 만료일 1일 설정 (하루 안보기)
    const onClickMainCloseBtnExpires=(e)=>{
        e.preventDefault();
        let toDay = new Date();
        toDay.setDate(toDay.getDate() + 1);
        const obj = {
            id: 'MAIN20231108',
            expires: toDay.getTime()
        }
        localStorage.setItem('KURLY_MAINMODAL_KEY', JSON.stringify(obj));
        dispatch(mainModal(false));
    }

    return(
        <div id="mainModal">
            {/* 페이지 in, out이 들어가게 되면 wrap이 필요함 */}
            <div className="wrap">
                <div className="container">
                    <div className="content">
                        <div className="img-box">
                            <a href="!#"><img src="./images/modal/main_modal.jpg" alt="" /></a>
                        </div>
                        <div className="btn-box">
                            <button onClick={onClickMainCloseBtnExpires} >오늘 하루 안 보기</button>
                            <button onClick={onClickMainCloseBtn}>닫기 </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}