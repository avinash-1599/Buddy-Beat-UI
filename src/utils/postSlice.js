import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: { posts: [] }, 
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        addNewPost: (state, action) => {
            return { ...state, posts: [action.payload, ...state.posts] }; 
        },  
        updatePostLikes: (state, action) => {
            const { postId, likes } = action.payload;
            const post = state.posts.find((p) => p._id === postId);
            if (post) {
                post.likes = likes; // Update with latest array from API
            }
        },     
        removePost: (state, action) => {
            state.posts = state.posts.filter(post => post._id !== action.payload);
        }
    }
});

export const { setPosts, addNewPost, updatePostLikes, removePost } = postSlice.actions;
export default postSlice.reducer;