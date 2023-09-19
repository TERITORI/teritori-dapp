import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Pressable,
  TextInput,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { v4 as uuidv4 } from "uuid";

import { VideoComment } from "./VideoComment";
import Dislike from "../../../assets/icons/player/dislike.svg";
import Like from "../../../assets/icons/player/like.svg";
import TipIcon from "../../../assets/icons/tip.svg";
import {
  LikeRequest,
  DislikeRequest,
  CommentInfo,
} from "../../api/video/v1/video";
import { signingVideoPlayerClient } from "../../client-creators/videoplayerClient";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { MoreVideoPlayerCard } from "../../components/VideoPlayer/MoreVideoCard";
import { VideoPlayerTab } from "../../components/VideoPlayer/VideoPlayerTab";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { UserAvatarWithFrame } from "../../components/images/AvatarWithFrame";
import { TipModal } from "../../components/socialFeed/SocialActions/TipModal";
import { DateTime } from "../../components/socialFeed/SocialThread/DateTime";
import { SpacerRow } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useFetchComments } from "../../hooks/video/useFetchComments";
import { useFetchVideo } from "../../hooks/video/useFetchVideo";
import { useIncreaseViewCount } from "../../hooks/video/useIncreaseViewCount";
import {
  increaseLike,
  increaseDislike,
} from "../../hooks/video/useLikeDislike";
import {
  useUserFetchVideos,
  combineFetchVideoPages,
} from "../../hooks/video/useUserFetchVideos";
import { getUserId } from "../../networks";
import { defaultSocialFeedFee } from "../../utils/fee";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT } from "../../utils/social-feed";
import { neutral77, secondaryColor } from "../../utils/style/colors";
import {
  fontSemibold14,
  fontMedium14,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";

export const VideoShowScreen: ScreenFC<"VideoShow"> = ({
  route: {
    params: { id },
  },
}) => {
  // TODO: use MediaPlayerContext
  // const { setVideoMeta, setVideoRef } = useVideoPlayer();
  const navigation = useAppNavigation();

  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);

  // TODO: use MediaPlayerContext
  // const [videoListForLibrary, setVideoListForLibrary] = useState<VideoInfo[]>(
  //   []
  // );
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const { data } = useFetchVideo({ identifier: id });
  useIncreaseViewCount({
    identifier: id,
    user: userId,
  });
  const [createdBy] = useState("");
  const authorNSInfo = useNSUserInfo(createdBy);
  const [userAddress] = useState("");
  const [likeNum, setLikeNum] = useState(0);
  const [dislikeNum, setDislikeNum] = useState(0);
  const [comment, setComment] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: comments } = useFetchComments({
    identifier: id,
  });

  const [commentList, setCommentList] = useState<CommentInfo[]>([]);

  // TODO: use MediaPlayerContext
  // useEffect(() => {
  //   setVideoRef(videoRef);
  // }, [videoRef, setVideoRef]);

  useEffect(() => {
    if (!comments) return;
    const comment_list: CommentInfo[] = [];
    comments.map((comment) => {
      comment_list.push(comment);
    });
    setCommentList(comment_list);
  }, [comments]);

  const username = useMemo(() => {
    return authorNSInfo?.metadata?.tokenId
      ? authorNSInfo?.metadata?.tokenId
      : tinyAddress(userAddress);
  }, [authorNSInfo, userAddress]);

  // TODO: use MediaPlayerContext
  // useEffect(() => {
  //   if (data) {
  //     setCreatedBy(data.createdBy);
  //     const [, userAddr] = parseUserId(data.createdBy);
  //     setUserAddress(userAddr);
  //     setLikeNum(data.like);
  //     setDislikeNum(data.dislike);
  //     setVideoMeta((videoMeta) => {
  //       return {
  //         ...videoMeta,
  //         title: data.videoMetaInfo.title,
  //         createdBy: data.createdBy,
  //         userName: username,
  //         duration: data.videoMetaInfo.duration,
  //       };
  //     });
  //   }
  // }, [data, username, setVideoMeta]);

  const { data: userVideos } = useUserFetchVideos({
    createdBy: data?.createdBy!,
    offset: 0,
    limit: 10,
  });

  const videos = useMemo(
    () => (userVideos ? combineFetchVideoPages(userVideos.pages) : []),
    [userVideos]
  );

  const videoLike = async () => {
    if (!data || !data.identifier || !userId || !selectedNetworkId) return;
    const req: LikeRequest = {
      identifier: data.identifier,
      user: userId,
    };
    const res = await increaseLike(req, selectedNetworkId);
    if (res === 0) {
      setLikeNum((likenum) => likenum + 1);
    }
  };
  const videoDislike = async () => {
    if (!data || !data.identifier || !userId || !selectedNetworkId) return;
    const req: DislikeRequest = {
      identifier: data.identifier,
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
    if (!data || !comment) return;
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
          identifier: uuidv4(),
          videoIdentifier: data.identifier,
          comment,
        },
        defaultSocialFeedFee,
        ""
      );

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
    }
  };

  if (!data) {
    return <></>;
  }
  return (
    <ScreenContainer
      headerChildren={<BrandText>{data.videoMetaInfo.title}</BrandText>}
      fullWidth
    >
      <View style={pageContainerStyle}>
        <VideoPlayerTab
          setTab={() => {
            navigation.navigate("VideoPlayer");
          }}
        />

        <View style={pagePanelStyle}>
          <View style={pageLeftPanelStyle}>
            {data && (
              <video
                src={ipfsURLToHTTPURL(data.videoMetaInfo.url)}
                controls
                ref={videoRef}
                style={{
                  borderRadius: 10,
                  paddingBottom: layout.spacing_x1_5,
                }}
              />
            )}
            <BrandText style={leftVideoNameStyle}>
              {data?.videoMetaInfo.title}
            </BrandText>
            <View style={videoInfoStyle}>
              <View style={avatarDetailStyle}>
                <Image
                  source={require("../../../assets/icon.png")}
                  style={avatarStyle}
                />
                <Pressable>
                  <BrandText style={contentNameStyle}>@{username}</BrandText>
                </Pressable>
              </View>
              <View
                style={{
                  marginLeft: "0.5em",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <BrandText style={contentDescriptionStyle}>
                  {data?.viewCount} views
                </BrandText>
                {/* A dot separator */}
                <View
                  style={{
                    backgroundColor: neutral77,
                    height: 2,
                    width: 2,
                    borderRadius: 999,
                    marginHorizontal: layout.spacing_x0_75,
                  }}
                />
                {/*---- Date */}
                <DateTime
                  date={data.createdAt.toString()}
                  textStyle={{ color: neutral77 }}
                />
              </View>
              <View style={btnGroupStyle}>
                <Pressable onPress={videoLike} style={buttonContainerStyle}>
                  <SVG source={Like} />
                  <SpacerRow size={1.5} />
                  <BrandText style={tipContentStyle}>{likeNum}</BrandText>
                </Pressable>
                <Pressable onPress={videoDislike} style={buttonContainerStyle}>
                  <SVG source={Dislike} />
                  <SpacerRow size={1.5} />
                  <BrandText style={tipContentStyle}>{dislikeNum}</BrandText>
                </Pressable>
                <Pressable onPress={tipVideo} style={buttonContainerStyle}>
                  <SVG source={TipIcon} />
                  <SpacerRow size={1.5} />
                  <BrandText style={tipContentStyle}>Tip</BrandText>
                </Pressable>
              </View>
            </View>

            {/*<View style={blueContentsStyle} />*/}

            <BrandText style={contentNameStyle}>
              {data?.videoMetaInfo.description}
            </BrandText>
            <BrandText style={commentsStyle}>
              {commentList.length} comments
            </BrandText>
            <View style={flexRowItemCenterStyle}>
              <UserAvatarWithFrame
                style={{
                  marginRight: layout.spacing_x2,
                }}
                userId={userId}
                size="S"
              />
              <TextInput
                placeholder="Write your comment"
                placeholderTextColor={neutral77}
                onChangeText={handleTextChange}
                style={[
                  fontSemibold16,
                  {
                    height: 20,
                    width: "100%",
                    color: secondaryColor,
                    //@ts-ignore
                    outlineStyle: "none",
                    outlineWidth: 0,
                  },
                ]}
              />
              <PrimaryButton
                size="M"
                text="Comment"
                disabled={!comment.trim()}
                onPress={handleComment}
              />
            </View>
            {commentList.map((comment, index) => (
              <VideoComment key={index} comment={comment} />
            ))}
          </View>
          <View style={pageRightPanelStyle}>
            <BrandText style={rightTitleStyle}>
              More videos from @nickname
            </BrandText>
            <View style={flexColumnItemStyle}>
              <Animated.FlatList
                scrollEventThrottle={0.1}
                data={videos}
                numColumns={1}
                renderItem={({ item: videoInfo }) => {
                  if (videoInfo.identifier === data.identifier) return <></>;
                  return (
                    <View style={moreVideoGridStyle}>
                      <MoreVideoPlayerCard item={videoInfo} />
                    </View>
                  );
                }}
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
const avatarStyle: ImageStyle = {
  aspectRatio: 1,
  width: "32px",
  borderRadius: 1000,
  marginRight: layout.spacing_x1,
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
  paddingBottom: layout.spacing_x1_5,
};
const btnGroupStyle: ViewStyle = {
  marginLeft: "auto",
  display: "flex",
  flexDirection: "row",
};
const commentsStyle: TextStyle = {
  fontSize: 16,
  marginTop: "1.5em",
  marginBottom: "0.875em",
};

const buttonContainerStyle: ViewStyle = {
  marginLeft: "0.5em",
  flexDirection: "row",
  alignItems: "center",
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
  backgroundColor: "#2B2B33",
  borderRadius: layout.spacing_x4,
};
const pageContainerStyle: TextStyle = {
  width: "100%",
  paddingHorizontal: 80,
  paddingBottom: 80,
  fontFamily: "Exo_500Medium",
  color: "white",
};
const pagePanelStyle: ViewStyle = {
  paddingTop: layout.spacing_x1_5,
  width: "100%",
  display: "flex",
  flexDirection: "row",
};
const pageLeftPanelStyle: ViewStyle = {
  flex: 1,
};
const pageRightPanelStyle: ViewStyle = {
  paddingLeft: layout.spacing_x1_5,
  paddingRight: layout.spacing_x1_5,
};
const rightTitleStyle: TextStyle = {
  fontFamily: "Exo_500Medium",
  paddingBottom: layout.spacing_x1_5,
};
const leftVideoNameStyle: TextStyle = {
  fontFamily: "Exo_500Medium",
  // fontSize: "1.5em",
  paddingBottom: layout.spacing_x1_5,
};
const contentNameStyle: TextStyle = { ...fontSemibold14 };
const contentDescriptionStyle: TextStyle = {
  ...fontMedium14,
  color: neutral77,
};
const tipContentStyle: TextStyle = { ...fontMedium14 };
const moreVideoGridStyle: ViewStyle = {
  margin: layout.spacing_x3,
};
