
import { createSlice } from "@reduxjs/toolkit";

const initState = {
    isConfirmService3Modal : false
}

const confirmService3ModalReducer = createSlice({
    name: 'confirmService3Modal',
    initialState: initState,
    reducers : {
        confirmService3Modal : (state, action)=>{
            state.isConfirmService3Modal = action.payload;
        }
    }
});

export default confirmService3ModalReducer.reducer;
export const {confirmService3Modal} = confirmService3ModalReducer.actions;