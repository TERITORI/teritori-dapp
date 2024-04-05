import { Subscription } from "rxjs";

import { processMetadata } from "./processEvent";
import {
  GroupMetadataEvent,
  GroupMetadataList_Request,
} from "../../api/weshnet/protocoltypes";
import { weshClient } from "../client";

const metadataSubscriptions: Subscription[] = [];

export const subscribeMetadata = async (
  groupPk: Uint8Array | undefined,
  ignoreDuplication?: boolean,
) => {
  if (!groupPk) {
    return;
  }
  // const lastId = selectLastIdByKey(store.getState(), "metadata");
  const config: Partial<GroupMetadataList_Request> = {
    groupPk,
  };

  try {
    const metadata = weshClient.client.GroupMetadataList(config);
    await weshClient.client.ActivateGroup(config);

    const myObserver = {
      next: (data: GroupMetadataEvent) => {
        processMetadata(data);
      },
      error(e: Error) {
        console.log("group meta errror", e);
      },
      complete: () => {
        console.log("complete meta");
      },
    };
    const subscription = metadata.subscribe(myObserver);

    metadataSubscriptions.push(subscription);
  } catch (err) {
    console.error("get metadata err", err);
  }
};

export const unsubscribeMetadataSubscriptions = () => {
  metadataSubscriptions.forEach((subscription) => {
    subscription?.unsubscribe?.();
  });
};
