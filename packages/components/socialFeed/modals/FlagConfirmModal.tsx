import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { useState } from "react";
import { Image, View } from "react-native";

import contributionIllustrationPNG from "../../../../assets/social-feeds/contribution-illustration.png";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { mustGetGnoNetwork } from "../../../networks";
import { adenaDoContract } from "../../../utils/gno";
import { GnoDAOVoteRequest } from "../../../utils/gnodao/messages";
import { neutral77 } from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import ModalBase from "../../modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../spacer";

type FlagConfirmModalProps = {
  proposalId: string;
  onClose: (nextModalName?: string) => void;
  isVisible: boolean;
  refetchProposals?: () => Promise<any>;
};

type VoteValue = "banPost" | "dontBanPost";

export const FlagConfirmModal: React.FC<FlagConfirmModalProps> = ({
  proposalId,
  onClose,
  isVisible,
  refetchProposals,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setToastError } = useFeedbacks();
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();

  const confirmVote = async (vote: VoteValue) => {
    try {
      if (!wallet?.address) {
        throw Error("Address empty");
      }

      if (!selectedNetworkId) {
        throw Error("Network empty");
      }

      const gnoNetwork = mustGetGnoNetwork(selectedNetworkId);

      setIsLoading(true);

      const moduleIndex = "0";

      const voteJSON: GnoDAOVoteRequest = {
        vote: vote === "banPost" ? 0 : 1,
        rationale: "",
      };

      const vmCall = {
        caller: wallet.address,
        send: "",
        pkg_path: gnoNetwork.socialFeedsDAOPkgPath,
        func: "VoteJSON",
        args: [moduleIndex, proposalId, JSON.stringify(voteJSON)],
      };

      const txHash = await adenaDoContract(
        selectedNetworkId,
        [{ type: "/vm.m_call", value: vmCall }],
        {
          gasWanted: 2_000_000,
        },
      );

      const provider = new GnoJSONRPCProvider(gnoNetwork.endpoint);

      // Wait for tx done
      await provider.waitForTransaction(txHash);

      await refetchProposals?.();

      onClose("FlagConfirmedModal");
    } catch (err: any) {
      console.error(err);
      // Close modal before showing toast
      onClose();
      setToastError({ title: "Vote failed", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={640}
      labelComponent={
        <FlexRow>
          <BrandText style={fontSemibold16}>
            Confirm your contribution to moderation
          </BrandText>
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            (Cannot be changed later)
          </BrandText>
        </FlexRow>
      }
    >
      <View style={{ alignItems: "center" }}>
        <SpacerColumn size={2.5} />

        <BrandText style={fontSemibold13}>
          This selected content will be banned from Teritori OS Interface.
        </BrandText>

        <SpacerColumn size={2.5} />

        <Image
          source={contributionIllustrationPNG}
          style={{
            width: 200,
            height: 200,
            marginVertical: layout.spacing_x2,
          }}
        />

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <SecondaryButton
            size="SM"
            text="Don't ban"
            loader={isLoading}
            onPress={() => confirmVote("dontBanPost")}
            width={120}
          />

          <PrimaryButton
            size="SM"
            text="Ban"
            loader={isLoading}
            onPress={() => confirmVote("banPost")}
            width={120}
          />
        </View>
        <SpacerColumn size={2.5} />
      </View>
    </ModalBase>
  );
};
