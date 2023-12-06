import isAddress from './isAddress';
import address from './address';
import isTopModal from './isTopModal';
import isMainModal from './isMainModal';
import isConfirmModal from './isConfirmModal';
import viewProductCurrent from './viewProductCurrent';
import viewProductIsFlag from './viewProductIsFlag';
import quickMenuViewProduct from './quickMenuViewProduct';
import isConfirmService1Modal from './isConfirmService1Modal';
import isConfirmService2Modal from './isConfirmService2Modal';
import isConfirmService3Modal from './isConfirmService3Modal';
import { combineReducers } from 'redux';

const combineReducer = combineReducers(
    {
    isAddress,
    address,
    isTopModal,
    isMainModal,
    isConfirmModal,
    viewProductCurrent,
    viewProductIsFlag,
    quickMenuViewProduct,
    isConfirmService1Modal,
    isConfirmService2Modal,
    isConfirmService3Modal
    }
);
export default combineReducer;