import { useQuery } from "@tanstack/react-query";

import {
  LaunchpadProject,
  LaunchpadProjectsRequest, LaunchpadProjectsResponse,
} from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { mustGetLaunchpadClient } from "@/utils/backend";

export const useLaunchpadProjects = (req: LaunchpadProjectsRequest) => {
  const { setToast } = useFeedbacks();
  const networkId = req.networkId;
  const userAddress = req.userAddress;

  const { data, ...other } = useQuery<LaunchpadProject[]>(
    ["collectionsByCreator", networkId, userAddress],
    async () => {
      const launchpadProjects: LaunchpadProject[] = [];

      try {
        const client = mustGetLaunchpadClient(networkId);

        if (!client || !userAddress) {
          return [];
        }
        const response: LaunchpadProjectsResponse = await client.LaunchpadProjects(req);
        response.projects.forEach((data) => {
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
  return {launchpadProjects: data, ...other}
};
