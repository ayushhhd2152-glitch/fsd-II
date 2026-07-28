import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Post {
  id: string;
  title: string;
  body: string;
  platform: string;
  pinned: boolean;
  createdAt: string;
}

interface PostsState {
  posts: Post[];
  status: 'idle' | 'succeeded';
  error: string | null;
}

const initialPosts: Post[] = [
  {
    id: '1',
    title: 'Launch plan shared',
    body: 'A cross-platform post covering launch milestones for this week.',
    platform: 'x',
    pinned: true,
    createdAt: '2026-07-27',
  },
  {
    id: '2',
    title: 'Community digest',
    body: 'Highlights from the latest community feedback session.',
    platform: 'linkedin',
    pinned: false,
    createdAt: '2026-07-26',
  },
  {
    id: '3',
    title: 'Repository update',
    body: 'New automation and release notes are available now.',
    platform: 'github',
    pinned: false,
    createdAt: '2026-07-25',
  },
];

const initialState: PostsState = {
  posts: initialPosts,
  status: 'succeeded',
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.unshift(action.payload);
      },
      prepare(post: Omit<Post, 'id' | 'createdAt' | 'pinned'>) {
        return {
          payload: {
            ...post,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString().slice(0, 10),
            pinned: false,
          },
        };
      },
    },
    togglePin(state, action: PayloadAction<string>) {
      state.posts = state.posts.map((post) =>
        post.id === action.payload ? { ...post, pinned: !post.pinned } : post,
      );
    },
    removePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export const { addPost, togglePin, removePost } = postsSlice.actions;
export default postsSlice.reducer;
