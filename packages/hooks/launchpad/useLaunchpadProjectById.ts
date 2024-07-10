import { useQuery } from "@tanstack/react-query";

import {
  LaunchpadProject, LaunchpadProjectByIdRequest,
} from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { mustGetLaunchpadClient } from "@/utils/backend";

export const useLaunchpadProjectById = (req: LaunchpadProjectByIdRequest) => {
  const { setToast } = useFeedbacks();
  const networkId = req.networkId;
  const userAddress = req.userAddress;
  const collectionId = req.collectionId;

  return useQuery(
    ["launchpadProjectById", collectionId, networkId, userAddress],
    async () => {
      let launchpadProject: LaunchpadProject | undefined;

      try {
        const client = mustGetLaunchpadClient(networkId);
        if (!client) {
          return;
        }
        launchpadProject = await client.LaunchpadProjectById({
          collectionId,
        });
      } catch (e: any) {
        console.error("Error getting launchpad project: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error getting launchpad project",
          message: e.message,
        });
      }
      return launchpadProject;
    },
  );
};
