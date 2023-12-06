
import {createSlice} from '@reduxjs/toolkit';

const initState = {
    isConfirmService1Modal : false
}

const confirmService1ModalReducer = createSlice({
    name: 'confirmService1Modal',
    initialState: initState,
    reducers: {
        confirmService1Modal: (state, action)=>{
            state.isConfirmService1Modal = action.payload;
        }
    }
});

export default confirmService1ModalReducer.reducer;
export const {confirmService1Modal} = confirmService1ModalReducer.actions;
