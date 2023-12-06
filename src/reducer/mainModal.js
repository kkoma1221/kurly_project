
import { createSlice } from "@reduxjs/toolkit";

const initState = {
    isMainModal: true
}

const mainModalReducer = createSlice({
    name: 'mainModal',
    initialState: initState,
    reducers : {
        mainModal: (state, action)=>{
            state.isMainModal = action.payload;
        }
    }
});

export default mainModalReducer.reducer;
export const {mainModal} = mainModalReducer.actions;