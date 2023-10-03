import { Platform } from "react-native";

import { weshClient } from "./client";
import { weshConfig } from "./config";
import { getConversationName } from "./messageHelpers";
import { handleMetadata } from "./processData";
import { bytesFromString, decodeJSON, stringFromBytes } from "./utils";
import {
  selectConversationById,
  selectLastIdByKey,
  setLastId,
  setMessageList,
  updateConversationById,
  updateMessageReaction,
} from "../../store/slices/message";
import { store } from "../../store/store";
import { Conversation, Message } from "../../utils/types/message";
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
            const conversation = selectConversationById(groupPk)(
              store.getState()
            );

            data.message = decodeJSON(data.message);

            // @ts-ignore
            const message: Message = {
              id: stringFromBytes(data.eventContext?.id),
              ...data.message,
            };
            const isSender =
              message.senderId === stringFromBytes(weshConfig.config.accountPk);

            switch (message.type) {
              case "reaction": {
                store.dispatch(
                  updateMessageReaction({
                    groupPk,
                    data: message,
                  })
                );
                break;
              }

              case "group-create": {
                store.dispatch(
                  updateConversationById({
                    id: groupPk,
                    name: message?.payload?.metadata?.groupName,
                  })
                );

                break;
              }
              case "group-invite": {
                const formattedMessage = isSender
                  ? `You invited ${getConversationName(
                      conversation
                    )} to a group ${message?.payload?.metadata?.groupName}`
                  : `${getConversationName(
                      conversation
                    )} invited you to a group ${
                      message?.payload?.metadata?.groupName
                    }`;

                if (!message.payload) {
                  message.payload = { files: [], message: "" };
                }
                message.payload.message = formattedMessage;

                store.dispatch(
                  setMessageList({
                    groupPk,
                    data: message,
                  })
                );

                break;
              }
              case "group-join": {
                console.log("group-join", message);
                const newMember = [];

                if (
                  message?.payload?.metadata?.contact?.id &&
                  stringFromBytes(weshConfig.config.accountPk) !==
                    message?.payload?.metadata?.contact?.id
                ) {
                  newMember.push(message?.payload?.metadata?.contact);
                }

                const conversation = selectConversationById(groupPk)(
                  store.getState()
                );
                store.dispatch(
                  updateConversationById({
                    id: groupPk,
                    name: message?.payload?.metadata?.groupName,
                    members: [...(conversation.members || []), ...newMember],
                  })
                );
                store.dispatch(
                  setMessageList({
                    groupPk,
                    data: message,
                  })
                );
                break;
              }
              case "read": {
                const data: Partial<Conversation> = {};
                const lastReadId = message?.payload?.metadata?.lastReadId;
                const lastReadBy = message?.payload?.metadata?.lastReadBy;
                if (
                  lastReadBy === stringFromBytes(weshConfig.config.accountPk)
                ) {
                  data.lastReadIdByMe = lastReadId;
                } else {
                  data.lastReadIdByContact = lastReadId;
                }

                store.dispatch(
                  updateConversationById({
                    id: groupPk,
                    ...data,
                  })
                );
                break;
              }
              default: {
                store.dispatch(
                  setMessageList({
                    groupPk,
                    data: message,
                  })
                );
              }
            }
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

        handleMetadata(data);
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
