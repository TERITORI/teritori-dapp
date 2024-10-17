import { useQuery } from "@tanstack/react-query";

import {
  LaunchpadProject,
  LaunchpadProjectByIdRequest,
  LaunchpadProjectByIdResponse,
} from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { mustGetLaunchpadClient } from "@/utils/backend";

export const useLaunchpadProjectById = (req: LaunchpadProjectByIdRequest) => {
  const { setToast } = useFeedbacks();
  const networkId = req.networkId;
  // const userAddress = req.userAddress;
  const collectionId = req.projectId;

  const { data, ...other } = useQuery<LaunchpadProject | null>(
    [
      "launchpadProjectById",
      collectionId,
      networkId,
      // , userAddress
    ],
    async () => {
      try {
        const client = mustGetLaunchpadClient(networkId);
        if (
          !client
          // || !userAddress
        ) {
          return null;
        }
        const response: LaunchpadProjectByIdResponse =
          await client.LaunchpadProjectById(req);
        return response.project || null;
      } catch (e: any) {
        console.error("Error getting launchpad project: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error getting launchpad project",
          message: e.message,
        });
        return null;
      }
    },
  );
  return { launchpadProject: data, ...other };
};
