import { processMetadata } from "./processEvent";
import {
  GroupMetadataEvent,
  GroupMetadataList_Request,
} from "../../api/weshnet/protocoltypes";
import { selectLastIdByKey, setLastId } from "../../store/slices/message";
import { store } from "../../store/store";
import { weshClient } from "../client";
import { bytesFromString, stringFromBytes } from "../utils";

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
        }

        if (lastId) {
          store.dispatch(
            setLastId({
              id: "metadata",
              value: id,
            }),
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
        subscribeMetadata(groupPk);
      },
    };
    metadata.subscribe(myObserver);
  } catch (err) {
    console.error("get metadata err", err);
  }
};
