import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: null, // This holds the current logged-in user object
    reducers: {
        addUser: (state, action) => {
            return action.payload; // Replace with the new user object
        },
        removeUser: () => {
            return null;
        },
        togglePostSave: (state, action) => {
            if (!state) return;
          
            const { postId } = action.payload;
            const isAlreadySaved = state.savedPosts?.includes(postId);
          
            if (isAlreadySaved) {
              state.savedPosts = state.savedPosts.filter(id => id !== postId);
            } else {
              state.savedPosts = [...(state.savedPosts || []), postId];
            }
          }
    }
});

export const { addUser, removeUser, togglePostSave } = userSlice.actions;

export default userSlice.reducer;