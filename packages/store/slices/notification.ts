import {
  EntityState,
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { z } from "zod";

import { RootState } from "../store";

const NotificationType = z.enum(["message", "group-join", "contact-request"]);

export const Notification = z.object({
  id: z.string(),
  senderId: z.string().optional(),
  groupId: z.string().optional(),
  type: NotificationType,
  timestamp: z.string().optional(),
  avatar: z.string().optional(),
  isRead: z.boolean(),
  contactId: z.string().optional(),
  rdvSeed: z.string().optional(),
  name: z.string().optional(),
  peerId: z.string().optional(),
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
    setNotificationRequest: (
      state,
      action: PayloadAction<TypeNotification>,
    ) => {
      notificationEntityAdapter.setOne(state, action.payload);
    },
  },
});

export const { setNotificationList, setNotificationRequest, readNotification } =
  notificationSlice.actions;

export const notificationReducer = notificationSlice.reducer;
