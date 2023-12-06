import React from 'react';
import './scss/Confirm.scss';
import { useSelector, useDispatch } from 'react-redux';
import { confirmModal } from '../reducer/confirmModal';


export default function ConfirmModalComponent(){

    const selector = useSelector((state)=>state);
    const dispatch = useDispatch();

/*     console.log(selector.isConfirmModal);
    console.log(selector.isConfirmModal.confirmModal.isConfirmModal);
    console.log(selector.isConfirmModal.confirmModal.confirmMsg);
    console.log(selector.isConfirmModal.confirmModal.member); */

    const {confirmMsg} = selector.confirmModal; // 비구조화

    const onClickCloseBtn=(e)=>{
        e.preventDefault();

        if(selector.confirmModal.confirmMsg.includes('회원가입을 진심으로 감사드립니다.')){
            const payload = {
                isConfirmModal: false,
                confirmMsg: '',
                member: true
            }
            dispatch(confirmModal(payload));
        }
        else if(selector.confirmModal.confirmMsg==='비밀번호 변경이 완료되었습니다.'){
            const payload = {
                isConfirmModal: false,
                confirmMsg: '',
                member: false
            }
            dispatch(confirmModal(payload));
            setTimeout(()=>{ // 비동기식 순차방식(ASYN) => 순차적으로 실행하는 방식
               // navigate('/sub6') // 로그인 컴포넌트로 이동 
               // router로 구현 안된 컴포넌트이어서
               window.location.pathname = '/sub6';
            },100); 
        }
        else if(selector.confirmModal.confirmMsg==='비밀번호(admin) 변경이 완료되었습니다.'){
            const payload = {
                isConfirmModal: false,
                confirmMsg: '',
                member: false
            }
            dispatch(confirmModal(payload));
            setTimeout(()=>{
               window.location.pathname = '/sub7AdminSignin';
            },100); 
        }
        else {
            const obj = {
                isConfirmModal : false,
                confirmMsg: '',
                member: false
            }
            dispatch(confirmModal(obj));
        }
        const htmlEl = document.getElementsByTagName('html')[0];
        htmlEl.classList.remove('on');
    }

    return (
        <div id='confirmModal'>
            <div className="container">
                <div className="confirm-box">
                    <ul>
                        <li>
                            <div className='message-box'>
                                {
                                    confirmMsg.split('\n').map((item)=>{
                                        return(
                                            <p>{item}</p>
                                        )
                                    })
                                }

                            </div>
                        </li>
                        <li>
                            <div className='button-box'>
                                <button onClick={onClickCloseBtn}>확인</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
