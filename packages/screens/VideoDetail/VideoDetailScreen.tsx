import { ResizeMode } from "expo-av";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, TextInput, TextStyle, View, ViewStyle } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

import { VideoCard } from "./components/VideoCard";
import { VideoComment } from "./components/VideoComment";
import TipIcon from "../../../assets/icons/tip.svg";
import Dislike from "../../../assets/icons/video-player/dislike.svg";
import Like from "../../../assets/icons/video-player/like.svg";
import {
  CommentInfo,
  DislikeRequest,
  LikeRequest,
} from "../../api/video/v1/video";
import { signingVideoPlayerClient } from "../../client-creators/videoplayerClient";
import { BrandText } from "../../components/BrandText";
import { OmniLink } from "../../components/OmniLink";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { UserAvatarWithFrame } from "../../components/images/AvatarWithFrame";
import { DotSeparator } from "../../components/separators/DotSeparator";
import { PostCategory } from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { TipModal } from "../../components/socialFeed/SocialActions/TipModal";
import { DateTime } from "../../components/socialFeed/SocialThread/DateTime";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { MediaPlayerVideo } from "../../context/MediaPlayerProvider";
import { useGetPostFee } from "../../hooks/feed/useGetPostFee";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useFetchComments } from "../../hooks/videoplayer/useFetchComments";
import {
  combineFetchVideoPages,
  useFetchUserVideos,
} from "../../hooks/videoplayer/useFetchUserVideos";
import { useFetchVideo } from "../../hooks/videoplayer/useFetchVideo";
import { useIncreaseViewCount } from "../../hooks/videoplayer/useIncreaseViewCount";
import {
  increaseDislike,
  increaseLike,
} from "../../hooks/videoplayer/useLikeDislike";
import { getUserId, parseUserId } from "../../networks";
import { defaultSocialFeedFee } from "../../utils/fee";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT } from "../../utils/social-feed";
import {
  neutral22,
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold13,
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { VideoTab } from "../Video/component/VideoTab";

export const VideoDetailScreen: ScreenFC<"VideoDetail"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const { data: video } = useFetchVideo({ identifier: id });
  useIncreaseViewCount({
    identifier: id,
    user: userId,
  });
  const authorNSInfo = useNSUserInfo(video?.createdBy);
  const [, userAddress] = parseUserId(video?.createdBy);
  const [likeNum, setLikeNum] = useState(0);
  const [dislikeNum, setDislikeNum] = useState(0);
  const [comment, setComment] = useState("");
  const { data: comments } = useFetchComments({
    identifier: id,
  });
  const [commentList, setCommentList] = useState<CommentInfo[]>([]);
  const { postFee } = useGetPostFee(selectedNetworkId, PostCategory.Normal);
  const [isCreateCommentLoading, setCreateCommentLoading] = useState(false);
  const inputMinHeight = 20;
  const inputHeight = useSharedValue(inputMinHeight);
  const inputMaxHeight = 400;

  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : tinyAddress(userAddress, 16);

  useEffect(() => {
    if (video) {
      setLikeNum(video.like);
      setDislikeNum(video.dislike);
    }
  }, [video, username]);

  const { data: userVideos } = useFetchUserVideos({
    createdBy: video?.createdBy!,
    offset: 0,
    limit: 10,
  });

  const moreVideos = useMemo(
    () => (userVideos ? combineFetchVideoPages(userVideos.pages) : []),
    [userVideos]
  );

  const videoLike = async () => {
    if (!video || !video.id || !userId || !selectedNetworkId) return;
    const req: LikeRequest = {
      identifier: video.id,
      user: userId,
    };
    const res = await increaseLike(req, selectedNetworkId);
    if (res === 0) {
      setLikeNum((likenum) => likenum + 1);
    }
  };
  const videoDislike = async () => {
    if (!video || !video.id || !userId || !selectedNetworkId) return;
    const req: DislikeRequest = {
      identifier: video.id,
      user: userId,
    };
    const res = await increaseDislike(req, selectedNetworkId);
    if (res === 0) {
      setDislikeNum((dislikenum) => dislikenum + 1);
    }
  };

  const tipVideo = () => {
    setTipModalVisible(true);
  };

  const handleTextChange = (text: string) => {
    // Comments are blocked at 2500
    if (text.length > SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT) return;
    setComment(text);
  };

  const handleComment = async () => {
    setCreateCommentLoading(true);
    if (!video || !comment) return;
    if (!wallet || !wallet.connected || !wallet.address) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.createVideoComment(
        {
          videoIdentifier: video.id,
          comment,
        },
        defaultSocialFeedFee,
        "",
        [{ amount: postFee.toString(), denom: "utori" }]
      );
      console.log("resresresres", res);

      if (res.transactionHash) {
        setToastSuccess({
          title: "Comment created successfully",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to create comment",
        message: `Error: ${err}`,
      });
    } finally {
      setCreateCommentLoading(false);
    }
  };

  useEffect(() => {
    if (!comments) return;
    const comment_list: CommentInfo[] = [];
    comments.map((comment) => {
      comment_list.push(comment);
    });
    setCommentList(comment_list);
  }, [comments]);

  console.log("moreVideosmoreVideosmoreVideosmoreVideos", moreVideos);

  if (!video) {
    return <></>;
  }
  return (
    <ScreenContainer
      headerChildren={<BrandText>{video.videoMetaInfo.title}</BrandText>}
      isLarge
      responsive
    >
      <View style={{ width: "100%" }}>
        <VideoTab
          setTab={() => {
            navigation.navigate("Video");
          }}
        />

        <View style={pagePanelStyle}>
          <View style={pageLeftPanelStyle}>
            {video && (
              <MediaPlayerVideo
                videoMetaInfo={video.videoMetaInfo}
                videoId={video.id}
                authorId={userId}
                resizeMode={ResizeMode.CONTAIN}
                style={{
                  borderRadius: 8,
                  maxHeight: 600,
                }}
              />
            )}

            <SpacerColumn size={1.5} />
            <BrandText style={fontSemibold20}>
              {video?.videoMetaInfo.title}
            </BrandText>

            <SpacerColumn size={1.5} />
            <View style={videoInfoStyle}>
              <View style={avatarDetailStyle}>
                <OmniLink
                  to={{
                    screen: "UserPublicProfile",
                    params: { id: video.createdBy },
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {/*---- User image */}
                  <UserAvatarWithFrame
                    userId={video.createdBy}
                    size="XXS"
                    noFrame
                  />
                  <SpacerRow size={1.5} />
                  <BrandText style={contentNameStyle}>@{username}</BrandText>
                </OmniLink>
              </View>

              <SpacerRow size={1} />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <BrandText style={videoStatsTextStyle}>
                  {video?.viewCount} views
                </BrandText>
                <DotSeparator
                  style={{ marginHorizontal: layout.spacing_x0_75 }}
                />
                <DateTime
                  date={new Date(video.createdAt * 1000).toDateString()}
                  textStyle={{ color: neutral77 }}
                />
              </View>
              <View style={btnGroupStyle}>
                <Pressable onPress={videoLike} style={buttonContainerStyle}>
                  <SVG source={Like} />
                  <SpacerRow size={1} />
                  <BrandText style={fontSemibold13}>{likeNum}</BrandText>
                </Pressable>
                <SpacerRow size={1.5} />
                <Pressable onPress={videoDislike} style={buttonContainerStyle}>
                  <SVG source={Dislike} />
                  <SpacerRow size={1} />
                  <BrandText style={fontSemibold13}>{dislikeNum}</BrandText>
                </Pressable>
                <SpacerRow size={1.5} />
                <Pressable onPress={tipVideo} style={buttonContainerStyle}>
                  <SVG source={TipIcon} />
                  <SpacerRow size={1} />
                  <BrandText style={fontSemibold13}>Tip</BrandText>
                </Pressable>
              </View>
            </View>

            <SpacerColumn size={1.5} />
            <BrandText style={fontMedium13}>
              {video?.videoMetaInfo.description}
            </BrandText>
            <SpacerColumn size={3} />
            <BrandText style={fontSemibold16}>
              {commentList.length} comments
            </BrandText>
            <SpacerColumn size={1.5} />
            <View style={flexRowItemCenterStyle}>
              <UserAvatarWithFrame userId={userId} size="XXS" noFrame />
              <SpacerRow size={2} />
              <View style={{ flex: 1 }}>
                <TextInput
                  value={comment}
                  placeholder="Leave your comment here"
                  placeholderTextColor={neutral77}
                  onChangeText={handleTextChange}
                  multiline
                  onContentSizeChange={(e) => {
                    // TODO: onContentSizeChange is not fired when deleting lines. We can only grow the input, but not shrink
                    if (e.nativeEvent.contentSize.height < inputMaxHeight) {
                      inputHeight.value = e.nativeEvent.contentSize.height;
                    }
                  }}
                  style={[
                    fontSemibold14,
                    {
                      height: comment
                        ? inputHeight.value || inputMinHeight
                        : inputMinHeight,
                      width: "100%",
                      color: secondaryColor,
                      //@ts-ignore
                      outlineStyle: "none",
                      outlineWidth: 0,
                    },
                  ]}
                />
                <SpacerColumn size={0.5} />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: neutral77,
                  }}
                />
              </View>
              <SpacerRow size={2} />
              <PrimaryButton
                size="M"
                text="Comment"
                disabled={!comment.trim() || !wallet}
                isLoading={isCreateCommentLoading}
                onPress={handleComment}
              />
            </View>

            {commentList.map((comment, index) => (
              <>
                <SpacerColumn size={2.5} />
                <VideoComment key={index} comment={comment} />
              </>
            ))}
          </View>

          <SpacerRow size={3} />
          <View style={pageRightPanelStyle}>
            <BrandText style={rightTitleStyle}>
              More videos from
              <OmniLink
                to={{
                  screen: "UserPublicProfile",
                  params: { id: video.createdBy },
                }}
              >
                <BrandText> @{username}</BrandText>
              </OmniLink>
            </BrandText>

            <View style={flexColumnItemStyle}>
              <Animated.FlatList
                scrollEventThrottle={0.1}
                data={moreVideos}
                numColumns={1}
                renderItem={({ item: videoInfo }) => (
                  <VideoCard video={videoInfo} hideAuthor />
                )}
                ItemSeparatorComponent={() => <SpacerColumn size={2.5} />}
              />
            </View>
          </View>
        </View>
      </View>
      <TipModal
        author={username}
        postId={id}
        onClose={() => setTipModalVisible(false)}
        isVisible={tipModalVisible}
      />
    </ScreenContainer>
  );
};

//TODO: Fix these styles

const flexRowItemCenterStyle: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};
const flexColumnItemStyle: ViewStyle = {
  display: "flex",
  flexDirection: "column",
};
const avatarDetailStyle: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};
const videoInfoStyle: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};
const btnGroupStyle: ViewStyle = {
  marginLeft: "auto",
  display: "flex",
  flexDirection: "row",
};

const buttonContainerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingLeft: layout.spacing_x1_5,
  paddingRight: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
  backgroundColor: neutral22,
  borderRadius: layout.spacing_x4,
};

const pagePanelStyle: ViewStyle = {
  paddingTop: layout.spacing_x2_5,
  width: "100%",
  display: "flex",
  flexDirection: "row",
};
const pageLeftPanelStyle: ViewStyle = {
  flex: 1,
};
const pageRightPanelStyle: ViewStyle = {
  width: "100%",
  maxWidth: 308,
};
const rightTitleStyle: TextStyle = {
  ...fontSemibold20,
  paddingBottom: layout.spacing_x2_5,
};

const contentNameStyle: TextStyle = { ...fontSemibold14, color: primaryColor };
const videoStatsTextStyle: TextStyle = {
  ...fontMedium13,
  color: neutral77,
};
