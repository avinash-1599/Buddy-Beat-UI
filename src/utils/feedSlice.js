import { createSlice } from "@reduxjs/toolkit";


const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        removeUserFromFeed: (state, action) => {      // state has existing data present in it.
            const newFeed = state.filter(user => user._id !== action.payload);
            return newFeed;
        }
    }
})

export const {addFeed, removeUserFromFeed} = feedSlice.actions;

export default feedSlice.reducer;