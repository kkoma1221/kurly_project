// 리듀서 객체(Object) 생성하기
import { createSlice } from "@reduxjs/toolkit";

const initState = {
    isAddress: false,
}

const isAddressReducer = createSlice({
    name: 'isAddress',
    initialState: initState,
    reducers: {
        isAddress : (state, action)=>{
            state.isAddress = action.payload;
        }
    }
});

export default isAddressReducer.reducer;
export const { isAddress } = isAddressReducer.actions;