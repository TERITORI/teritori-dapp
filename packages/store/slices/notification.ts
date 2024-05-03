import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { z } from "zod";

import { RootState } from "../store";

const NotificationType = z.enum([
  "group-invite",
  "contact-request",
  "group-join",
]);

const Notification = z.object({
  id: z.string(),
  senderId: z.string().optional(),
  groupId: z.string().optional(),
  type: NotificationType,
  timestamp: z.string().optional(),
  avatar: z.string().optional(),
  isRead: z.boolean(),
  name: z.string().optional(),
});

export type TypeNotification = z.infer<typeof Notification>;

const notificationEntityAdapter = createEntityAdapter<TypeNotification>();
const notificationSelectors = notificationEntityAdapter.getSelectors();

export const selectNotificationList = (state: RootState) =>
  notificationSelectors.selectAll(state.notifications);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: notificationEntityAdapter.getInitialState(),
  reducers: {
    readNotification: (state, action: PayloadAction<{ id: string }>) => {
      if (action.payload.id) {
        const notification = notificationSelectors.selectById(
          state,
          action.payload.id,
        );

        if (!notification) return;

        notificationEntityAdapter.updateOne(state, {
          id: notification.id,
          changes: {
            isRead: true,
          },
        });
      }
    },
    removeNotification: (state, action: PayloadAction<{ id: string }>) => {
      if (action.payload.id) {
        const notification = notificationSelectors.selectById(
          state,
          action.payload.id,
        );

        if (!notification) return;

        notificationEntityAdapter.removeOne(state, notification.id);
      }
    },
    setNotificationList: (state, action: PayloadAction<TypeNotification[]>) => {
      notificationEntityAdapter.setAll(state, action.payload);
    },
    setNotificationRequest: (
      state,
      action: PayloadAction<TypeNotification>,
    ) => {
      notificationEntityAdapter.setOne(state, action.payload);
    },
  },
});

export const { setNotificationRequest, readNotification } =
  notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
