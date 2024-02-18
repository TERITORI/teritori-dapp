import { Platform } from "react-native";
import { Subscription } from "rxjs";

import { processMessage } from "./processEvent";
import {
  GroupMessageList_Request,
  GroupMessageEvent,
} from "../../api/weshnet/protocoltypes";
import { selectLastIdByKey, setLastId } from "../../store/slices/message";
import { store } from "../../store/store";
import { weshClient } from "../client";
import { bytesFromString, stringFromBytes } from "../utils";

const messageSubscriptions: Subscription[] = [];

export const subscribeMessages = async (groupPk: string) => {
  try {
    const lastId = selectLastIdByKey(store.getState(), groupPk);

    const config: Partial<GroupMessageList_Request> = {
      groupPk: bytesFromString(groupPk),
    };

    if (lastId) {
      config.sinceId = bytesFromString(lastId);
    } else {
      config.untilNow = true;
      config.reverseOrder = true;
    }

    try {
      await weshClient.client.ActivateGroup({
        groupPk: bytesFromString(groupPk),
      });
      const messages = weshClient.client.GroupMessageList(config);
      let isLastIdSet = false;

      const observer = {
        next: (data: GroupMessageEvent) => {
          try {
            // FIXME: messages should be dispatched as actions and processed inside a reducer

            const id = stringFromBytes(data.eventContext?.id);

            if (lastId === id) {
              return;
            }
            if (!lastId && !isLastIdSet) {
              store.dispatch(
                setLastId({
                  id: groupPk,
                  value: id,
                }),
              );
              isLastIdSet = true;
            }

            if (lastId) {
              store.dispatch(
                setLastId({
                  id: groupPk,
                  value: id,
                }),
              );
            }

            processMessage(data, groupPk);
          } catch (err) {
            console.error("subscribe message next err:", err);
          }
        },
        error: (e: any) => {
          console.error("get message err", e);
        },
        complete: async () => {
          messageSubscriptions.splice(
            messageSubscriptions.indexOf(subscription),
            1,
          );

          const lastId = selectLastIdByKey(store.getState(), groupPk);
          if (Platform.OS === "web" && lastId) {
            subscribeMessages(groupPk);
          } else {
            setTimeout(() => subscribeMessages(groupPk), 3500);
          }
        },
      };

      const subscription = messages.subscribe(observer);

      messageSubscriptions.push(subscription);
    } catch (err) {
      console.error("get messages err", err);
    }
  } catch (err) {
    console.error("subscribe message", err);
  }
};

export const unsubscribeMessageSubscriptions = () => {
  messageSubscriptions.forEach((subscriber) => {
    subscriber?.unsubscribe?.();
  });
};
