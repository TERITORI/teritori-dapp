import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";

interface Notification {
  title: string;
  desc: string;
}

interface Search {
  notification: Notification[];
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
    setNotification: (state, action: PayloadAction<Notification>) => {
      state.notification = [action.payload, ...state.notification];
    },
  },
});

export const { setNotification } = notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
