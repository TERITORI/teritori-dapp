import { useCallback } from "react";

import { useGetLaunchpadAdmin } from "./useGetLaunchpadAdmin";
import { useIsUserLaunchpadAdmin } from "./useIsUserLaunchpadAdmin";
import { DaoProposalSingleClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { DEPLOY_PROPOSAL_TITLE_PREFIX } from "../../utils/launchpad";
import { useDAOMakeProposal } from "../dao/useDAOMakeProposal";
import { useDAOFirstProposalModule } from "../dao/useDAOProposalModules";

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
        const makeProposalRes = await makeProposal(userAddress, {
          title: DEPLOY_PROPOSAL_TITLE_PREFIX + projectId,
          description: "",
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

        // ---- Get the freshly made proposal id
        const event = makeProposalRes.events.find((ev) =>
          ev.attributes.some((attr) => attr.key === "proposal_id"),
        );
        const proposalId = event?.attributes.find(
          (attribute) => attribute.key === "proposal_id",
        )?.value;
        if (!proposalId) {
          throw new Error("Failed to retreive the proposal");
        }

        const signingCosmWasmClient =
          await getKeplrSigningCosmWasmClient(selectedNetworkId);
        const daoProposalClient = new DaoProposalSingleClient(
          signingCosmWasmClient,
          userAddress,
          daoFirstProposalModule?.address,
        );

        // ---- Approve the proposal
        await daoProposalClient.vote(
          { proposalId: parseInt(proposalId, 10), vote: "yes" },
          "auto",
        );

        setToast({
          mode: "normal",
          type: "success",
          title: "Successfully approved the Launchpad Collection",
        });
      } catch (err: unknown) {
        console.error("Error approving the Launchpad Collection: ", err);
        if (err instanceof Error) {
          setToast({
            mode: "normal",
            type: "error",
            title: "Error approving the Launchpad Collection",
            message: err.message,
          });
        }
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

  return { proposeApproveDeployCollection, launchpadAdminId };
};
