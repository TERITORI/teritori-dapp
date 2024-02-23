import { Subscription } from "rxjs";

import { processMetadata } from "./processEvent";
import {
  GroupMetadataEvent,
  GroupMetadataList_Request,
} from "../../api/weshnet/protocoltypes";
import { selectLastIdByKey, setLastId } from "../../store/slices/message";
import { store } from "../../store/store";
import { weshClient } from "../client";
import { bytesFromString, stringFromBytes } from "../utils";

const metadataSubscriptions: Subscription[] = [];
const subscribers: { [key: string]: boolean } = {};

export const subscribeMetadata = async (
  groupPk: Uint8Array | undefined,
  ignoreLastId = false,
) => {
  if (!groupPk) {
    return;
  }
  let lastId = selectLastIdByKey(store.getState(), "metadata");
  const config: Partial<GroupMetadataList_Request> = {
    groupPk,
  };
  let uniqKey = stringFromBytes(groupPk);

  if (ignoreLastId) {
    lastId = undefined;
  }

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
    const metadata = weshClient.client.GroupMetadataList(config);
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
              id: "metadata",
              value: id,
            }),
          );
          isLastIdSet = true;
          newLastId = id;
        }

        if (lastId) {
          store.dispatch(
            setLastId({
              id: "metadata",
              value: id,
            }),
          );
          newLastId = id;
        }

        processMetadata(data);
      },
      error(e: Error) {
        if (e.message.includes("since ID not found")) {
          subscribeMetadata(groupPk, true);
        }
      },
      complete: () => {
        metadataSubscriptions.splice(
          metadataSubscriptions.indexOf(subscription),
          1,
        );
        if (newLastId) {
          subscribeMetadata(groupPk);
        } else {
          setTimeout(() => subscribeMetadata(groupPk), 3500);
        }
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
