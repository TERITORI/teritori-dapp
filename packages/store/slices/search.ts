import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Search {
  text: string;
}

const initialState: Search = {
  text: "",
};

export const selectSearchText = (state: RootState) => state.search.text;

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
  },
});

export const { setSearchText } = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
