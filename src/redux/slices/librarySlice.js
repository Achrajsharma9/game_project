// src/redux/slices/librarySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  savedGames: []
};

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addGame: (state, action) => {
      // Check if game already exists in library
      if (!state.savedGames.some(game => game.id === action.payload.id)) {
        state.savedGames.push(action.payload);
      }
    },
    removeGame: (state, action) => {
      state.savedGames = state.savedGames.filter(game => game.id !== action.payload);
    }
  }
});

export const { addGame, removeGame } = librarySlice.actions;
export default librarySlice.reducer;