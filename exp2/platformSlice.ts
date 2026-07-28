import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Platform {
  id: string;
  name: string;
  count: number;
  accent: string;
}

interface PlatformState {
  selectedPlatform: string;
  platforms: Platform[];
}

const initialState: PlatformState = {
  selectedPlatform: 'All',
  platforms: [
    { id: 'x', name: 'X', count: 0, accent: '#60a5fa' },
    { id: 'linkedin', name: 'LinkedIn', count: 0, accent: '#8b5cf6' },
    { id: 'github', name: 'GitHub', count: 0, accent: '#f59e0b' },
  ],
};

export const syncPlatformStats = createAsyncThunk(
  'platform/syncPlatformStats',
  async (_: void, { dispatch, getState }) => {
    const state = getState() as RootState;
    const counts = state.posts.posts.reduce<Record<string, number>>((accumulator, post) => {
      accumulator[post.platform] = (accumulator[post.platform] ?? 0) + 1;
      return accumulator;
    }, {});

    dispatch(updatePlatformStats(counts));
  },
);

const platformSlice = createSlice({
  name: 'platform',
  initialState,
  reducers: {
    setSelectedPlatform(state, action: PayloadAction<string>) {
      state.selectedPlatform = action.payload;
    },
    updatePlatformStats(state, action: PayloadAction<Record<string, number>>) {
      state.platforms = state.platforms.map((platform) => ({
        ...platform,
        count: action.payload[platform.id] ?? 0,
      }));
    },
  },
});

export const { setSelectedPlatform, updatePlatformStats } = platformSlice.actions;
export const selectPlatformOptions = (state: RootState) => ['All', ...state.platform.platforms.map((platform) => platform.id)];
export default platformSlice.reducer;
