// src/redux/slices/gamesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGames } from '../../services/api';

export const getGames = createAsyncThunk(
  'games/getGames',
  async (params, thunkAPI) => {
    try {
      return await fetchGames(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  games: [],
  loading: false,
  error: null,
  count: 0,
  filters: {
    search: '',
    genres: [],
    tags: [],
    year: null,
    ordering: null
  },
  page: 1,
};

export const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = {...state.filters, ...action.payload};
      state.page = 1; // Reset to first page when filters change
    },
    setPage: (state, action) => {
      state.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGames.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload.results;
        state.count = action.payload.count;
      })
      .addCase(getGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, setPage } = gamesSlice.actions;
export default gamesSlice.reducer;