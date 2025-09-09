// src/features/likes/likesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likesByPostId: {} // { [postId]: { liked: boolean, count: number } }
};

export const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const { postId, currentCount } = action.payload;
      const liked = state.likesByPostId[postId]?.liked || false;
      state.likesByPostId[postId] = {
        liked: !liked,
        count: liked ? currentCount - 1 : currentCount + 1,
      };
    },
    setLikes: (state, action) => {
      const { postId, liked, count } = action.payload;
      state.likesByPostId[postId] = { liked, count };
    }
  }
});

export const { toggleLike, setLikes } = likesSlice.actions;
export default likesSlice.reducer;
