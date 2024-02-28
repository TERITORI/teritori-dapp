import {
  EntityState,
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { z } from "zod";

import { RootState } from "../store";

const NotificationType = z.enum([
  "message",
  "accept-contact",
  "reject-contact",
  "group-invite",
  "group-join",
  "group-leave",
  "contact-request",
]);

export const Notification = z.object({
  id: z.string(),
  senderId: z.string(),
  groupId: z.string(),
  type: NotificationType,
  timestamp: z.string(),
  isRead: z.boolean(),
});

export type TypeNotification = z.infer<typeof Notification>;

const notificationEntityAdapter = createEntityAdapter<TypeNotification>();
const notificationSelectors = notificationEntityAdapter.getSelectors();

export interface NotificationState {
  notifications: EntityState<TypeNotification>;
}

export const selectNotificationList = (state: RootState) =>
  notificationSelectors.selectAll(state.notifications);

export const selectTotalNotification = (state: RootState) =>
  notificationSelectors.selectTotal(state.notifications);

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
    setNotificationList: (state, action: PayloadAction<TypeNotification[]>) => {
      notificationEntityAdapter.setAll(state, action.payload);
    },
  },
});

export const { setNotificationList, readNotification } =
  notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
