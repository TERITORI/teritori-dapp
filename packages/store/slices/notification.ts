import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Search {
  notification: any[];
}

const initialState: Search = {
  notification: [],
};

export const selectNotification = (state: RootState) =>
  state.notification.notification;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action: any) => {
      state.notification = [action.payload, ...state.notification];
    },
  },
});

export const { setNotification } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
