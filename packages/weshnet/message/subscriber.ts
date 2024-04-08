import { Subscription } from "rxjs";

import { processMessage } from "./processEvent";
import { GroupMessageEvent } from "../../api/weshnet/protocoltypes";
import { weshClient } from "../client";
import { bytesFromString } from "../utils";

const messageSubscriptions: Subscription[] = [];

export const subscribeMessages = async (
  groupPk: string,
  ignoreDuplication?: boolean,
) => {
  try {
    await weshClient.client.ActivateGroup({
      groupPk: bytesFromString(groupPk),
    });
    // const messages = weshClient.client.GroupMessageList(config);
    // console.log('groupPK', groupPk);
    // const groupInfo = weshClient.client.GroupDeviceStatus({ groupPk: bytesFromString(groupPk) });
    // const groupInfo2 = await weshClient.client.DebugGroup({ groupPk: bytesFromString(groupPk) });
    // const groupInfo3 = await weshClient.client.GroupInfo({
    //   groupPk: bytesFromString(groupPk),
    // });

    // console.log("groupInfo3", groupInfo3.group?.groupType);
    // console.log

    // const groupInfoObserver = {
    //   next: (data: GroupDeviceStatus) => {
    //     console.log(data);
    //   },
    //   error: (err: any) => {
    //     console.log(err)
    //   },
    //   complete: () => {
    //     console.log("complete");
    //   }
    // }
    // groupInfo.subscribe(groupInfoObserver);bytesFromString(
    console.log("groupPk", groupPk);
    const messages = weshClient.client.GroupMessageList({
      groupPk: bytesFromString(groupPk),
      untilNow: true,
    });

    const newInfo = await weshClient.client.DebugGroup({
      groupPk: bytesFromString(groupPk),
    });
    console.log('new info', newInfo);
    const observer = {
      next: (data: GroupMessageEvent) => {
        try {
          console.log("message", data);
          processMessage(data, groupPk);
        } catch (err) {
          console.error("subscribe message next err:", err);
        }
      },
      error: (e: any) => {
        console.error("get message err", e);
      },
      complete: () => {
        console.log("complete");
      },
    };

    messages.subscribe(observer);

    // messageSubscriptions.push(subscription);
  } catch (err) {
    console.error("get messages err", err);
  }
};

export const unsubscribeMessageSubscriptions = () => {
  messageSubscriptions.forEach((subscriber) => {
    subscriber?.unsubscribe?.();
  });
};
