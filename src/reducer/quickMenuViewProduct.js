import { createSlice } from "@reduxjs/toolkit";

const initState = {
    quickMenuViewProduct: []
}

const quickMenuViewProductReducer = createSlice({
    name: 'quickMenuViewProduct',
    initialState: initState,
    reducers: {
        quickMenuViewProduct: (state, action)=>{
            state.quickMenuViewProduct = action.payload;
        }
    }
});

export default quickMenuViewProductReducer.reducer;
export const {quickMenuViewProduct} = quickMenuViewProductReducer.actions;