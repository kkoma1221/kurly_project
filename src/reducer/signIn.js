
import { createSlice } from "@reduxjs/toolkit";

const initState = {
    로그인정보 : null
}

const signInReducer = createSlice({
    name: 'signIn',
    initialState: initState,
    reducers: {
        signIn: (state, action)=>{
            state.로그인정보 = action.payload
        }
    }
});

export default signInReducer.reducer;
export const {signIn} = signInReducer.actions;
