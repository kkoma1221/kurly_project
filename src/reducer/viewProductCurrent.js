
import { createSlice } from "@reduxjs/toolkit";

const initState = {
    current: {}
}

const viewProductCurrentReducer = createSlice({
    name: 'viewProductCurrent',
    initialState: initState,
    reducers: {
        viewProductCurrent: (state, action)=>{
            state.current = action.payload;
        }
    }
});

export default viewProductCurrentReducer.reducer;
export const {viewProductCurrent} = viewProductCurrentReducer.actions;