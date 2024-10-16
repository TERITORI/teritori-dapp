import { useCallback } from "react";

import { useGetLaunchpadAdmin } from "./useGetLaunchpadAdmin";
import { useIsUserLaunchpadAdmin } from "./useIsUserLaunchpadAdmin";
import { DaoProposalSingleClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { mustGetNonSigningCosmWasmClient } from "../../networks";
import { DEPLOY_PROPOSAL_DESC_PREFIX } from "../../utils/launchpad";
import { useDAOMakeProposal } from "../dao/useDAOMakeProposal";
import { useDAOFirstProposalModule } from "../dao/useDAOProposalModules";
import { useDAOProposals } from "../dao/useDAOProposals";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";

export const useProposeApproveDeployCollection = () => {
  const { launchpadAdminId } = useGetLaunchpadAdmin(); // It's a DAO
  const makeProposal = useDAOMakeProposal(launchpadAdminId);
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userAddress = selectedWallet?.address;
  const { isUserLaunchpadAdmin } = useIsUserLaunchpadAdmin(
    selectedWallet?.userId,
  );
  const { setToast } = useFeedbacks();
  const { daoProposals } = useDAOProposals(launchpadAdminId);
  const { daoFirstProposalModule } =
    useDAOFirstProposalModule(launchpadAdminId);

  // Make a proposal deploy_collection and approve it
  const proposeApproveDeployCollection = useCallback(
    async (projectId: string) => {
      try {
        if (!isUserLaunchpadAdmin) {
          throw new Error("Unauthorized");
        }
        if (!userAddress) {
          throw new Error("Invalid sender");
        }
        if (!daoFirstProposalModule?.address) {
          throw new Error("Invalid DAO Proposal module");
        }

        const cosmwasmLaunchpadFeature = getNetworkFeature(
          selectedNetworkId,
          NetworkFeature.NFTLaunchpad,
        );

        if (!cosmwasmLaunchpadFeature) {
          throw new Error("No Launchpad feature");
        }

        // ---- Make the proposal
        await makeProposal(userAddress, {
          title: "Approve Launchpad collection",
          description: DEPLOY_PROPOSAL_DESC_PREFIX + projectId,
          msgs: [
            {
              wasm: {
                execute: {
                  contract_addr:
                    cosmwasmLaunchpadFeature.launchpadContractAddress,
                  msg: Buffer.from(
                    JSON.stringify({
                      deploy_collection: {
                        collection_id: projectId,
                      },
                    }),
                  ).toString("base64"),
                  funds: [],
                },
              },
            },
          ],
        });

        const nonSigningCosmWasmClient =
          await mustGetNonSigningCosmWasmClient(selectedNetworkId);

        // ---- Get the proposal id
        const proposals = await nonSigningCosmWasmClient.queryContractSmart(
          daoFirstProposalModule.address,
          {
            list_proposals: { start_after: null, limit: 1 },
          },
        );
        const proposalId = proposals.proposals[0].id;

        const signingCosmWasmClient =
          await getKeplrSigningCosmWasmClient(selectedNetworkId);
        const daoProposalClient = new DaoProposalSingleClient(
          signingCosmWasmClient,
          userAddress,
          daoFirstProposalModule?.address,
        );

        // ---- Approve the proposal
        await daoProposalClient.vote({ proposalId, vote: "yes" }, "auto");

        setToast({
          mode: "normal",
          type: "success",
          title: "Successfully approved the Launchpad Collection",
        });
      } catch (e: any) {
        console.error("Error approving the Launchpad Collection: ", e);
        setToast({
          mode: "normal",
          type: "error",
          title: "Error approving the Launchpad Collection",
          message: e.message,
        });
      }
    },
    [
      selectedNetworkId,
      userAddress,
      setToast,
      isUserLaunchpadAdmin,
      daoFirstProposalModule,
      makeProposal,
    ],
  );

  return { proposeApproveDeployCollection, daoProposals, launchpadAdminId };
};
