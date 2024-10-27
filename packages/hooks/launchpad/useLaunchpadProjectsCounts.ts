import { useQuery } from "@tanstack/react-query";

import {
  LaunchpadProjectsCountsRequest,  
} from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { mustGetLaunchpadClient } from "@/utils/backend";

export const useLaunchpadProjectsCounts = (
  req: LaunchpadProjectsCountsRequest,
) => {
  const { setToast } = useFeedbacks();
  const networkId = req.networkId;

  const { data, ...other } = useQuery(
    ["launchpadProjectsCounts", networkId],
    async () => {
      try {
        const client = mustGetLaunchpadClient(networkId);
        if (!client) {
          throw new Error("Missing client");
        }

        const { statusCounts } = await client.LaunchpadProjectsCounts(req);
        return statusCounts;
      } catch (err: any) {
        const title = "Error getting launchpad projects counts";
        const message = err instanceof Error ? err.message : `${err}`;
        console.error(title, message);
        setToast({
          mode: "normal",
          type: "error",
          title,
          message,
        });
      }
    },
    {
      enabled: !!networkId,
    },
  );
  return { statusCounts: data, ...other };
};
