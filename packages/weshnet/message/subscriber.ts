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
const subscribers: { [key: string]: boolean } = {};

export const subscribeMessages = async (groupPk: string) => {
  try {
    const lastId = selectLastIdByKey(store.getState(), groupPk);

    const config: Partial<GroupMessageList_Request> = {
      groupPk: bytesFromString(groupPk),
    };
    let uniqKey = groupPk;

    if (lastId) {
      config.sinceId = bytesFromString(lastId);
      uniqKey += "sinceId";
    } else {
      config.untilNow = true;
      config.reverseOrder = true;
      uniqKey += "untilNow";
    }

    if (subscribers[uniqKey]) {
      return;
    }

    subscribers[uniqKey] = true;

    let newLastId: string | undefined;

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
              newLastId = id;
              isLastIdSet = true;
            }

            if (lastId) {
              store.dispatch(
                setLastId({
                  id: groupPk,
                  value: id,
                }),
              );
              newLastId = id;
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

          if (newLastId) {
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
