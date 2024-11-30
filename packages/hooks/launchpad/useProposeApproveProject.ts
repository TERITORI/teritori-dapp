import { useCallback } from "react";

import { useGetLaunchpadAdmin } from "./useGetLaunchpadAdmin";
import { useIsUserLaunchpadAdmin } from "./useIsUserLaunchpadAdmin";
import { DaoProposalSingleClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import { useDAOMakeProposal } from "../dao/useDAOMakeProposal";
import { useDAOFirstProposalModule } from "../dao/useDAOProposalModules";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetworkFeature, NetworkFeature } from "@/networks";
import { getKeplrSigningCosmWasmClient } from "@/networks/signer";
import { mustGetLaunchpadClient } from "@/utils/backend";

export const useProposeApproveProject = () => {
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
  const proposeApproveProject = useCallback(
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

        const cosmwasmNftLaunchpadFeature = getNetworkFeature(
          selectedNetworkId,
          NetworkFeature.CosmWasmNFTLaunchpad,
        );

        if (!cosmwasmNftLaunchpadFeature) {
          throw new Error("No Launchpad feature");
        }

        // ---- Make the proposal
        const makeProposalRes = await makeProposal(userAddress, {
          title: "Approve Project " + projectId,
          description: "",
          msgs: [
            {
              wasm: {
                execute: {
                  contract_addr:
                    cosmwasmNftLaunchpadFeature.launchpadContractAddress,
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

        // ---- Update the DB by adding proposalId to the project
        // The proposal has always at least a vote "yes". So this project is considered as
        const launchpadBackendClient =
          mustGetLaunchpadClient(selectedNetworkId);
        const { approved } = await launchpadBackendClient.ProposeApproveProject(
          {
            sender: userAddress,
            projectId,
            networkId: selectedNetworkId,
            proposalId,
          },
        );

        if (!approved) {
          throw new Error(
            "Failed to update the project status after first approbation",
          );
        }

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

  return { proposeApproveProject, launchpadAdminId };
};
