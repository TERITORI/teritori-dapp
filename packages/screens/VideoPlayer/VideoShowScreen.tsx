import React, {useEffect, useMemo, useState} from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";

import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import Avatar from "../../../assets/icons/player/avatar.svg";
import Dislike from "../../../assets/icons/player/dislike.svg";
import Flag from "../../../assets/icons/player/flag.svg";
import Like from "../../../assets/icons/player/like.svg";
import Share from "../../../assets/icons/player/share.svg";
import TipIcon from "../../../assets/icons/tip.svg";
import { VideoPlayerTab } from "../../components/videoPlayer/VideoPlayerTab";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useFetchVideo } from "../../hooks/video/useFetchVideo";
import {getUserId, parseUserId} from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";

import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral77, neutral17, primaryColor } from "../../utils/style/colors";
import {
  fontSemibold14,
  fontMedium14,
  fontSemibold13,
  fontSemibold20, fontMedium16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { lastViewDate } from "../../utils/videoPlayer";

import {useIncreaseViewCount} from "../../hooks/video/useIncreaseViewCount";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { tinyAddress } from "../../utils/text";
import {useSelectedNetworkId} from "../../hooks/useSelectedNetwork";

export const VideoShowScreen: ScreenFC<"VideoShow"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);

  const { data } = useFetchVideo({ identifier: id });
  useIncreaseViewCount({
    identifier: id,
    user: userId,
  });
  const [createdBy, setCreatedBy] = useState("");
  const authorNSInfo = useNSUserInfo(createdBy);
  const [userAddress, setUserAddress] = useState("");
  useEffect(() => {
    if (data) {
      setCreatedBy(data.createdBy);
      const [, userAddr] = parseUserId(data.createdBy);
      setUserAddress(userAddr);
    }
  }, [data]);

  const username = useMemo(() => {
    return authorNSInfo?.metadata?.tokenId
      ? authorNSInfo?.metadata?.tokenId
      : tinyAddress(userAddress);
  }, [authorNSInfo, userAddress]);

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
  });

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
                <BrandText style={styles.contentDate}>
                  {lastViewDate(data?.viewLastTimestamp)}
                </BrandText>
                <BrandText style={styles.contentDate}>12 days ago</BrandText>
              </View>
              <View style={styles.btnGroup}>
                <Pressable style={styles.buttonContainer}>
                  <SVG source={Like} />
                  <BrandText style={styles.tipContent}>143</BrandText>
                </Pressable>
                <Pressable style={styles.buttonContainer}>
                  <SVG source={Dislike} />
                  <BrandText style={styles.tipContent}>143</BrandText>
                </Pressable>
                <Pressable style={styles.buttonContainer}>
                  <SVG source={TipIcon} />
                  <BrandText style={styles.tipContent}>Tip</BrandText>
                </Pressable>
                <Pressable style={styles.buttonContainer}>
                  <SVG source={Share} />
                  <BrandText style={styles.tipContent}>Share</BrandText>
                </Pressable>
                <Pressable style={styles.buttonContainer}>
                  <SVG source={Flag} />
                  <BrandText style={styles.tipContent}>Report</BrandText>
                </Pressable>
              </View>
            </View>
            <View style={styles.blueContents} />
            <BrandText style={styles.contentName}>
              {data?.videoMetaInfo.description}
            </BrandText>
            <BrandText style={styles.comments}>17 comments</BrandText>
            <View style={styles.flexRowItemCenter}>
              <View style={styles.flexRowItemCenter}>
                <SVG source={Avatar} style={{ borderRadius: 1000 }} />
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
                <BrandText style={styles.blueContents}>Nickname</BrandText>
                <BrandText style={styles.contentDate}>3 days ago</BrandText>
              </View>
              <View style={styles.commentContent}>Comment here</View>
              <View style={styles.commentContent}>
                <View style={styles.flexRowItemCenter}>
                  <SVG source={Like} />
                  <BrandText style={styles.commentTip}>11</BrandText>
                </View>
                <View style={styles.flexRowItemCenter}>
                  <SVG source={Dislike} />
                  <BrandText style={styles.commentTip}>11</BrandText>
                </View>
                <BrandText style={styles.commentReply}>reply</BrandText>
              </View>
              <View style={styles.commentContent}>
                {/* <SVG source={ArrowDown} /> */}
                <BrandText style={styles.blueContents}>1 reply</BrandText>
              </View>
            </View>
          </View>
          <View style={styles.pageRightPanel}>
            <BrandText style={styles.rightTitle}>
              More videos from @nickname
            </BrandText>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};
