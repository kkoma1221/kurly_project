import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom"; // 비구조화{} 형식으로 가져와서 사용
import TopModalComponent from "./wrap/TopModalComponent.jsx";
import HeaderComponent from "./wrap/HeaderComponent.jsx";
import MainComponent from "./wrap/MainComponent.jsx";
import Sub1Component from "./wrap/sub/Sub1Component.jsx";
import Sub2Component from "./wrap/sub/Sub2Component.jsx";
import Sub3Component from "./wrap/sub/Sub3Component.jsx";
import Sub4Component from "./wrap/sub/Sub4Component.jsx";
import Sub5SignupComponent from "./wrap/sub/Sub5SignupComponent.jsx";
import Sub6LoginComponent from "./wrap/sub/Sub6LoginComponent.jsx";
import Sub6LogInIdSearchComponent from "./wrap/sub/Sub6LogInIdSearchComponent.jsx";
import Sub6LogInPwSearchComponent from "./wrap/sub/Sub6LogInPwSearchComponent.jsx";
import Sub6LogInIdPwSearchResultComponent from "./wrap/sub/Sub6LogInIdPwSearchResultComponent.jsx";
import Sub6LogInIdPwResetComponent from "./wrap/sub/Sub6LogInIdPwResetComponent.jsx";
import Sub7NoticeComponent from "./wrap/sub/Sub7NoticeComponent.jsx";
import Sub7NoticeInsertFormComponent from "./wrap/sub/Sub7NoticeInsertFormComponent.jsx";
import Sub7NoticeViewComponent from "./wrap/sub/Sub7NoticeViewComponent.jsx";
import Sub7NoticeUpdateComponent from "./wrap/sub/Sub7NoticeUpdateComponent.jsx";
import Sub7AdminSigninComponent from "./wrap/sub/Sub7AdminSigninComponent.jsx";
import Sub7AdminSignupComponent from "./wrap/sub/Sub7AdminSignupComponent.jsx";
import Sub7AdminIdSearchComponent from "./wrap/sub/Sub7AdminIdSearchComponent.jsx";
import Sub7AdminIdSearchResultComponent from "./wrap/sub/Sub7AdminIdSearchResultComponent.jsx";
import Sub7AdminPwSearchComponent from "./wrap/sub/Sub7AdminPwSearchComponent.jsx";
import Sub7AdminPwResetComponent from "./wrap/sub/Sub7AdminPwResetComponent.jsx";
import FooterComponent from "./wrap/FooterComponent"; // 확장자 안써도 됨.
import MainModalComponent from "./wrap/MainModalComponent.jsx";
import QuickMenuComponent from "./wrap/QuickMenuComponent.jsx";
import GoTopComponent from "./wrap/GoTopComponent.jsx";
import ConfirmModalComponent from "./wrap/ConfirmModalComponent.jsx";
import PostcodeComponent from "./wrap/PostcodeComponent.jsx";
import ConfirmService1ModalComponent from "./wrap/ConfirmService1ModalComponent.jsx";
import ConfirmService2ModalComponent from './wrap/ConfirmService2ModalComponent.jsx';
import ConfirmService3ModalComponent from './wrap/ConfirmService3ModalComponent.jsx';
import { useSelector, useDispatch } from "react-redux";
import { mainModal } from "./reducer/mainModal.js";
import { topModal } from "./reducer/topModal.js";
import { address } from "./reducer/address.js";
import { signIn } from "./reducer/signIn.js";

 
export default function WrapComponent(){

    const selector = useSelector((state)=>state); // 한줄 코딩
    const dispatch = useDispatch();

    // console.log(selector.signIn.로그인정보);

    // 새로고침해도 로그인 정보 유지
    React.useEffect(()=>{
        // 새로고침해도 상태관리 변수에 계속 로그인 정보를 유지하도록 localStorage 데이터를 가져온다.
        if(localStorage.getItem('KURLY_SIGNIN_INFORMATION')!==null){
            const result = JSON.parse(localStorage.getItem('KURLY_SIGNIN_INFORMATION'));
            // console.log(result);
            dispatch(signIn(result));
        }
    },[]);


    // 로딩시 또는 새로고침하면 세션저장소 주소1, 주소2 값 가져온다
    // 그리고 리덕스 상태관리에 저장한다.
    // 그러면 새로고침해도 주소를 계속 유지시킨다.
    React.useEffect(()=>{
        if(selector.signIn.로그인정보===null && sessionStorage.getItem('KURLY_ADDRESS_KEY')!==null){
            const result = JSON.parse(sessionStorage.getItem('KURLY_ADDRESS_KEY'));
            // const 주소 = `${result.주소1} ${result.주소2}`;
            const 주소 = {
                주소1: result.주소1,
                주소2: result.주소2
            }
            dispatch(address(주소));
        }
        else if(selector.signIn.로그인정보!==null){
            const 주소 = {
                주소1: selector.signIn.로그인정보.주소.split('.')[0],
                주소2: selector.signIn.로그인정보.주소.split('.')[1]===undefined?'':selector.signIn.로그인정보.주소.split('.')[1]
            }
            dispatch(address(주소));
            //console.log(selector.signIn.로그인정보.주소);
        }
    },[selector.signIn.로그인정보]);

    // 2. main modal 유효기간 확인 유지하기
    React.useEffect(()=>{
        let toDay = new Date();
        if(localStorage.getItem('KURLY_MAINMODAL_KEY')!==null){
            const result = JSON.parse(localStorage.getItem('KURLY_MAINMODAL_KEY'));
            if(toDay <= result.expires){
                dispatch(mainModal(false));
            }
            else{
                dispatch(mainModal(true));
            }
        }
        return;
    },[]);


    // topModal 유효기간 확인 유지하기
    React.useEffect(()=>{
        let toDay = new Date();

        if(localStorage.getItem('KURLY_TOPMODAL_KEY')!==null){
            const result = JSON.parse(localStorage.getItem('KURLY_TOPMODAL_KEY'));
            // console.log(result.expires);
            // console.log(new Date(result.expires));
            if(toDay <= result.expires){ // 남은 날짜가 오늘 날짜보다 작으면, 날짜가 남았으면
                dispatch(topModal(false));
            }
            else{
                dispatch(topModal(true));
            }
        }
    },[]);
    
    return (
        <div id="wrap">
                { selector.topModal.isTopModal && <TopModalComponent/> }
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                    <Routes>
                        <Route path="/" element={<HeaderComponent />}> 
                            <Route index element={<MainComponent />} /> 
                            <Route path="/index" element={<MainComponent />} />
                            <Route path="/sub1" element={<Sub1Component />} />
                            <Route path="/sub2" element={<Sub2Component />} />
                            <Route path="/sub3" element={<Sub3Component />} />
                            <Route path="/sub4" element={<Sub4Component/>} />
                            <Route path="/sub5" element={<Sub5SignupComponent />} />
                            
                            <Route path="/sub6" element={<Sub6LoginComponent/>} /> 
                            <Route path='/sub6IdSearch' element={<Sub6LogInIdSearchComponent />} />
                            <Route path='/sub6PwSearch' element={<Sub6LogInPwSearchComponent />} />
                            <Route path='/sub6IdPwSearchResult' element={<Sub6LogInIdPwSearchResultComponent />} />
                            <Route path='/sub6PwReset' element={<Sub6LogInIdPwResetComponent />} />

                            <Route path="/sub7" element={<Sub7NoticeComponent/>} />
                            <Route path="/sub7NoticeInsert" element={<Sub7NoticeInsertFormComponent />} />
                            <Route path='/sub7View' element={<Sub7NoticeViewComponent />} />
                            <Route path='/sub7Update' element={<Sub7NoticeUpdateComponent />} />

                            <Route path='/sub7AdminSignin' element={<Sub7AdminSigninComponent />} />
                            <Route path='/sub7AdminSignup' element={<Sub7AdminSignupComponent />} />
                            <Route path='/sub7AdminIdSearch' element={<Sub7AdminIdSearchComponent/>} />
                            <Route path='/sub7AdminIdSearchResult' element={<Sub7AdminIdSearchResultComponent />} />
                            <Route path='/sub7AdminPwSearch' element={<Sub7AdminPwSearchComponent />} />
                            <Route path='/sub7AdminPwUpdate' element={<Sub7AdminPwResetComponent/>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
                <FooterComponent />
                {
                    selector.mainModal.isMainModal && <MainModalComponent />
                }
                <QuickMenuComponent />
                <GoTopComponent />
                {
                    selector.confirmModal.isConfirmModal && <ConfirmModalComponent />
                }
                {
                    selector.isAddress.isAddress && <PostcodeComponent />
                }
                {
                    selector.confirmService1Modal.isConfirmService1Modal && <ConfirmService1ModalComponent />
                }
                {
                    selector.confirmService2Modal.isConfirmService2Modal && <ConfirmService2ModalComponent />
                }
                {
                    selector.confirmService3Modal.isConfirmService3Modal && <ConfirmService3ModalComponent />
                }
        </div>
    )
}
