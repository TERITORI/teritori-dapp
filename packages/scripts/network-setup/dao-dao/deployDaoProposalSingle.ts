import { deployRemoteWASM } from "./../deployRemoteWASM";
import { daoDaoContractsBinariesPath } from "./utils";
import { DeployOpts } from "../deployLib";

import { CosmosNetworkInfo } from "@/networks";

export const deployDaoProposalSingle = async ({
  opts,
  wallet,
  network,
}: {
  opts: DeployOpts;
  wallet: string;
  network: CosmosNetworkInfo;
}) => {
  return await deployRemoteWASM(
    opts,
    wallet,
    network,
    `${daoDaoContractsBinariesPath}/dao_proposal_single.wasm`,
    "dao_proposal_single.wasm",
  );
};
