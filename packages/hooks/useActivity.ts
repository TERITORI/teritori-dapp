import { useQuery } from "@tanstack/react-query";

import { Activity, ActivityRequest } from "../api/marketplace/v1/marketplace";
import {useBackendClient} from "./useBackendClient";
import {useSelector} from "react-redux";
import {selectSelectedNetworkId} from "../store/slices/settings";

const initialData = {
  activities: [],
  total: 0,
};

export const useActivity = (req: ActivityRequest) => {
  const {backendClient, isForceBackendMainnet} = useBackendClient()

  const { data, refetch } = useQuery(
    ["activities", req.collectionId, req.nftId, req.limit, req.offset, isForceBackendMainnet()],
    async () => {
      try {
        let totalCount = 0;
        const activities: Activity[] = [];
        const stream = backendClient.Activity(req);
        let i = 0;

        await stream.forEach(({ activity, total }) => {
          if (i === 0) {
            totalCount = total;
          } else if (activity) {
            activities.push(activity);
          }
          i++;
        });

        return {
          total: totalCount,
          activities,
        };
      } catch (err) {
        console.error(err);
      }

      return initialData;
    },
    {
      initialData,
    }
  );

  return { ...data, refetch };
};
