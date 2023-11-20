import { useQuery } from "@tanstack/react-query";

import { Activity, ActivityRequest } from "../api/marketplace/v1/marketplace";
import { parseNetworkObjectId } from "../networks";
import { getMarketplaceClient } from "../utils/backend";

const initialData = {
  activities: [],
  total: 0,
};

export const useActivity = (req: ActivityRequest) => {
  const { data, refetch } = useQuery(
    ["activities", req.collectionId, req.nftId, req.limit, req.offset],
    async () => {
      try {
        const objectId = req.collectionId || req.nftId;
        const [network] = parseNetworkObjectId(objectId);
        const backendClient = getMarketplaceClient(network?.id);
        if (!backendClient) {
          return initialData;
        }

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
    },
  );

  return { ...data, refetch };
};
