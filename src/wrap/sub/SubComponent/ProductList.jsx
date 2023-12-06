import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { viewProductCurrent } from '../../../reducer/viewProductCurrent';
import { viewProductIsFlag } from '../../../reducer/viewProductIsFlag';
import { quickMenuViewProduct } from '../../../reducer/quickMenuViewProduct';

export default function ProductList({상품, 필터, filterDeleteMethod, 이미지경로}){

    const dispatch = useDispatch();
    const selector = useSelector((state)=>state);

    const onClickDeleteEvent=(e, item)=>{
        e.preventDefault();
        filterDeleteMethod(item); // 삭제데이터 전송 to 부모컴포넌트 through 메소드
    }

    // 1. 최근 본 상품 클릭 이벤트
    const onClickViewProduct =(e, item, path)=>{
        e.preventDefault();

        let altImg = "d4f339c4-5758-42ac-80fa-9a434fe6f3ce.jpeg";
        let obj = {
            번호: item.번호,
            이미지: `${process.env.PUBLIC_URL}${path}${이미지경로}/${이미지경로==='section5'?altImg:item.이미지}`, // 상대주소 => 절대주소 ${process.env.PUBLIC_URL} 안쓰면 배포시 문제가 됨.
            제품명: item.제품명,
            정가: item.정가, // 장바구니 계산 시 원데이터 필요
            할인율: item.할인율, // 장바구니 계산 시 원데이터 필요
            판매가: Math.round(item.정가 * (1 - item.할인율)),
            상품설명: item.상품설명,
            제조사: item.제조사,
            제조일시: item.제조일시,
            판매처: item.판매처,
            보관방법: item.보관방법,
            배송: item.배송,
            일시: new Date().getTime() // 최근본 상품 클릭시 상품정보의 날짜와 시간 저장
        }
        // console.log(obj);
        dispatch(viewProductCurrent(obj));
    }

    // 2. viewProduct.current 최근 현재 본 상품 상태변수 변경되면 (값이 들어오면) 
    React.useEffect(()=>{
        // localStorage에 저장하기 => 이전에 저장된 데이터를 가져와서 지금데이터와 결합, 누적보관
        // 1. localStorage(키 'KURLY_VIEW_PRODUCT')에 저장된 데이터 없는 경우 => 배열로 1행(record)만 저장한다.
        let imsi = [];
        if(localStorage.getItem('KURLY_VIEW_PRODUCT')===null){
            if(Object.keys(selector.viewProductCurrent.current).length > 0){ // 빈객체 확인
                imsi = [selector.viewProductCurrent.current]; //[{...}] 점검, [] 곽괄호해야 배열로 데이터가 누적 보관이 됨.
                localStorage.setItem('KURLY_VIEW_PRODUCT', JSON.stringify(imsi));
                dispatch(viewProductIsFlag(!selector.viewProductIsFlag.isFlag));
            }
        }
        // 2. localStorage에 저장된 데이터 있는 경우 => 가져와서 누적 보관(Stack)
        else {
            let result = JSON.parse(localStorage.getItem('KURLY_VIEW_PRODUCT'));
            // 중복검사 => 제외
            let filterResult = result.map((item)=>item.번호===selector.viewProductCurrent.current.번호? true : false);
            if(filterResult.includes(true)!==true){
                if(Object.keys(selector.viewProductCurrent.current).length > 0){
                    result = [selector.viewProductCurrent.current, ...result]
                    // localStorage 저장소 저장하기
                    localStorage.setItem('KURLY_VIEW_PRODUCT', JSON.stringify(result));
                    dispatch(viewProductIsFlag(!selector.viewProductIsFlag.isFlag));
                }
            }
        }
    },[selector.viewProductCurrent.current]);

    // 3. 최근 본 상품 상태변수에 localStorage 저장소 데이터 가져와서 저장
    React.useEffect(()=>{
        // 저장소 데이터 가져오기
        if(localStorage.getItem('KURLY_VIEW_PRODUCT')!==null){
            let result = JSON.parse(localStorage.getItem('KURLY_VIEW_PRODUCT'));
            if(result.length > 0){
                dispatch(quickMenuViewProduct(result));
            }
        }
    },[selector.viewProductIsFlag.isFlag]);

    return (
        <div className="product-list">
            {
                필터.length > 0 && (
                    <div className="filter-box">
                    {
                        (   필터.map((item, idx)=>{
                            return (
                                <span key={idx}>
                                    <em>{item}</em>
                                    <a href="!#" onClick={(e)=>onClickDeleteEvent(e, item)}><img src="./images/sub/icon_del.svg" alt="" /></a>
                                </span>
                            )
                        })
                        )
                    }
                </div>
                )
            }
            <ul>
                {
                    상품.length > 0 && ( // 개수가 아무것도 없을 때는 오류가 발생
                        상품.map((item, idx)=>{
                            return(
                                <li className={`list list${idx+1}`} key={item.번호}>
                                    <div className="col-gap" onClick={(e)=>onClickViewProduct(e, item, './images/sub/')}>
                                        <div className="img-box">
                                            <a href="!#"><img src={`./images/sub/${이미지경로}/${item.이미지}`} alt="" /></a>
                                        </div>
                                        <div className="text-box">
                                            <p><a href="!#"><img src="./images/intro/icon_cart2.svg" alt="" />담기</a></p>
                                            <h6>{item.배송}</h6>
                                            <h3>{item.제품명}</h3>
                                            <p className='description'>{item.상품설명}</p>
                                            <h4>{item.할인율!==0?`${item.정가.toLocaleString('ko-KO')}원`:''}</h4>
                                            {/* item.할인율!==0 && <h4>{item.정가.toLocaleString(ko-KO)}원</h4> */}
                                            <h5>
                                                <em>{item.할인율!==0?`${Math.round(item.할인율*100)}%`:''}</em>
                                                <strong className={item.할인율 === 0?'on':''}>{Math.round(item.정가*(1-item.할인율)).toLocaleString('ko-KO')}원</strong>
                                            </h5>
                                            <h6><img src="./images/intro/review.svg" alt="" />{item.리뷰}</h6>
                                            <h6>{item.유형}</h6>
                                            <h6>{item.무료배송}</h6>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    )
                }
            </ul>
        </div>
    );
};
