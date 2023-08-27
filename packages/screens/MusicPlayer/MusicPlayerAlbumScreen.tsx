import React, { useState, useEffect, FC } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";

import Add from "../../../assets/music-player/add.svg";
import MorePrimary from "../../../assets/music-player/more-primary.svg";
import PlayOther from "../../../assets/music-player/play-other.svg";
import PlaySecondary from "../../../assets/music-player/play-secondary.svg";
import Time from "../../../assets/music-player/time.svg";
import Tip from "../../../assets/music-player/tip-primary.svg";
import { signingMusicPlayerClient } from "../../client-creators/musicplayerClient";
import { BrandText } from "../../components/BrandText";
import { OmniLink } from "../../components/OmniLink";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CustomPressable } from "../../components/buttons/CustomPressable";
import { DetailAlbumMenu } from "../../components/mediaPlayer/DetailAlbumMenu";
import { MusicPlayerTab } from "../../components/mediaPlayer/MusicPlayerTab";
import { TipModal } from "../../components/socialFeed/SocialActions/TipModal";
import { SpacerRow } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useMediaPlayer } from "../../context/MediaPlayerProvider";
import { useFetchAlbum } from "../../hooks/musicplayer/useFetchAlbum";
import { useFetchLibraryIds } from "../../hooks/musicplayer/useFetchLibraryIds";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId, parseUserId } from "../../networks";
import { getAudioDuration } from "../../utils/audio";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral77, neutral17, primaryColor } from "../../utils/style/colors";
import {
  fontSemibold14,
  fontMedium14,
  fontSemibold13,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";
import { AlbumInfo, Media } from "../../utils/types/mediaPlayer";

export const MusicPlayerAlbumScreen: ScreenFC<"MusicPlayerAlbum"> = ({
  route: {
    params: { id },
  },
}) => {
  const { loadAndPlayQueue } = useMediaPlayer();
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const { data: fetchedAlbumInfo } = useFetchAlbum({ identifier: id });
  const { data: idForLibraryList } = useFetchLibraryIds();
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
    : tinyAddress(userAddress);

  useEffect(() => {
    if (fetchedAlbumInfo) {
      setAlbumInfo(fetchedAlbumInfo);
    }
  }, [fetchedAlbumInfo]);

  const [openDetailAlbumMenu, setOpenDetailAlbumMenu] =
    useState<boolean>(false);
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
  const onPressPlayAlbum = async () => {
    if (!albumInfo.audios.length) return;
    await loadAndPlayQueue(albumInfo.audios);
  };

  const onPressTrack = async (media: Media) => {
    if (!albumInfo.audios.length) return;
    await loadAndPlayQueue(albumInfo.audios, media);
  };

  return (
    <ScreenContainer
      headerChildren={<BrandText>{albumInfo.name}</BrandText>}
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
              source={{ uri: ipfsURLToHTTPURL(albumInfo.image) }}
              style={styles.albumImg}
            />
            <View style={styles.verticalBox}>
              <BrandText>{albumInfo.name}</BrandText>
              <OmniLink
                to={{
                  screen: "UserPublicProfile",
                  params: { id: albumInfo?.createdBy || "" },
                }}
              >
                <BrandText style={styles.artistText}>
                  {"@" + username}
                </BrandText>
              </OmniLink>
              <BrandText style={styles.infoText}>
                {albumInfo.description}
              </BrandText>
              <View style={styles.oneLine}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={onPressPlayAlbum}
                >
                  <SVG
                    source={PlayOther}
                    width={layout.padding_x2_5}
                    height={layout.padding_x2_5}
                  />
                  <BrandText style={styles.playButtonText}>Play</BrandText>
                </TouchableOpacity>

                <TouchableOpacity
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
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.actionBox}>
            {userId &&
              userId !== albumInfo.createdBy &&
              idForLibraryList &&
              idForLibraryList.findIndex((item) => item === id) !== -1 && (
                <TouchableOpacity
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
                </TouchableOpacity>
              )}
            {userId &&
              userId !== albumInfo.createdBy &&
              idForLibraryList &&
              idForLibraryList.findIndex((item) => item === id) === -1 && (
                <TouchableOpacity style={styles.addButton}>
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
                </TouchableOpacity>
              )}
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => {
                setOpenDetailAlbumMenu((value) => !value);
              }}
            >
              <SVG
                height={layout.padding_x2_5}
                width={layout.padding_x2_5}
                source={MorePrimary}
              />
            </TouchableOpacity>
            {openDetailAlbumMenu && <DetailAlbumMenu id={albumInfo.id || ""} />}
          </View>
        </View>

        <View style={styles.menuBox}>
          <View style={styles.leftBox}>
            <BrandText style={[styles.menuText, styles.index]}>#</BrandText>
            <SpacerRow size={2.5} />
            <BrandText style={styles.menuText}>Track</BrandText>
          </View>
          <SVG
            source={Time}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
        </View>

        <View style={styles.contentGroup}>
          {albumInfo.audios.map((media: Media, index: number) => (
            <Track
              key={index}
              trackNumber={index + 1}
              mediaToPlay={media}
              onPressTrack={onPressTrack}
            />
          ))}
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

const Track: FC<{
  onPressTrack: (media: Media) => void;
  mediaToPlay: Media;
  trackNumber: number;
}> = ({ onPressTrack, mediaToPlay, trackNumber }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { media: currentMedia } = useMediaPlayer();

  return (
    <CustomPressable
      onPress={() => onPressTrack(mediaToPlay)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[styles.track, isHovered && { opacity: 0.5 }]}
    >
      <View style={styles.leftBox}>
        <BrandText style={[styles.menuText, styles.index]}>
          {trackNumber}
        </BrandText>

        {isHovered ||
        (mediaToPlay.fileUrl === currentMedia?.fileUrl &&
          currentMedia.albumId === mediaToPlay.albumId) ? (
          <SVG source={PlaySecondary} width={20} height={20} />
        ) : (
          <SpacerRow size={2.5} />
        )}

        <BrandText style={fontSemibold14}>{mediaToPlay.name}</BrandText>
      </View>
      <View style={styles.rightBox}>
        <BrandText style={[fontSemibold14]}>
          {getAudioDuration(mediaToPlay.duration || 0)}
        </BrandText>
      </View>
    </CustomPressable>
  );
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
  track: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.padding_x3,
    paddingVertical: layout.padding_x0_5,
    borderRadius: layout.padding_x1,
    backgroundColor: neutral17,
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
