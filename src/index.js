import React from 'react';
import ReactDOM from 'react-dom/client';
import WrapComponent from './WrapComponent.jsx';
// 3. reducer, Porvider, createStore 임포트하기
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import isAddress from './reducer/isAddress.js';
import address from './reducer/address.js';
import confirmModal from './reducer/confirmModal.js';
import confirmService1Modal from './reducer/confirmService1Modal.js';
import confirmService2Modal from './reducer/confirmService2Modal.js';
import confirmService3Modal from './reducer/confirmService3Modal.js';
import mainModal from './reducer/mainModal.js';
import topModal from './reducer/topModal.js';
import quickMenuViewProduct from './reducer/quickMenuViewProduct.js';
import viewProductCurrent from './reducer/viewProductCurrent.js';
import viewProductIsFlag from './reducer/viewProductIsFlag.js';
import signIn from './reducer/signIn.js';


// 4. 스토어(store) 생성
let store = configureStore({
  reducer : {
    isAddress, // 가져와서 그냥 바로 쓸 때는 한 번만 써도 됨 isAddress: isAddress
    address,
    confirmModal,
    confirmService1Modal,
    confirmService2Modal,
    confirmService3Modal,
    mainModal,
    topModal,
    quickMenuViewProduct,
    viewProductCurrent,
    viewProductIsFlag,
    signIn
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store} >
      <WrapComponent />
    </Provider>
  </React.StrictMode>
);

