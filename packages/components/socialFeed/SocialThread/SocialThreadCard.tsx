import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import React, { useEffect, useMemo, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { SocialCardHeader } from "./SocialCardHeader";
import { SocialMessageContent } from "./SocialMessageContent";
import addThreadSVG from "../../../../assets/icons/add-thread.svg";
import { Post } from "../../../api/feed/v1/feed";
import { signingSocialFeedClient } from "../../../client-creators/socialFeedClient";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useTeritoriSocialFeedReactPostMutation } from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { useGetBanPostProposals } from "../../../hooks/feed/useBanPostProposals";
import { useNSUserInfo } from "../../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  getNetworkObjectId,
  mustGetGnoNetwork,
  NetworkKind,
  parseUserId,
} from "../../../networks";
import { OnPressReplyType } from "../../../screens/FeedPostView/FeedPostViewScreen";
import { adenaDoContract, adenaVMCall } from "../../../utils/gno";
import {
  GnoBanPostMessage,
  GnoSingleChoiceProposal,
} from "../../../utils/gnodao/messages";
import { useAppNavigation } from "../../../utils/navigation";
import { getUpdatedReactions } from "../../../utils/social-feed";
import {
  neutral00,
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  redDefault,
  secondaryColor,
  withAlpha,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { tinyAddress } from "../../../utils/text";
import { BrandText } from "../../BrandText";
import FlexRow from "../../FlexRow";
import { OmniLink } from "../../OmniLink";
import { SVG } from "../../SVG";
import { AnimationFadeIn } from "../../animations/AnimationFadeIn";
import { CustomPressable } from "../../buttons/CustomPressable";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { SpacerColumn, SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { CommentsCount } from "../SocialActions/CommentsCount";
import { FlagButton } from "../SocialActions/FlagButton";
import { nbReactionsShown, Reactions } from "../SocialActions/Reactions";
import { ReplyButton } from "../SocialActions/ReplyButton";
import { ShareButton } from "../SocialActions/ShareButton";
import { SocialThreadGovernance } from "../SocialActions/SocialThreadGovernance";
import { TipButton } from "../SocialActions/TipButton";
import { TERITORI_FEED_ID } from "../const";
import { FlagConfirmModal } from "../modals/FlagConfirmModal";
import { FlagConfirmedModal } from "../modals/FlagConfirmedModal";
import { FlagDetailsModal } from "../modals/FlagDetailsModal";

const BREAKPOINT_S = 480;

export const SocialThreadCard: React.FC<{
  post: Post;
  style?: StyleProp<ViewStyle>;
  isPostConsultation?: boolean;
  fadeInDelay?: number;
  onPressReply?: OnPressReplyType;
  isGovernance?: boolean;
  isPreview?: boolean;
  isFlagged?: boolean;
  refetchFeed?: () => Promise<any>;
}> = ({
  post,
  style,
  isPostConsultation,
  fadeInDelay,
  onPressReply,
  isGovernance,
  isPreview,
  isFlagged,
  refetchFeed,
}) => {
  const [isShowFlagConfirmModal, setIsShowFlagConfirmModal] = useState(false);
  const [isShowFlagConfirmedModal, setIsShowFlagConfirmedModal] =
    useState(false);
  const [isShowFlagDetailsModal, setIsShowFlagDetailsModal] = useState(false);

  const [localPost, setLocalPost] = useState<Post>(post);
  const [viewWidth, setViewWidth] = useState(0);
  const { mutate: postMutate, isLoading: isPostMutationLoading } =
    useTeritoriSocialFeedReactPostMutation({
      onSuccess(_data, variables) {
        const reactions = getUpdatedReactions(
          post.reactions,
          variables.msg.icon
        );

        setLocalPost({ ...localPost, reactions });
      },
    });

  const { setToastError, setToastSuccess } = useFeedbacks();
  const wallet = useSelectedWallet();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id || "";
  const authorNSInfo = useNSUserInfo(localPost.authorId);
  const [, authorAddress] = parseUserId(localPost.authorId);
  const navigation = useAppNavigation();
  const metadata: SocialFeedMetadata = JSON.parse(localPost.metadata);
  const username = authorNSInfo?.metadata?.tokenId || authorAddress;
  const {
    banPostProposals,
    isLoading: isLoadingProposals,
    refetch: refetchProposals,
  } = useGetBanPostProposals(selectedNetworkId);
  const [isSendingProposal, setIsSendingProposal] = useState(false);
  const [isExecutingProposal, setIsExecutingProposal] = useState(false);

  const banPostProposalTitle = useMemo(() => {
    return `Ban Post: ${post.identifier}`;
  }, [post.identifier]);

  const proposal = useMemo(() => {
    return banPostProposals.find((p: any) => p.title === banPostProposalTitle); // FIXME: this is not secure, people can create proposals with arbitrary titles
  }, [banPostProposalTitle, banPostProposals]);

  const proposalId = useMemo(() => {
    return proposal?.id !== undefined ? String(proposal.id) : "";
  }, [proposal]);

  //TODO: Handle this later
  // const communityHashtag = useMemo(() => {
  //   return getCommunityHashtag(metadata?.hashtags || []);
  // }, [metadata]);

  const cosmosReaction = async (emoji: string, walletAddress: string) => {
    const client = await signingSocialFeedClient({
      networkId: selectedNetworkId,
      walletAddress,
    });

    postMutate({
      client,
      msg: {
        icon: emoji,
        identifier: localPost.identifier,
        up: true,
      },
    });
  };

  const gnoReaction = async (emoji: string, rpcEndpoint: string) => {
    const gnoNetwork = mustGetGnoNetwork(selectedNetworkId);

    const vmCall = {
      caller: wallet?.address || "",
      send: "",
      pkg_path: gnoNetwork.socialFeedsPkgPath,
      func: "ReactPost",
      args: [TERITORI_FEED_ID, localPost.identifier, emoji, "true"],
    };

    const txHash = await adenaDoContract(
      selectedNetworkId,
      [{ type: "/vm.m_call", value: vmCall }],
      {
        gasWanted: 2_000_000,
      }
    );

    const provider = new GnoJSONRPCProvider(rpcEndpoint);

    // Wait for tx done
    await provider.waitForTransaction(txHash);

    const reactions = [...post.reactions];
    const currentReactionIdx = reactions.findIndex((r) => r.icon === emoji);

    if (currentReactionIdx > -1) {
      reactions[currentReactionIdx].count++;
    } else {
      reactions.push({
        icon: emoji,
        count: 1,
      });
    }
    setLocalPost({ ...localPost, reactions });
  };

  const handleReaction = async (emoji: string) => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }

    if (selectedNetworkInfo?.kind === NetworkKind.Gno) {
      gnoReaction(emoji, selectedNetworkInfo?.endpoint || "");
    } else {
      cosmosReaction(emoji, wallet.address);
    }
  };

  const handleReply = () =>
    onPressReply?.({
      username,
    });

  const executeProposal = async () => {
    if (
      selectedNetworkInfo?.kind !== NetworkKind.Gno ||
      !selectedNetworkInfo.socialFeedsDAOPkgPath
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
        selectedNetworkInfo.id,
        {
          pkg_path: selectedNetworkInfo.socialFeedsDAOPkgPath,
          func: "Execute",
          caller: wallet.address,
          send: "",
          args: [moduleIndex, proposalId],
        },
        { gasWanted: 10000000 }
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
      selectedNetworkInfo?.kind !== NetworkKind.Gno ||
      !selectedNetworkInfo.socialFeedsDAOPkgPath
    ) {
      throw new Error("invalid network");
    }

    if (!wallet?.address) {
      throw new Error("address is empty");
    }

    setIsSendingProposal(true);

    try {
      const msg: GnoBanPostMessage = {
        type: "gno.land/r/demo/teritori/social_feeds.BanPost",
        payload: {
          feedId: +TERITORI_FEED_ID,
          postId: +localPost.identifier,
          reason: `Flag the post: ${localPost.identifier}`,
        },
      };
      const propReq: GnoSingleChoiceProposal = {
        title: banPostProposalTitle,
        description: "",
        messages: [msg],
      };
      await adenaVMCall(
        selectedNetworkInfo.id,
        {
          pkg_path: selectedNetworkInfo.socialFeedsDAOPkgPath,
          func: "ProposeJSON",
          caller: wallet.address,
          send: "",
          args: ["0", JSON.stringify(propReq)],
        },
        { gasWanted: 10000000 }
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
    <View>
      {isFlagged && (
        <FlexRow
          style={{
            marginTop: layout.spacing_x2,
            marginBottom: layout.spacing_x1,
          }}
        >
          <BrandText style={[fontSemibold14, { color: neutral77 }]}>
            {localPost.parentPostIdentifier ? "Comment by" : "Post by"}
          </BrandText>

          <SpacerRow size={1} />

          <OmniLink
            to={{
              screen: "UserPublicProfile",
              params: { id: localPost.authorId },
            }}
          >
            <BrandText
              style={[fontSemibold14, { color: secondaryColor }]}
              numberOfLines={1}
            >
              @
              {authorNSInfo?.metadata?.tokenId
                ? authorNSInfo?.metadata.tokenId
                : tinyAddress(authorAddress, 19)}
            </BrandText>
          </OmniLink>
        </FlexRow>
      )}

      <CustomPressable
        onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
        disabled={isPostConsultation}
        onPress={() =>
          navigation.navigate("FeedPostView", {
            id: getNetworkObjectId(selectedNetworkId, localPost.identifier),
          })
        }
      >
        <AnimationFadeIn
          style={[
            {
              borderWidth: isPostConsultation ? 4 : 1,
              borderColor: isPostConsultation
                ? withAlpha(neutral33, 0.5)
                : neutral33,
              borderRadius: 12,
              paddingVertical: layout.spacing_x2,
              paddingHorizontal: layout.spacing_x2_5,
              backgroundColor: neutral00,
            },
            style,
          ]}
          delay={fadeInDelay}
        >
          {/*====== Card Header */}
          <SocialCardHeader
            authorAddress={authorAddress}
            authorId={localPost.authorId}
            postMetadata={metadata}
            authorMetadata={authorNSInfo?.metadata}
          />

          <SpacerColumn size={2} />

          {/*====== Card Content */}
          <SocialMessageContent
            authorId={localPost.authorId}
            postId={localPost.identifier}
            metadata={metadata}
            postCategory={localPost.category}
            isPreview={isPreview}
          />
          <SpacerColumn size={2} />

          {/*====== Card Actions */}
          {isGovernance ? (
            <FlexRow justifyContent="flex-end" style={{ height: 48 }}>
              <SocialThreadGovernance
                squaresBackgroundColor={
                  isPostConsultation ? neutral17 : neutral00
                }
              />
            </FlexRow>
          ) : isFlagged ? (
            <FlexRow
              style={{
                borderTopWidth: 0.5,
                borderTopColor: neutral22,
                justifyContent: "space-between",
                paddingTop: layout.spacing_x1,
              }}
            >
              <BrandText style={[fontSemibold13, { color: neutral77 }]}>
                {authorAddress}
              </BrandText>

              <FlexRow style={{ width: "auto" }}>
                <SVG source={addThreadSVG} width={20} height={20} />
                <SpacerRow size={1} />
                <BrandText
                  onPress={() => {
                    navigation.navigate("FeedPostView", {
                      id: getNetworkObjectId(
                        selectedNetworkId,
                        localPost.parentPostIdentifier || localPost.identifier
                      ),
                    });
                  }}
                  style={fontSemibold13}
                >
                  Open the thread
                </BrandText>
              </FlexRow>
            </FlexRow>
          ) : (
            <FlexRow
              justifyContent="flex-end"
              style={
                viewWidth < BREAKPOINT_S && {
                  flexDirection: "column",
                  alignItems: "flex-end",
                }
              }
            >
              <Reactions
                nbShown={nbReactionsShown(viewWidth)}
                reactions={localPost.reactions}
                onPressReaction={handleReaction}
                isLoading={isPostMutationLoading}
              />

              {viewWidth < BREAKPOINT_S && localPost.reactions.length ? (
                <SpacerColumn size={2} />
              ) : (
                <SpacerRow size={2.5} />
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  zIndex: -1,
                }}
              >
                <EmojiSelector
                  onEmojiSelected={handleReaction}
                  isLoading={isPostMutationLoading}
                />
                {isPostConsultation && onPressReply && (
                  <>
                    <SpacerRow size={2.5} />
                    <ReplyButton onPress={handleReply} />
                  </>
                )}
                <SpacerRow size={2.5} />
                <CommentsCount count={localPost.subPostLength} />

                <SpacerRow size={2.5} />
                <TipButton
                  disabled={localPost.authorId === wallet?.userId}
                  amount={localPost.tipAmount}
                  author={username}
                  postId={localPost.identifier}
                />

                <SpacerRow size={2.5} />

                {selectedNetworkInfo?.kind === NetworkKind.Gno && (
                  <FlagButton
                    refetchFeed={refetchFeed}
                    postId={localPost.identifier}
                  />
                )}

                {isPostConsultation && (
                  <>
                    <SpacerRow size={2.5} />
                    <ShareButton postId={localPost.identifier} />
                  </>
                )}
              </View>
            </FlexRow>
          )}
        </AnimationFadeIn>
      </CustomPressable>

      {isFlagged && !isLoadingProposals && (
        <>
          <SpacerColumn size={2} />

          {proposalId !== "" ? (
            <FlexRow style={{ justifyContent: "flex-end" }}>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
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
        networkId={selectedNetworkId}
        proposalId={proposalId}
        onClose={() => {
          setIsShowFlagDetailsModal(false);
        }}
        isVisible={isShowFlagDetailsModal}
      />
    </View>
  );
};
