import React, { useState } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";

import Album from "../../../assets/music-player/album.png";
import MorePrimary from "../../../assets/music-player/more-primary.svg";
import MoreSecondary from "../../../assets/music-player/more-secondary.svg";
import PlayOther from "../../../assets/music-player/play-other.svg";
import PlaySecondary from "../../../assets/music-player/play-secondary.svg";
import Time from "../../../assets/music-player/time.svg";
import Track from "../../../assets/music-player/track.png";
import { BrandText } from "../../components/BrandText";
import { DetailAlbumMenu } from "../../components/MusicPlayer/DetailAlbumMenu";
import { MusicPlayerTab } from "../../components/MusicPlayer/MusicPlayerTab";
import { TrackHoverMenu } from "../../components/MusicPlayer/TrackHoverMenu";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { ScreenFC } from "../../utils/navigation";
import { neutral77, neutral17, primaryColor } from "../../utils/style/colors";
import {
  fontSemibold14,
  fontMedium14,
  fontSemibold13,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const MyAlbumScreen: ScreenFC<"MyAlbum"> = () => {
  const unitTrackData = {
    name: "Song Name",
    img: Track,
    time: "4:01",
  };
  const trackData = Array(4).fill(unitTrackData);

  const initIndexHoverState = {
    index: 0,
    state: false,
  };
  const [indexHoverState, setIndexHoverState] =
    useState<any>(initIndexHoverState);
  const [openDetailAlbumMenu, setOpenDetailAlbumMenu] =
    useState<boolean>(false);
  const [openTrackMenu, setOpenTrackMenu] = useState<boolean>(false);
  const [clickedIndex, setClickedIndex] = useState<number>(0);

  const styles = StyleSheet.create({
    pageContainer: {
      width: "100%",
      flex: 1,
      paddingHorizontal: 80,
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
  });

  return (
    <ScreenContainer headerChildren={<BrandText>My Album</BrandText>} fullWidth>
      <View style={styles.pageContainer}>
        <MusicPlayerTab />

        <View style={styles.albumBox}>
          <View style={styles.infoBox}>
            <Image source={Album} style={styles.albumImg} />
            <View style={styles.verticalBox}>
              <BrandText>My Album</BrandText>
              <BrandText style={styles.artistText}>Artist</BrandText>
              <BrandText style={styles.infoText}>
                Description here{" "}
                <BrandText style={styles.tagText}>#tag</BrandText> lorem ipsum
                dolor sit <BrandText style={styles.tagText}>#tag</BrandText>{" "}
                amet lorem ipsum. Lorem ipsum dolor sit amet!
              </BrandText>
              <Pressable>
                <BrandText style={styles.tagText}>#tag</BrandText>
              </Pressable>
              <Pressable>
                <BrandText style={styles.tagText}>#tag</BrandText>
              </Pressable>
              <View style={styles.oneLine}>
                <Pressable style={styles.playButton}>
                  <SVG
                    source={PlayOther}
                    width={layout.padding_x2_5}
                    height={layout.padding_x2_5}
                  />
                  <BrandText style={styles.playButtonText}>Play</BrandText>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.actionBox}>
            <Pressable
              style={styles.moreButton}
              onPress={() => {
                setOpenTrackMenu(false);
                setOpenDetailAlbumMenu((value) => !value);
              }}
            >
              <SVG
                height={layout.padding_x2_5}
                width={layout.padding_x2_5}
                source={MorePrimary}
              />
            </Pressable>
            {openDetailAlbumMenu && <DetailAlbumMenu mine />}
          </View>
        </View>

        <View style={styles.menuBox}>
          <View style={styles.leftBox}>
            <BrandText style={[styles.menuText, styles.index]}>#</BrandText>
            <BrandText style={styles.menuText}>Name</BrandText>
          </View>
          <SVG
            source={Time}
            width={layout.padding_x2}
            height={layout.padding_x2}
            style={{ marginRight: 44 }}
          />
        </View>

        <View style={styles.contentGroup}>
          {trackData.map((item: any, index: number) => {
            return (
              <View
                style={index % 2 === 0 ? styles.unitBoxEven : styles.uniBoxOdd}
                key={index}
              >
                <View style={styles.leftBox}>
                  <Pressable
                    // @ts-ignore
                    onMouseEnter={() =>
                      setIndexHoverState(() => {
                        return { index: index + 1, state: true };
                      })
                    }
                    onMouseLeave={() =>
                      setIndexHoverState(() => {
                        return initIndexHoverState;
                      })
                    }
                  >
                    {indexHoverState.state &&
                    indexHoverState.index === index + 1 ? (
                      <SVG
                        source={PlaySecondary}
                        width={layout.padding_x2_5}
                        height={layout.padding_x2_5}
                      />
                    ) : (
                      <BrandText style={[styles.menuText, styles.index]}>
                        {index + 1}
                      </BrandText>
                    )}
                  </Pressable>
                  <BrandText style={fontSemibold14}>{item.name}</BrandText>
                </View>
                <View style={styles.rightBox}>
                  <BrandText style={[fontSemibold14]}>{item.time}</BrandText>
                  <Pressable
                    onPress={() => {
                      setClickedIndex(index + 1);
                      setOpenDetailAlbumMenu(false);
                      setOpenTrackMenu((value) => !value);
                    }}
                  >
                    <SVG
                      source={MoreSecondary}
                      height={layout.padding_x2_5}
                      width={layout.padding_x2_5}
                    />
                  </Pressable>
                </View>
                {openTrackMenu && clickedIndex === index + 1 && (
                  <TrackHoverMenu />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </ScreenContainer>
  );
};
