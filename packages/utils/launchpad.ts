import { LaunchpadProject } from "@/api/launchpad/v1/launchpad";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  CollectionDataResult,
  ZodCollectionDataResult,
} from "@/utils/types/launchpad";

export const launchpadProjectStatus = (launchpadProject: LaunchpadProject) =>
  !launchpadProject.merkleRoot
    ? "INCOMPLETE"
    : !launchpadProject.deployedAddress
      ? "COMPLETE"
      : "DEPLOYED";

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
