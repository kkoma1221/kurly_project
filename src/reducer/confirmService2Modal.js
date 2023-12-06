
import { createSlice } from "@reduxjs/toolkit";

const initState = {
    isConfirmService2Modal : false
}

const confirmService2ModalReducer = createSlice({
    name: 'confirmService2Modal',
    initialState: initState,
    reducers : {
        confirmService2Modal : (state, action)=>{
            state.isConfirmService2Modal = action.payload;
        }
    }
});

export default confirmService2ModalReducer.reducer;
export const {confirmService2Modal} = confirmService2ModalReducer.actions;