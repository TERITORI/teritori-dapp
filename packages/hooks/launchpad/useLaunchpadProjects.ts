import { useQuery } from "@tanstack/react-query";

import {
  LaunchpadProject,
  LaunchpadProjectsRequest,
} from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { mustGetLaunchpadClient } from "@/utils/backend";

export const useLaunchpadProjects = (req: LaunchpadProjectsRequest) => {
  const { setToast } = useFeedbacks();
  const networkId = req.networkId;
  const userAddress = req.userAddress;

  return useQuery(
    ["collectionsByCreator", networkId, userAddress],
    async () => {
      const launchpadProjects: LaunchpadProject[] = [];

      try {
        const client = mustGetLaunchpadClient(networkId);

        if (!client || !userAddress) {
          return [];
        }
        const { projects } = await client.LaunchpadProjects(req);

        projects.forEach((data) => {
          if (!data) {
            return;
          }
          launchpadProjects.push(data);
        });
      } catch (e: any) {
        console.error("Error getting launchpad projects: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error getting launchpad projects",
          message: e.message,
        });
      }

      return launchpadProjects;
    },
  );
};
