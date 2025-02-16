import React, { FC } from "react";

import { LaunchpadCollectionsTable } from "./LaunchpadCollectionsTable";
import {
  Sort,
  SortDirection,
  Status,
} from "../../../../api/launchpad/v1/launchpad";
import { useSelectedNetworkId } from "../../../../hooks/useSelectedNetwork";

import { useLaunchpadProjects } from "@/hooks/launchpad/useLaunchpadProjects";

export const CompletesTable: FC<{
  limit: number;
}> = ({ limit }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const { launchpadProjects = [] } = useLaunchpadProjects({
    networkId: selectedNetworkId,
    offset: 0,
    limit,
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    status: Status.STATUS_COMPLETE,
    creatorId: "",
  });
  return <LaunchpadCollectionsTable rows={launchpadProjects} />;
};
