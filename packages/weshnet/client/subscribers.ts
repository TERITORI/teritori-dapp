import { Platform } from "react-native";

import { weshClient } from "./client";
import { processMessage } from "./processMessage";
import { processMetadata } from "./processMetadata";
import { bytesFromString, stringFromBytes } from "./utils";
import { selectLastIdByKey, setLastId } from "../../store/slices/message";
import { store } from "../../store/store";
import {
  GroupMessageList_Request,
  GroupMessageEvent,
  GroupMetadataEvent,
  GroupMetadataList_Request,
} from "../protocoltypes";

export const subscribeMessages = async (groupPk: string) => {
  try {
    const lastId = selectLastIdByKey(groupPk)(store.getState());

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
      const messages = await weshClient.client.GroupMessageList(config);
      let isLastIdSet = false;

      const observer = {
        next: (data: GroupMessageEvent) => {
          try {
            const id = stringFromBytes(data.eventContext?.id);

            if (lastId === id) {
              console.log("already stored; test test", id);
              return;
            }
            if (!lastId && !isLastIdSet) {
              store.dispatch(
                setLastId({
                  key: groupPk,
                  value: id,
                })
              );
              isLastIdSet = true;
            }

            if (lastId) {
              store.dispatch(
                setLastId({
                  key: groupPk,
                  value: id,
                })
              );
            }

            processMessage(data, groupPk);
          } catch (err) {
            console.log("subscribe message next err:", err);
          }
        },
        error: (e: any) => {
          console.log("get message error...", e);
        },
        complete: async () => {
          console.log("get message complete");
          const lastId = selectLastIdByKey(groupPk)(store.getState());
          if (Platform.OS === "web" && lastId) {
            subscribeMessages(groupPk);
          } else {
            setTimeout(() => subscribeMessages(groupPk), 3500);
          }
        },
      };
      return messages.subscribe(observer);
    } catch (err) {
      console.log("get messages err", err);
    }
  } catch (err) {
    console.log("subscribe message", err);
  }
};

export const subscribeMetadata = async (
  groupPk: Uint8Array,
  ignoreLastId = false
) => {
  let lastId = selectLastIdByKey("metadata")(store.getState());
  const config: Partial<GroupMetadataList_Request> = {
    groupPk,
  };
  if (ignoreLastId) {
    lastId = undefined;
  }

  if (lastId) {
    config.sinceId = bytesFromString(lastId);
  } else {
    config.untilNow = true;
    config.reverseOrder = true;
  }

  try {
    const metadata = await weshClient.client.GroupMetadataList(config);
    let isLastIdSet = false;

    const myObserver = {
      next: (data: GroupMetadataEvent) => {
        const id = stringFromBytes(data.eventContext?.id);
        if (lastId === id) {
          return;
        }
        if (!lastId && !isLastIdSet) {
          store.dispatch(
            setLastId({
              key: "metadata",
              value: id,
            })
          );
          isLastIdSet = true;
        }

        if (lastId) {
          store.dispatch(
            setLastId({
              key: "metadata",
              value: id,
            })
          );
        }

        processMetadata(data);
      },
      error(e: Error) {
        if (e.message.includes("since ID not found")) {
          subscribeMetadata(groupPk, true);
        }
      },
      complete: () => {
        console.log("metadata subscrbe complete");
        subscribeMetadata(groupPk);
      },
    };
    metadata.subscribe(myObserver);
  } catch (err) {
    console.log("get metadatas err", err);
  }
};
