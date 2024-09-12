import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface FavoriteState {
  favorites: string[];
}

const initialState: FavoriteState = {
  favorites: [],
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favorites.indexOf(action.payload); // find the doctorId in the list of favorites
      if (index !== -1) {
        state.favorites.splice(index, 1); // Remove the doctor from favorites
      } else {
        state.favorites.push(action.payload); // Add the doctor to favorites
      }
    },
  },
});

export const { toggleFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;

export const selectFavorites = (state: RootState) => state.favorites.favorites;