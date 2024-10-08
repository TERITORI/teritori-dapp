import { LaunchpadProject } from "@/api/launchpad/v1/launchpad";
import { zodTryParseJSON } from "@/utils/sanitize";
import {
  CollectionDataResult,
  ZodCollectionDataResult,
} from "@/utils/types/launchpad";

export const collectionStatus = (collectionData: CollectionDataResult) =>
  !collectionData.metadatas_merkle_root
    ? "INCOMPLETE"
    : !collectionData.deployed_address
      ? "COMPLETE"
      : "DEPLOYED";

export const collectionData = (launchpadProject: LaunchpadProject) =>
  zodTryParseJSON(ZodCollectionDataResult, launchpadProject.collectionData);

export const collectionsData = (launchpadProjects: LaunchpadProject[]) => {
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
