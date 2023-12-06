
import { createSlice } from "@reduxjs/toolkit";

const initState = {
    isTopModal: true
}

const topModalReducer = createSlice({
    name: 'topModal',
    initialState: initState,
    reducers: {
        topModal: (state, action)=>{
            state.isTopModal = action.payload;
        }
    }
});

export default topModalReducer.reducer;
export const {topModal} = topModalReducer.actions;