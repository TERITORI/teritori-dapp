import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { Post } from "../../../api/feed/v1/feed";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useGetBanPostProposals } from "../../../hooks/feed/useBanPostProposals";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { NetworkKind, getNetwork } from "../../../networks";
import { TERITORI_FEED_ID } from "../../../utils/feed/constants";
import { adenaVMCall } from "../../../utils/gno";
import {
  GnoBanPostMessage,
  GnoSingleChoiceProposal,
} from "../../../utils/gnodao/messages";
import {
  neutral77,
  redDefault,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontRegular14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { AnimationFadeIn } from "../../animations/AnimationFadeIn";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { FlagConfirmModal } from "../modals/FlagConfirmModal";
import { FlagConfirmedModal } from "../modals/FlagConfirmedModal";
import { FlagDetailsModal } from "../modals/FlagDetailsModal";

import { Username } from "@/components/user/Username";

// ====== Handle moderation, proposals, governance
export const SocialCardWrapper: FC<{
  post: Post;
  isFlagged?: boolean;
  refetchFeed?: () => Promise<any>;
  children: ReactNode;
}> = ({
  post,

  isFlagged,
  refetchFeed,
  children,
}) => {
  const [isShowFlagConfirmModal, setIsShowFlagConfirmModal] = useState(false);
  const [isShowFlagConfirmedModal, setIsShowFlagConfirmedModal] =
    useState(false);
  const [isShowFlagDetailsModal, setIsShowFlagDetailsModal] = useState(false);

  const [localPost, setLocalPost] = useState<Post>(post);

  const { setToastError, setToastSuccess } = useFeedbacks();
  const wallet = useSelectedWallet();
  const networkId = post.networkId;
  const postNetwork = getNetwork(networkId);
  const {
    banPostProposals,
    isLoading: isLoadingProposals,
    refetch: refetchProposals,
  } = useGetBanPostProposals(networkId);
  const [isSendingProposal, setIsSendingProposal] = useState(false);
  const [isExecutingProposal, setIsExecutingProposal] = useState(false);

  const banPostProposalTitle = useMemo(() => {
    return `Ban Post: ${post.localIdentifier}`;
  }, [post.localIdentifier]);

  const proposal = useMemo(() => {
    return banPostProposals.find((p: any) => p.title === banPostProposalTitle); // FIXME: this is not secure, people can create proposals with arbitrary titles
  }, [banPostProposalTitle, banPostProposals]);

  const proposalId = useMemo(() => {
    return proposal?.id !== undefined ? String(proposal.id) : "";
  }, [proposal]);

  const executeProposal = async () => {
    if (
      postNetwork?.kind !== NetworkKind.Gno ||
      !postNetwork.socialFeedsDAOPkgPath
    ) {
      throw new Error("invalid network");
    }

    if (!wallet?.address) {
      throw new Error("address is empty");
    }

    setIsExecutingProposal(true);

    try {
      const moduleIndex = "0";

      await adenaVMCall(
        postNetwork.id,
        {
          pkg_path: postNetwork.socialFeedsDAOPkgPath,
          func: "Execute",
          caller: wallet.address,
          send: "",
          args: [moduleIndex, proposalId],
        },
        { gasWanted: 10000000 },
      );

      await refetchFeed?.();
      await refetchProposals();

      setToastSuccess({
        title: "Success",
        message: "Executed proposal successfully",
      });
    } catch (e: any) {
      setToastError({
        title: "Error",
        message: e.message,
      });
    } finally {
      setIsExecutingProposal(false);
    }
  };

  const proposeToBan = async () => {
    if (
      postNetwork?.kind !== NetworkKind.Gno ||
      !postNetwork.socialFeedsDAOPkgPath
    ) {
      throw new Error("invalid network");
    }

    if (!wallet?.address) {
      throw new Error("address is empty");
    }

    setIsSendingProposal(true);

    try {
      const msg: GnoBanPostMessage = {
        type: "gno.land/r/teritori/social_feeds.BanPost",
        payload: {
          feedId: +TERITORI_FEED_ID,
          postId: +localPost.localIdentifier,
          reason: `Flag the post: ${localPost.localIdentifier}`,
        },
      };
      const propReq: GnoSingleChoiceProposal = {
        title: banPostProposalTitle,
        description: "",
        messages: [msg],
      };
      await adenaVMCall(
        postNetwork.id,
        {
          pkg_path: postNetwork.socialFeedsDAOPkgPath,
          func: "ProposeJSON",
          caller: wallet.address,
          send: "",
          args: ["0", JSON.stringify(propReq)],
        },
        { gasWanted: 10000000 },
      );

      await refetchFeed?.();
      refetchProposals();

      setToastSuccess({
        title: "Success",
        message: "Sending proposal successfully",
      });
    } catch (e: any) {
      setToastError({
        title: "Error",
        message: e.message,
      });
    } finally {
      setIsSendingProposal(false);
    }
  };

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  return (
    <AnimationFadeIn>
      {isFlagged && (
        <FlexRow
          style={{
            marginTop: layout.spacing_x2,
            marginBottom: layout.spacing_x1,
          }}
        >
          <BrandText style={[fontRegular14, { color: neutral77 }]}>
            {localPost.parentPostIdentifier ? "Comment by" : "Post by"}
          </BrandText>

          <SpacerRow size={1} />

          <Username
            userId={post.authorId}
            textStyle={fontRegular14}
            namedColor={secondaryColor}
            anonColor={secondaryColor}
          />
        </FlexRow>
      )}

      {children}

      {isFlagged && !isLoadingProposals && (
        <>
          <SpacerColumn size={1.5} />

          {proposalId !== "" ? (
            <FlexRow style={{ justifyContent: "flex-end" }}>
              <BrandText style={[fontRegular14, { color: neutral77 }]}>
                My verdict
              </BrandText>
              <SpacerRow size={2} />
              <SecondaryButton
                onPress={() => setIsShowFlagConfirmModal(true)}
                size="M"
                text="Don't ban"
                width={120}
              />
              <SpacerRow size={2} />
              <PrimaryButton
                onPress={() => setIsShowFlagConfirmModal(true)}
                size="M"
                text="Ban"
                width={120}
              />
              <SpacerRow size={2} />
              {proposal?.status === "Passed" && (
                <PrimaryButton
                  color={redDefault}
                  onPress={executeProposal}
                  size="M"
                  loader={isExecutingProposal}
                  text="Execute proposal"
                  width={160}
                />
              )}
            </FlexRow>
          ) : (
            <View style={{ alignSelf: "flex-end" }}>
              <PrimaryButton
                isLoading={isSendingProposal}
                onPress={proposeToBan}
                size="M"
                text="Make a proposal to Ban"
                width={200}
              />
            </View>
          )}
        </>
      )}

      <FlagConfirmModal
        proposalId={proposalId}
        refetchProposals={refetchProposals}
        onClose={(nextModalName) => {
          setIsShowFlagConfirmModal(false);
          nextModalName === "FlagConfirmedModal" &&
            setIsShowFlagConfirmedModal(true);
        }}
        isVisible={isShowFlagConfirmModal}
      />

      <FlagConfirmedModal
        onClose={(nextModalName) => {
          setIsShowFlagConfirmedModal(false);
          nextModalName === "FlagDetailsModal" &&
            setIsShowFlagDetailsModal(true);
        }}
        isVisible={isShowFlagConfirmedModal}
      />

      <FlagDetailsModal
        networkId={networkId}
        proposalId={proposalId}
        onClose={() => {
          setIsShowFlagDetailsModal(false);
        }}
        isVisible={isShowFlagDetailsModal}
      />
    </AnimationFadeIn>
  );
};
