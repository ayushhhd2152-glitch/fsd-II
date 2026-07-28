import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import platformReducer from '../features/platform/platformSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platform: platformReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
