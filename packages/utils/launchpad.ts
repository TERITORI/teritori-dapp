import {CollectionDataResult, ZodCollectionDataResult} from "@/utils/types/launchpad";
import {LaunchpadProject} from "@/api/launchpad/v1/launchpad";
import {zodTryParseJSON} from "@/utils/sanitize";

export const collectionStatus = (collectionData: CollectionDataResult) =>
  !collectionData.metadatas_merkle_root
    ? "INCOMPLETE"
    : !collectionData.deployed_address
      ? "COMPLETE"
      : "DEPLOYED";

// FIXME:
//  There is a launchpad_project.collection_data.metadatas_merkle_root, but there is also a launchpad_project.merkle_root.
//  ==> launchpad_project.merkle_root can be present, without launchpad_project.collection_data.metadatas_merkle_root,
//  if the UploadMetadatas from backend works AND update_merkle_root from contract fails


export const collectionData = (launchpadProject: LaunchpadProject) => zodTryParseJSON(
  ZodCollectionDataResult,
  launchpadProject.collectionData,
);
