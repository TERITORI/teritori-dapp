import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import Animated from "react-native-reanimated";
import { v4 as uuidv4 } from "uuid";

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
import { OmniLink } from "../../components/OmniLink";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CreatedByView } from "../../components/VideoPlayer/CreatedByView";
import { MoreVideoPlayerCard } from "../../components/VideoPlayer/MoreVideoCard";
import VideoPlayerSeekBar from "../../components/VideoPlayer/VideoPlayerSeekBar";
import { VideoPlayerTab } from "../../components/VideoPlayer/VideoPlayerTab";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { UserAvatarWithFrame } from "../../components/images/AvatarWithFrame";
import { TipModal } from "../../components/socialFeed/SocialActions/TipModal";
import { DateTime } from "../../components/socialFeed/SocialThread/DateTime";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useVideoPlayer } from "../../context/VideoPlayerContext";
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
import { parseUserId, getUserId } from "../../networks";
import { defaultSocialFeedFee } from "../../utils/fee";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";

import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId, parseUserId } from "../../networks";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { ipfsPinataUrl } from "../../utils/ipfs";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT } from "../../utils/social-feed";
import {
  neutral77,
  neutral17,
  primaryColor,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold14,
  fontMedium14,
  fontSemibold13,
  fontSemibold20, fontMedium16,
  fontSemibold20,
  fontMedium16,
  fontSemibold16,
  // fontSemibold12,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { lastViewDate } from "../../utils/videoPlayer";

import {useIncreaseViewCount} from "../../hooks/video/useIncreaseViewCount";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { tinyAddress } from "../../utils/text";

const styles = StyleSheet.create({
  commentContent: {
    marginTop: "0.5em",
    display: "flex",
    flexDirection: "row",
    marginLeft: "40px",
    fontSize: 13,
    gap: "0.6em",
  },
  blueContents: StyleSheet.flatten([
    fontSemibold13,
    {
      color: "#16BBFF",
    },
  ]),
  flexRowItemCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flexColumnItem: {
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    aspectRatio: 1,
    width: "32px",
    borderRadius: 1000,
    marginRight: layout.padding_x1,
  },
  avatarDetail: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  videoInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: layout.padding_x1_5,
  },
  btnGroup: {
    marginLeft: "auto",
    display: "flex",
    flexDirection: "row",
  },
  comments: {
    fontSize: 16,
    marginTop: "1.5em",
    marginBottom: "0.875em",
  },
  outlineButtonContainer: {
    marginLeft: "0.5em",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: layout.padding_x1,
    paddingRight: layout.padding_x1_5,
    paddingVertical: layout.padding_x1,
    backgroundColor: "transparent",
    borderRadius: layout.padding_x4,
    gap: layout.padding_x1_5,
    border: "1px solid #2B2B33",
  },
  buttonContainer: {
    marginLeft: "0.5em",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: layout.padding_x1,
    paddingRight: layout.padding_x1_5,
    paddingVertical: layout.padding_x1,
    backgroundColor: "#2B2B33",
    borderRadius: layout.padding_x4,
    gap: layout.padding_x1_5,
  },
  pageConatiner: {
    width: "100%",
    paddingHorizontal: 80,
    paddingBottom: 80,
    fontFamily: "Exo_500Medium",
    color: "white",
  },
  menuBox: {
    marginTop: layout.padding_x2_5,
    marginBottom: layout.padding_x1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.padding_x3,
  },
  contentGroup: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: layout.padding_x1,
    zIndex: 999,
  },
  unitBoxEven: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.padding_x3,
    paddingVertical: layout.padding_x0_5,
    backgroundColor: neutral17,
    borderRadius: layout.padding_x1,
    height: 48,
  },
  uniBoxOdd: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.padding_x3,
    paddingVertical: layout.padding_x0_5,
    borderRadius: layout.padding_x1,
    height: 48,
  },
  menuText: StyleSheet.flatten([
    fontSemibold13,
    {
      color: neutral77,
    },
  ]),
  index: {
    width: layout.padding_x2_5,
    textAlign: "center",
  },
  text: StyleSheet.flatten([
    fontMedium14,
    {
      color: neutral77,
      marginTop: layout.padding_x0_5,
    },
  ]),
  leftBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1_5,
  },
  textBox: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 40,
  },
  rightBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x2_5,
  },
  albumBox: {
    marginTop: layout.padding_x2_5,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    zIndex: 999,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: layout.padding_x4,
  },
  albumImg: {
    width: 216,
    height: 216,
  },
  artistText: StyleSheet.flatten([
    fontSemibold20,
    {
      color: primaryColor,
      marginTop: layout.padding_x0_5,
    },
  ]),
  infoText: StyleSheet.flatten([
    fontSemibold13,
    {
      marginTop: layout.padding_x1,
      marginBottom: layout.padding_x0_5,
    },
  ]),
  tagText: StyleSheet.flatten([
    fontSemibold13,
    {
      color: primaryColor,
    },
  ]),
  verticalBox: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: 420,
  },
  oneLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: layout.padding_x2_5,
    gap: layout.padding_x2,
  },
  playButton: {
    padding: layout.padding_x1,
    paddingRight: layout.padding_x1_5,
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1,
    borderRadius: layout.padding_x1,
    backgroundColor: primaryColor,
  },
  tipButton: {
    padding: layout.padding_x1,
    paddingRight: layout.padding_x1_5,
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1,
    borderRadius: layout.padding_x1,
    backgroundColor: "#2B2B33",
  },
  playButtonText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: "#2B0945",
    },
  ]),
  tipButtonText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: primaryColor,
    },
  ]),
  actionBox: {
    flexDirection: "row",
    gap: layout.padding_x2,
  },
  addButton: {
    padding: layout.padding_x1,
    paddingRight: layout.padding_x1_5,
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1,
    borderRadius: layout.padding_x1,
    backgroundColor: "#2B2B33",
  },
  addButtonText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: primaryColor,
    },
  ]),
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2B2B33",
  },
  pagePanel: {
    paddingTop: layout.padding_x1_5,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  pageLeftPanel: {
    flex: 1,
  },
  pageRightPanel: {
    paddingLeft: layout.padding_x1_5,
    paddingRight: layout.padding_x1_5,
  },
  rightTitle: {
    fontFamily: "Exo_500Medium",

    paddingBottom: layout.padding_x1_5,
  },
  leftVideoName: {
    fontFamily: "Exo_500Medium",
    fontSize: "1.5em",

    paddingBottom: layout.padding_x1_5,
  },
  contentName: StyleSheet.flatten([fontSemibold14]),
  contentDescription: StyleSheet.flatten([
    fontMedium14,
    {
      color: neutral77,
    },
  ]),
  contentDate: StyleSheet.flatten([
    fontMedium14,
    {
      color: neutral77,
      marginLeft: "0.5em",
    },
  ]),
  tipContent: StyleSheet.flatten([fontMedium14]),
  commentTip: StyleSheet.flatten([
    fontMedium14,
    {
      color: neutral77,
      marginLeft: "0.5em",
    },
  ]),
  commentReply: StyleSheet.flatten([
    fontMedium16,
    {
      marginLeft: "0.5em",
    },
  ]),
  moreVideoGrid: {
    margin: layout.padding_x3,
  },
});

export const VideoShowScreen: ScreenFC<"VideoShow"> = ({
  route: {
    params: { id },
  },
}) => {
  const { setVideoMeta, setVideoRef } = useVideoPlayer();
  const navigation = useAppNavigation();

  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);

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
  const [createdBy, setCreatedBy] = useState("");
  const authorNSInfo = useNSUserInfo(createdBy);
  const [userAddress, setUserAddress] = useState("");
  const [likeNum, setLikeNum] = useState(0);
  const [dislikeNum, setDislikeNum] = useState(0);
  const [comment, setComment] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: comments } = useFetchComments({
    identifier: id,
  });

  const [commentList, setCommentList] = useState<CommentInfo[]>([]);

  useEffect(() => {
    setVideoRef(videoRef);
  }, [videoRef, setVideoRef]);

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

  useEffect(() => {
    if (data) {
      setCreatedBy(data.createdBy);
      const [, userAddr] = parseUserId(data.createdBy);
      setUserAddress(userAddr);
      setLikeNum(data.like);
      setDislikeNum(data.dislike);
      setVideoMeta((videoMeta) => {
        return {
          ...videoMeta,
          title: data.videoMetaInfo.title,
          createdBy: data.createdBy,
          userName: username,
          duration: data.videoMetaInfo.duration,
        };
      });
    }
  }, [data, username, setVideoMeta]);

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
          title: "Uploaded video successfully",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to upload video",
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
      <View style={styles.pageConatiner}>
        <VideoPlayerTab
          setTab={() => {
            navigation.navigate("VideoPlayer");
          }}
        />

        <View style={styles.pagePanel}>
          <View style={styles.pageLeftPanel}>
            {data && (
              <video
                src={ipfsURLToHTTPURL(data.videoMetaInfo.url)}
                controls
                ref={videoRef}
                style={{
                  borderRadius: 10,
                  paddingBottom: layout.padding_x1_5,
                }}
              />
            )}
            <View style={styles.leftVideoName}>
              <BrandText>{data?.videoMetaInfo.title}</BrandText>
            </View>
            <View style={styles.videoInfo}>
              <View style={styles.avatarDetail}>
                <Image
                  // @ts-ignore
                  source={require("../../../assets/icon.png")}
                  style={styles.avatar}
                />
                <Pressable>
                  <BrandText style={styles.contentName}>@{username}</BrandText>
                </Pressable>
              </View>
              <View
                style={{
                  marginLeft: "0.5em",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <BrandText style={styles.contentDescription}>
                  {data?.viewCount} views
                </BrandText>
                {/* A dot separator */}
                <View
                  style={{
                    backgroundColor: neutral77,
                    height: 2,
                    width: 2,
                    borderRadius: 999,
                    marginHorizontal: layout.padding_x0_75,
                  }}
                />
                {/*---- Date */}
                <DateTime
                  date={data.createdAt}
                  textStyle={{ color: neutral77 }}
                />
              </View>
              <View style={styles.btnGroup}>
                <Pressable onPress={videoLike} style={styles.buttonContainer}>
                  <SVG source={Like} />
                  <BrandText style={styles.tipContent}>{likeNum}</BrandText>
                </Pressable>
                <Pressable
                  onPress={videoDislike}
                  style={styles.buttonContainer}
                >
                  <SVG source={Dislike} />
                  <BrandText style={styles.tipContent}>{dislikeNum}</BrandText>
                </Pressable>
                <Pressable onPress={tipVideo} style={styles.buttonContainer}>
                  <SVG source={TipIcon} />
                  <BrandText style={styles.tipContent}>Tip</BrandText>
                </Pressable>
              </View>
            </View>
            <View style={styles.blueContents} />
            <BrandText style={styles.contentName}>
              {data?.videoMetaInfo.description}
            </BrandText>
            <BrandText style={styles.comments}>
              {commentList.length} comments
            </BrandText>
            <View style={styles.flexRowItemCenter}>
              <UserAvatarWithFrame
                style={{
                  marginRight: layout.padding_x2,
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
              <View key={`commet-${index}`}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <UserAvatarWithFrame
                    style={{
                      marginRight: layout.padding_x2,
                    }}
                    userId={comment.createdBy}
                    size="S"
                  />
                  <BrandText style={styles.blueContents}>
                    <CreatedByView user={comment.createdBy} />
                  </BrandText>
                  <BrandText style={styles.contentDate}>
                    <DateTime
                      date={new Date(comment.createdAt * 1000).toISOString()}
                      textStyle={{ color: neutral77 }}
                    />
                  </BrandText>
                </View>
                <View style={styles.commentContent}>{comment.comment}</View>
              </View>
            ))}
          </View>
          <View style={styles.pageRightPanel}>
            <BrandText style={styles.rightTitle}>
              More videos from @nickname
            </BrandText>
            <View style={styles.flexColumnItem}>
              <Animated.FlatList
                scrollEventThrottle={0.1}
                data={videos}
                numColumns={1}
                renderItem={({ item: videoInfo }) => {
                  if (videoInfo.identifier === data.identifier) return <></>;
                  return (
                    <View style={styles.moreVideoGrid}>
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
      <VideoPlayerSeekBar />
    </ScreenContainer>
  );
};
