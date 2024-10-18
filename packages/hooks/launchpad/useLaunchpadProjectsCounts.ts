import { useQuery } from "@tanstack/react-query";

import {
  LaunchpadProjectsCountRequest,
  Status,
} from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { mustGetLaunchpadClient } from "@/utils/backend";

interface LaunchpadProjectsCounts {
  countComplete: number;
  countIncomplete: number;
  countConfirmed: number;
  countDeployed: number;
}

export const useLaunchpadProjectsCounts = (
  req: LaunchpadProjectsCountRequest,
  wantedStatus: Status[],
) => {
  const { setToast } = useFeedbacks();
  const networkId = req.networkId;
  // const userAddress = req.userAddress;

  const { data, ...other } = useQuery<LaunchpadProjectsCounts | undefined>(
    [
      "launchpadProjectsCounts",
      networkId,
      // , userAddress
    ],
    async () => {
      const counts: LaunchpadProjectsCounts = {
        countComplete: 0,
        countIncomplete: 0,
        countConfirmed: 0,
        countDeployed: 0,
      };
      try {
        const client = mustGetLaunchpadClient(networkId);
        if (
          !client
          // || !userAddress
        ) {
          return counts;
        }
        // TODO: Getting these status could be done in one db request in go/pkg/launchpad/service.go
        if (wantedStatus.includes(Status.STATUS_INCOMPLETE)) {
          const responseIncomplete = await client.LaunchpadProjectsCount({
            ...req,
            status: Status.STATUS_INCOMPLETE,
          });
          counts.countIncomplete = responseIncomplete.count;
        }
        if (wantedStatus.includes(Status.STATUS_COMPLETE)) {
          const responseComplete = await client.LaunchpadProjectsCount({
            ...req,
            status: Status.STATUS_COMPLETE,
          });
          counts.countComplete = responseComplete.count;
        }
        if (wantedStatus.includes(Status.STATUS_CONFIRMED)) {
          // TODO: Handle status confirmed in go/pkg/launchpad/service.go
          const responseConfirmed = await client.LaunchpadProjectsCount({
            ...req,
            status: Status.STATUS_CONFIRMED,
          });
          counts.countConfirmed = responseConfirmed.count;
        }
        if (wantedStatus.includes(Status.STATUS_DEPLOYED)) {
          const responseDeployed = await client.LaunchpadProjectsCount({
            ...req,
            status: Status.STATUS_DEPLOYED,
          });
          counts.countDeployed = responseDeployed.count;
        }
      } catch (e: any) {
        console.error("Error getting launchpad projects counts: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error getting launchpad projects counts",
          message: e.message,
        });
      }
      return counts;
    },
  );
  return { counts: data, ...other };
};
