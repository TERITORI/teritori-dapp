import { useQuery } from "@tanstack/react-query";
import { clone } from "lodash";

import {
  LaunchpadProjectsCountRequest,
  Status,
} from "@/api/launchpad/v1/launchpad";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { mustGetLaunchpadClient } from "@/utils/backend";

export interface LaunchpadProjectsCounts {
  countComplete: number;
  countIncomplete: number;
  countConfirmed: number;
  countReviewing: number;
}

export const useLaunchpadProjectsCounts = (
  req: LaunchpadProjectsCountRequest,
  wantedStatus: Status[],
) => {
  const { setToast } = useFeedbacks();
  const networkId = req.networkId;
  // const userAddress = req.userAddress;

  const defaultCounts: LaunchpadProjectsCounts = {
    countComplete: 0,
    countIncomplete: 0,
    countConfirmed: 0,
    countReviewing: 0,
  };

  const { data = defaultCounts, ...other } = useQuery<
    LaunchpadProjectsCounts | undefined
  >(
    [
      "launchpadProjectsCounts",
      networkId,
      // , userAddress
    ],
    async () => {
      const counts = clone(defaultCounts);

      try {
        const client = mustGetLaunchpadClient(networkId);
        if (
          !client
          // || !userAddress
        ) {
          throw new Error("Missing client");
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
        if (wantedStatus.includes(Status.STATUS_REVIEWING)) {
          const responseDeployed = await client.LaunchpadProjectsCount({
            ...req,
            status: Status.STATUS_REVIEWING,
          });
          counts.countReviewing = responseDeployed.count;
        }
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
      } finally {
        return counts;
      }
    },
  );
  return { counts: data, ...other };
};
