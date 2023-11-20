import { View } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { DaoProposalSingleClient } from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.client";
import {
  ProposalResponse,
  Vote,
} from "../../contracts-clients/dao-proposal-single/DaoProposalSingle.types";
import { useIsDAOMember } from "../../hooks/dao/useDAOMember";
import { useDAOFirstProposalModule } from "../../hooks/dao/useDAOProposalModules";
import { useInvalidateDAOProposals } from "../../hooks/dao/useDAOProposals";
import {
  useInvalidateDAOVoteInfo,
  useDAOVoteInfo,
} from "../../hooks/dao/useDAOVoteInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  NetworkKind,
  getKeplrSigningCosmWasmClient,
  getNetwork,
  parseUserId,
} from "../../networks";
import { adenaVMCall } from "../../utils/gno";
import { GnoDAOVoteRequest } from "../../utils/gnodao/messages";
import { neutral77, primaryColor, errorColor } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { PrimaryButtonOutline } from "../buttons/PrimaryButtonOutline";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { TertiaryButton } from "../buttons/TertiaryButton";

export const ProposalActions: React.FC<{
  daoId: string | undefined;
  proposal: ProposalResponse;
}> = ({ daoId, proposal }) => {
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const { isDAOMember: selectedWalletIsDAOMember } = useIsDAOMember(
    daoId,
    selectedWallet?.userId,
  );
  const invalidateDAOProposals = useInvalidateDAOProposals(daoId);
  const invalidateDAOVoteInfo = useInvalidateDAOVoteInfo(
    daoId,
    selectedWallet?.userId,
    proposal.id,
  );
  const { daoFirstProposalModule } = useDAOFirstProposalModule(daoId);
  const { daoVoteInfo: ownVote } = useDAOVoteInfo(
    daoId,
    selectedWallet?.userId,
    proposal.id,
  );

  const vote = async (v: Vote) => {
    try {
      if (!selectedWallet) throw new Error("invalid wallet");
      if (proposal.proposal.status !== "open")
        throw new Error("proposal not open");
      const network = getNetwork(networkId);
      if (!network) throw new Error("network not found");
      switch (network.kind) {
        case NetworkKind.Cosmos: {
          if (!daoFirstProposalModule?.address)
            throw new Error("no proposal module");
          const walletAddress = selectedWallet.address;
          const networkId = selectedWallet.networkId;
          const signingClient = await getKeplrSigningCosmWasmClient(networkId);
          const daoProposalClient = new DaoProposalSingleClient(
            signingClient,
            walletAddress,
            daoFirstProposalModule?.address,
          );
          await daoProposalClient.vote(
            { proposalId: proposal.id, vote: v },
            "auto",
          );
          break;
        }
        case NetworkKind.Gno: {
          const walletAddress = selectedWallet.address;
          const [, pkgPath] = parseUserId(daoId);
          let gnoVote;
          switch (v) {
            case "yes": {
              gnoVote = 0;
              break;
            }
            case "no": {
              gnoVote = 1;
              break;
            }
            case "abstain": {
              gnoVote = 2;
              break;
            }
            default:
              throw new Error("invalid vote");
          }
          const msg: GnoDAOVoteRequest = {
            vote: gnoVote,
            rationale: "Me like it",
          };
          await adenaVMCall(networkId, {
            caller: walletAddress,
            send: "",
            pkg_path: pkgPath,
            func: "VoteJSON",
            args: ["0", proposal.id.toString(), JSON.stringify(msg)],
          });
          break;
        }
        default:
          throw new Error("network not supported");
      }
      invalidateDAOVoteInfo();
      invalidateDAOProposals();
      setToastSuccess({ title: "Success", message: "Vote submitted" });
    } catch (err: any) {
      setToastError({
        title: "Failed to vote",
        message: err.message,
      });
    }
  };

  const execute = async () => {
    try {
      if (!selectedWallet) {
        throw new Error("invalid wallet");
      }
      const network = getNetwork(networkId);
      if (!network) {
        throw new Error("invalid network");
      }
      switch (network.kind) {
        case NetworkKind.Cosmos: {
          if (
            proposal.proposal.status !== "passed" ||
            !daoFirstProposalModule?.address
          )
            return;
          const walletAddress = selectedWallet.address;
          const networkId = selectedWallet.networkId;
          const signingClient = await getKeplrSigningCosmWasmClient(networkId);
          const daoProposalClient = new DaoProposalSingleClient(
            signingClient,
            walletAddress,
            daoFirstProposalModule?.address,
          );
          const res = await daoProposalClient.execute({
            proposalId: proposal.id,
          });
          if (
            res.events.find((ev) =>
              ev.attributes.find(
                (attr) =>
                  attr.key === "proposal_execution_failed" &&
                  attr.value === proposal.id.toString(),
              ),
            )
          ) {
            console.error("failed to execute", res);
            throw new Error("internal error");
          }
          console.log("executed", res);
          break;
        }
        case NetworkKind.Gno: {
          const walletAddress = selectedWallet.address;
          const [, pkgPath] = parseUserId(daoId);
          await adenaVMCall(
            networkId,
            {
              caller: walletAddress,
              send: "",
              pkg_path: pkgPath,
              func: "Execute",
              args: ["0", proposal.id.toString()],
            },
            { gasWanted: 10000000 },
          );
          break;
        }
      }
      await invalidateDAOProposals();
      setToastSuccess({ title: "Executed", message: "" });
    } catch (err) {
      console.error("failed to execute", err);
      await invalidateDAOProposals();
      setToastError({
        title: "Failed to execute",
        message: err instanceof Error ? err.message : `${err}`,
      });
    }
  };

  if (proposal.proposal.status === "open") {
    if (ownVote?.vote?.vote === "yes") {
      return <VoteStatus text="Voting: You approved" color={neutral77} />;
    }

    if (ownVote?.vote?.vote === "no") {
      return <VoteStatus text="Voting: You declined" color={neutral77} />;
    }

    if (ownVote?.vote?.vote === "abstain") {
      return <VoteStatus text="Voting: You abstained" color={neutral77} />;
    }
  }

  if (proposal.proposal.status === "executed") {
    return <VoteStatus text="Executed" color={primaryColor} />;
  }

  if (proposal.proposal.status === "execution_failed") {
    return <VoteStatus text="Execution failed" color={errorColor} />;
  }

  if (proposal.proposal.status === "rejected") {
    return <VoteStatus text="Rejected" color={errorColor} />;
  }

  if (proposal.proposal.status === "closed") {
    return <VoteStatus text="Closed" color={errorColor} />;
  }

  if (proposal.proposal.status === "passed") {
    if (!selectedWalletIsDAOMember) {
      return <VoteStatus text="Ready to execute" color={primaryColor} />;
    }
    return (
      <PrimaryButton
        text="Execute"
        size="M"
        fullWidth
        onPress={execute}
        loader
      />
    );
  }

  if (proposal.proposal.status === "open") {
    if (!selectedWalletIsDAOMember) {
      return <VoteStatus text="Voting" color={neutral77} />;
    }
    return (
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <SecondaryButton
          text="Approve"
          size="M"
          onPress={() => vote("yes")}
          loader
        />
        <PrimaryButtonOutline
          text="Decline"
          size="M"
          color={errorColor}
          onPress={() => vote("no")}
          // loader
        />
        <TertiaryButton
          text="Abstain"
          size="M"
          onPress={() => vote("abstain")}
          // loader
        />
      </View>
    );
  }

  return null;
};

const VoteStatus: React.FC<{
  text: string;
  color: string;
}> = ({ text, color }) => {
  return (
    <BrandText
      style={[
        fontSemibold14,
        {
          textTransform: "uppercase",
          textAlign: "center",
          borderLeftColor: color,
          borderLeftWidth: 1,
          borderRightColor: color,
          borderRightWidth: 1,
          lineHeight: 14,
          color,
          width: "100%",
          alignSelf: "center",
        },
      ]}
    >
      {text}
    </BrandText>
  );
};
