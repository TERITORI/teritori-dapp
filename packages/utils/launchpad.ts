import {
  LaunchpadProject,
  Status,
  StatusCount,
} from "@/api/launchpad/v1/launchpad";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  CollectionDataResult,
  ZodCollectionDataResult,
} from "@/utils/types/launchpad";

export const launchpadProjectStatus = (status: Status) => {
  switch (status) {
    case Status.STATUS_INCOMPLETE:
      return "INCOMPLETE";
    case Status.STATUS_COMPLETE:
      return "COMPLETE";
    case Status.STATUS_REVIEWING:
      return "REVIEWING";
    case Status.STATUS_CONFIRMED:
      return "CONFIRMED";
    case Status.STATUS_UNSPECIFIED:
      return "UNSPECIFIED";
    default:
      return "UNSPECIFIED";
  }
};

export const statusToCount = (status: string, statusCounts?: StatusCount[]) =>
  statusCounts?.find(
    (statusCount) => launchpadProjectStatus(statusCount.status) === status,
  )?.count || 0;

export const parseCollectionData = (launchpadProject: LaunchpadProject) =>
  zodTryParseJSON(ZodCollectionDataResult, launchpadProject.collectionData);

export const parseMultipleCollectionsData = (
  launchpadProjects: LaunchpadProject[],
) => {
  const result: CollectionDataResult[] = [];
  launchpadProjects.forEach((project) => {
    if (!project) {
      return;
    }
    const collectionData: CollectionDataResult | undefined = zodTryParseJSON(
      ZodCollectionDataResult,
      project.collectionData,
    );
    if (!collectionData) {
      return;
    }
    result.push(collectionData);
  });
  return result;
};
