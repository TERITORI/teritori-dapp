import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";

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

export const AlbumNameScreen: ScreenFC<"AlbumName"> = ({
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
    pageConatiner: {
      width: "100%",
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

        <View style={styles.albumBox}>
          <View style={styles.infoBox}>
            <Image
              // @ts-ignore
              source={ipfsPinataUrl(albumInfo.image)}
              style={styles.albumImg}
            />
            <View style={styles.verticalBox}>
              <BrandText>{albumInfo.name}</BrandText>
              <BrandText style={styles.artistText}>{username}</BrandText>
              <BrandText style={styles.infoText}>
                {albumInfo.description}
              </BrandText>
              <View style={styles.oneLine}>
                <Pressable style={styles.playButton} onPress={playAudio}>
                  <SVG
                    source={PlayOther}
                    width={layout.padding_x2_5}
                    height={layout.padding_x2_5}
                  />
                  <BrandText style={styles.playButtonText}>Play</BrandText>
                </Pressable>
                <Pressable
                  style={styles.tipButton}
                  onPress={() => {
                    handleTip();
                  }}
                >
                  <SVG
                    source={Tip}
                    width={layout.padding_x2_5}
                    height={layout.padding_x2_5}
                  />
                  <BrandText style={styles.tipButtonText}>
                    Tip this album
                  </BrandText>
                </Pressable>
                {/* <audio id="audio" src={audioSrc} ref={audioRef} controls /> */}
              </View>
            </View>
          </View>
          <View style={styles.actionBox}>
            {userId &&
              userId !== albumInfo.createdBy &&
              idForLibraryList.findIndex((item) => item === id) !== -1 && (
                <Pressable
                  style={styles.addButton}
                  onPress={() => {
                    removeFromLibrary();
                  }}
                >
                  <SVG
                    height={layout.padding_x2_5}
                    width={layout.padding_x2_5}
                    source={Add}
                  />
                  <BrandText style={styles.addButtonText}>
                    Remove from library
                  </BrandText>
                </Pressable>
              )}
            {userId &&
              userId !== albumInfo.createdBy &&
              idForLibraryList.findIndex((item) => item === id) === -1 && (
                <Pressable style={styles.addButton}>
                  <SVG
                    height={layout.padding_x2_5}
                    width={layout.padding_x2_5}
                    source={Add}
                    onPress={() => {
                      addToLibrary();
                    }}
                  />
                  <BrandText style={styles.addButtonText}>
                    Add to library
                  </BrandText>
                </Pressable>
              )}
            <Pressable
              style={styles.moreButton}
              onPress={() => {
                // setOpenTrackMenu(false);
                setOpenDetailAlbumMenu((value) => !value);
              }}
            >
              <SVG
                height={layout.padding_x2_5}
                width={layout.padding_x2_5}
                source={MorePrimary}
              />
            </Pressable>
            {openDetailAlbumMenu && <DetailAlbumMenu id={albumInfo.id} />}
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
          {albumInfo.audios.map((item: any, index: number) => {
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
                  <BrandText style={[fontSemibold14]}>
                    {parseFloat(item.duration).toFixed(0)} s
                  </BrandText>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <TipModal
        author={username}
        postId={id}
        onClose={() => setTipModalVisible(false)}
        isVisible={tipModalVisible}
      />
      <MediaPlayer />
    </ScreenContainer>
  );
};
