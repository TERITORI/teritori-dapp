import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Image, Animated } from "react-native";

import Add from "../../../assets/music-player/add.svg";
import MorePrimary from "../../../assets/music-player/more-primary.svg";
// import MoreSecondary from "../../../assets/music-player/more-secondary.svg";
import PlayOther from "../../../assets/music-player/play-other.svg";
import PlaySecondary from "../../../assets/music-player/play-secondary.svg";
import Time from "../../../assets/music-player/time.svg";
import Tip from "../../../assets/music-player/tip-primary.svg";
import { signingMusicPlayerClient } from "../../client-creators/musicplayerClient";
import { BrandText } from "../../components/BrandText";
import { DetailAlbumMenu } from "../../components/MusicPlayer/DetailAlbumMenu";
import { MediaPlayer } from "../../components/MusicPlayer/MediaPlayer";
import { MusicPlayerTab } from "../../components/MusicPlayer/MusicPlayerTab";
// import { TrackHoverMenu } from "../../components/MusicPlayer/TrackHoverMenu";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { TipModal } from "../../components/socialFeed/SocialActions/TipModal";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMusicplayer } from "../../context/MusicplayerProvider";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId, parseUserId } from "../../networks";
import { mustGetMusicplayerClient } from "../../utils/backend";
import { ipfsPinataUrl } from "../../utils/ipfs";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral77, neutral17, primaryColor } from "../../utils/style/colors";
import {
  fontSemibold14,
  fontMedium14,
  fontSemibold13,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { AlbumInfo, AlbumMetadataInfo } from "../../utils/types/music";
import { VideoPlayer } from "../../components/VideoPlayer/VideoPlayer";
import { VideoPlayerCard } from "../../components/VideoPlayer/VideoPlayerCard";
import Thumb_up from "../../../assets/icons/thumb_up.svg";
import Thumb_down from "../../../assets/icons/thumb_down.svg";
import TipIcon from "../../../assets/icons/tip.svg";
import Share from "../../../assets/icons/share.svg";
import Report from "../../../assets/icons/report.svg";
import ArrowDown from "../../../assets/icons/arrow-down.svg";

export const VideoShowScreen: ScreenFC<"VideoShow"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const [idForLibraryList, setIdForLibraryList] = useState<string[]>([]);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const [albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    id: "0",
    name: "",
    description: "",
    image: "",
    createdBy: "",
    audios: [],
  });

  const authorNSInfo = useNSUserInfo(albumInfo.createdBy);
  const [, userAddress] = parseUserId(albumInfo.createdBy);
  const username = authorNSInfo?.metadata?.tokenId
    ? authorNSInfo?.metadata?.tokenId
    : userAddress;

  useEffect(() => {
    const getLibraryIdList = async () => {
      if (!userId) return;
      try {
        const res = await mustGetMusicplayerClient(
          selectedNetworkId
        ).GetAlbumIdListForLibrary({
          user: userId,
        });
        const idList: string[] = [];
        res.albumLibraries.map((libraryInfo, index) => {
          idList.push(libraryInfo.identifier);
        });
        setIdForLibraryList(idList);
      } catch (err) {
        console.log(err);
      }
    };
    getLibraryIdList();
  }, [selectedNetworkId, userId]);

  useEffect(() => {
    const getAlbumInfo = async () => {
      const res = await mustGetMusicplayerClient(selectedNetworkId).GetAlbum({
        identifier: id,
      });
      if (res.musicAlbum) {
        const selectedMusicAlbum = res.musicAlbum;
        const metadata = JSON.parse(
          selectedMusicAlbum.metadata
        ) as AlbumMetadataInfo;
        const audios = metadata.audios;
        const album: AlbumInfo = {
          id: selectedMusicAlbum.identifier,
          description: metadata.description,
          image: metadata.image,
          createdBy: selectedMusicAlbum.createdBy,
          name: metadata.title,
          audios,
        };
        setAlbumInfo(album);
      }
    };
    getAlbumInfo();
  }, [id, selectedNetworkId]);

  const initIndexHoverState = {
    index: 0,
    state: false,
  };
  const [indexHoverState, setIndexHoverState] =
    useState<any>(initIndexHoverState);
  const [openDetailAlbumMenu, setOpenDetailAlbumMenu] =
    useState<boolean>(false);
  // const [openTrackMenu, setOpenTrackMenu] = useState<boolean>(false);
  // const [clickedIndex, setClickedIndex] = useState<number>(0);
  const handleTip = () => {
    setTipModalVisible(true);
  };
  const addToLibrary = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.addToLibrary({ identifier: id });
      if (res.transactionHash) {
        setToastSuccess({
          title: "Add album to my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to add album to my library",
        message: `Error: ${err}`,
      });
    }
  };

  const removeFromLibrary = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.removeFromLibrary({ identifier: id });
      if (res.transactionHash) {
        setToastSuccess({
          title: "remove album from my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to remove album from my library",
        message: `Error: ${err}`,
      });
    }
  };

  const styles = StyleSheet.create({
    commentContent: {
      marginTop: "0.5em",
      display: "flex",
      flexDirection: "row",
      marginLeft: "40px",
      fontSize: "13px",
      gap: "0.6em",
    },
    blueContents: {
      color: "#16BBFF",
      display: "contents",
    },
    flexRowItemCenter: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
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
  });

  const { setAudioSrc, setIsPlay } = useMusicplayer();
  const playAudio = () => {
    if (albumInfo.audios.length > 0) {
      setAudioSrc(ipfsPinataUrl(albumInfo.audios[0].ipfs));
      setIsPlay(true);
    }
  };

  return (
    <ScreenContainer
      headerChildren={<BrandText>Album name</BrandText>}
      fullWidth
    >
      <View style={styles.pageConatiner}>
        <MusicPlayerTab
          setTab={() => {
            navigation.navigate("MusicPlayer");
          }}
        />

        <View style={styles.pagePanel}>
          <View style={styles.pageLeftPanel}>
            <video
              src={ipfsPinataUrl("item.image")}
              controls={true}
              style={{
                borderRadius: 10,
                paddingBottom: layout.padding_x1_5,
              }}
            />
            <View style={styles.leftVideoName}>Video Name</View>
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
                  {"12"} views
                </BrandText>
                <BrandText style={styles.contentDate}>
                  {"12"} days ago
                </BrandText>
              </View>
              <View style={styles.btnGroup}>
                <Pressable style={styles.buttonContainer}>
                  <SVG source={Thumb_up} />
                  143
                </Pressable>
                <Pressable style={styles.buttonContainer}>
                  <SVG source={Thumb_down} />
                  143
                </Pressable>
                <Pressable style={styles.buttonContainer}>
                  <SVG source={TipIcon} />
                  Tip
                </Pressable>
                <Pressable style={styles.outlineButtonContainer}>
                  <SVG source={Share} />
                  Share
                </Pressable>
                <Pressable style={styles.outlineButtonContainer}>
                  <SVG source={Report} />
                  Report
                </Pressable>
              </View>
            </View>
            <BrandText style={styles.contentName}>
              Description here <View style={styles.blueContents}>#tag</View>{" "}
              lorem ipsum dolor sit #tag amet lorem ipsum. Lorem ipsum dolor sit
              amet!
              <br />
              <View style={styles.blueContents}>#tag</View>
              <br />
              <View style={styles.blueContents}>#tag</View>
            </BrandText>
            <BrandText style={styles.comments}>17 comments</BrandText>
            <View style={styles.flexRowItemCenter}>
              <View style={styles.flexRowItemCenter}>
                <Image
                  // @ts-ignore
                  source={require("../../../assets/icon.png")}
                  style={styles.avatar}
                />
                <input
                  type="text"
                  placeholder="Leave your comment here"
                  style={{
                    background: "none",
                    width: "100%",
                    paddingBottom: "8px",
                    border: "none",
                    borderBottom: "1px solid #333",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#777",
                  }}
                />
              </View>
            </View>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Image
                  // @ts-ignore
                  source={require("../../../assets/icon.png")}
                  style={styles.avatar}
                />
                <View style={{ color: "#16BBFF" }}>Nickname</View>
                <BrandText style={styles.contentDate}>3 days ago</BrandText>
              </View>
              <View style={styles.commentContent}>Comment here</View>
              <View style={styles.commentContent}>
                <View style={styles.flexRowItemCenter}>
                  <SVG source={Thumb_up} />
                  <View style={{ marginLeft: "0.3em" }}>11</View>
                </View>
                <View style={styles.flexRowItemCenter}>
                  <SVG source={Thumb_down} />
                  <View style={{ marginLeft: "0.3em" }}>11</View>
                </View>
                <View style={{ marginLeft: "0.3em" }}>reply</View>
              </View>
              <View style={styles.commentContent}>
                <SVG source={ArrowDown} />
                <View
                  style={{
                    color: "#16BBFF",
                  }}
                >
                  1 reply
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Image
                  // @ts-ignore
                  source={require("../../../assets/icon.png")}
                  style={styles.avatar}
                />
                <View style={{ color: "#16BBFF" }}>Nickname</View>
                <BrandText style={styles.contentDate}>3 days ago</BrandText>
              </View>
              <View style={styles.commentContent}>Comment here</View>
              <View style={styles.commentContent}>
                <View style={styles.flexRowItemCenter}>
                  <SVG source={Thumb_up} />
                  <View style={{ marginLeft: "0.3em" }}>11</View>
                </View>
                <View style={styles.flexRowItemCenter}>
                  <SVG source={Thumb_down} />
                  <View style={{ marginLeft: "0.3em" }}>11</View>
                </View>
                <View style={{ marginLeft: "0.3em" }}>reply</View>
              </View>
              <View style={styles.commentContent}>
                <SVG source={ArrowDown} />
                <View
                  style={{
                    color: "#16BBFF",
                  }}
                >
                  1 reply
                </View>
              </View>
            </View>
          </View>
          <View style={styles.pageRightPanel}>
            <View style={styles.rightTitle}>More videos from @nickname</View>
            <Animated.FlatList
              scrollEventThrottle={0.1}
              data={
                // albums
                [
                  {
                    id: "string",
                    name: "string",
                    description: "string",
                    image: "string",
                    createdBy: "string",
                    audios: [
                      {
                        name: "string",
                        ipfs: "string",
                        duration: 1,
                      },
                    ],
                  },
                ]
              }
              numColumns={4}
              renderItem={({ item: albumInfo }) => (
                <View>
                  <VideoPlayerCard
                    item={albumInfo}
                    hasLibrary={
                      [].findIndex((item) => item === albumInfo.id) !== -1
                    }
                  />
                </View>
              )}
              onScroll={() => {}}
              onEndReachedThreshold={1}
              onEndReached={() => {}}
            />
          </View>
        </View>
      </View>
      <TipModal
        author={username}
        postId={id}
        onClose={() => setTipModalVisible(false)}
        isVisible={tipModalVisible}
      />
      <VideoPlayer />
    </ScreenContainer>
  );
};
