import { useQuery } from "@tanstack/react-query";

import {
  LaunchpadProjectsByCreatorRequest,
  LaunchpadProjectsByCreatorResponse,
  LaunchpadProject,
} from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { mustGetLaunchpadClient } from "@/utils/backend";

export const useLaunchpadProjectsByCreator = (
  req: LaunchpadProjectsByCreatorRequest,
) => {
  const { setToast } = useFeedbacks();
  const networkId = req.networkId;
  const creatorId = req.creatorId;
  // const userAddress = req.userAddress;

  const { data, ...other } = useQuery<LaunchpadProject[]>(
    [
      "launchpadProjectsByCreator",
      networkId,
      creatorId,
      // , userAddress
    ],
    async () => {
      const launchpadProjects: LaunchpadProject[] = [];

      try {
        const client = mustGetLaunchpadClient(networkId);

        if (
          !client ||
          !creatorId
          // !userAddress
        ) {
          return [];
        }
        const response: LaunchpadProjectsByCreatorResponse =
          await client.LaunchpadProjectsByCreator(req);
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
  return { launchpadProjects: data, ...other };
};
