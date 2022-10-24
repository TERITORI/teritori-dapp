import { useCallback, useEffect, useState } from "react";

import { Activity, ActivityRequest } from "../api/marketplace/v1/marketplace";
import { backendClient } from "../utils/backend";

// FIXME: use react-query

export const useActivity = (req: ActivityRequest) => {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [total, setTotal] = useState(0);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const refresh = useCallback(() => {
    setRefreshIndex((i) => i + 1);
  }, []);
  useEffect(() => {
    const effect = async () => {
      try {
        const stream = backendClient.Activity(req);
        const act: Activity[] = [];
        let i = 0;
        await stream.forEach(({ activity, total }) => {
          if (i === 0) {
            setTotal(total);
          } else if (activity) {
            act.push(activity);
          }
          i++;
        });
        setActivity(act);
      } catch (err) {
        console.error(err);
      }
    };
    effect();
  }, [req.collectionId, req.nftId, req.limit, req.offset, refreshIndex]);
  return { activity, total, refreshActivity: refresh };
};
