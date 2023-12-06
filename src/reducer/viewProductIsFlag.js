
import {createSlice} from '@reduxjs/toolkit';

const initState = {
    isFlag: false
}

const viewProductIsFlagReducer = createSlice({
    name: 'viewProductIsFlag',
    initialState: initState,
    reducers: {
        viewProductIsFlag: (state, action)=>{
            state.isFlag = action.payload;
        }
    }
});

export default viewProductIsFlagReducer.reducer;
export const {viewProductIsFlag} = viewProductIsFlagReducer.actions;