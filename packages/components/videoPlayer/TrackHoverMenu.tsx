import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { HoverView } from "./HoverView";
import { signingVideoPlayerClient } from "../../client-creators/videoplayerClient";
import AddLibrary from "../../../assets/icons/player/add-library.svg";
import Tip from "../../../assets/icons/player/tip-other.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { neutralA3, neutral33, secondaryColor } from "../../utils/style/colors";
import { fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TipModal } from "../socialFeed/SocialActions/TipModal";

interface TrackHoverMenuProps {
  videoInfo: VideoInfoWithMeta;
  hasLibrary: boolean;
  userName: string;
}
export const TrackHoverMenu: React.FC<TrackHoverMenuProps> = ({
  videoInfo,
  hasLibrary,
  userName,
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();

  const shareMenuWidth = 188;
  const lineHeight = 18;

  // const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const [tipModalVisible, setTipModalVisible] = useState<boolean>(false);
  const { setToastError, setToastSuccess } = useFeedbacks();

  const addToLibrary = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.addToLibrary({
        identifier: videoInfo.identifier,
      });
      if (res.transactionHash) {
        setToastSuccess({
          title: "Add video to my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to add video to my library",
        message: `Error: ${err}`,
      });
    }
  };

  const removeFromLibrary = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingVideoPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    try {
      const res = await client.removeFromLibrary({
        identifier: videoInfo.identifier,
      });
      if (res.transactionHash) {
        setToastSuccess({
          title: "remove video from my library",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to remove video from my library",
        message: `Error: ${err}`,
      });
    }
  };

  const copyLinkTrack = () => {
    window.navigator.clipboard.writeText(
      `${window.location.origin}/video-player/show/${videoInfo.identifier}`
    );
  };
  const handleTip = () => {
    setTipModalVisible(true);
  };

  const styles = StyleSheet.create({
    hoverBox: {
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: layout.padding_x1_5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      zIndex: 999,
    },
    menuContainer: {
      borderRadius: layout.padding_x1_5,
      position: "absolute",
      right: layout.padding_x1_5,
      bottom: 44,
      backgroundColor: "rgba(41, 41, 41, 1)",
      padding: layout.padding_x1_5,
      flexDirection: "column",
      gap: layout.padding_x0_75,
    },
    unitBoxNormal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.padding_x0_75,
      borderRadius: layout.padding_x0_75,
    },
    unitBoxHovered: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: layout.padding_x0_75,
      backgroundColor: neutral33,
      borderRadius: layout.padding_x0_75,
    },
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x1,
    },
    text: StyleSheet.flatten([
      fontSemibold13,
      {
        color: neutralA3,
      },
    ]),
    divideLine: {
      height: 1,
      opacity: 0.12,
      backgroundColor: secondaryColor,
    },
    shareMenuContainer: {
      borderRadius: layout.padding_x1_5,
      position: "absolute",
      left: -(layout.padding_x1_5 + shareMenuWidth),
      bottom: -(
        layout.padding_x1_5 +
        lineHeight +
        layout.padding_x1_5 +
        2 * layout.padding_x0_75
      ),
      backgroundColor: "rgba(41, 41, 41, 1)",
      padding: layout.padding_x1_5,
      flexDirection: "column",
      gap: layout.padding_x0_75,
      width: shareMenuWidth,
    },
  });

  return (
    <View style={styles.menuContainer}>
      {wallet && wallet.address !== videoInfo.createdBy && !hasLibrary && (
        <HoverView
          normalStyle={styles.unitBoxNormal}
          hoverStyle={styles.unitBoxHovered}
          onPress={() => {
            addToLibrary();
          }}
        >
          <View style={styles.oneLine}>
            <SVG
              source={AddLibrary}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.text}>Add to library</BrandText>
          </View>
        </HoverView>
      )}
      {wallet && wallet.address !== videoInfo.createdBy && hasLibrary && (
        <HoverView
          normalStyle={styles.unitBoxNormal}
          hoverStyle={styles.unitBoxHovered}
          onPress={() => {
            removeFromLibrary();
          }}
        >
          <View style={styles.oneLine}>
            <SVG
              source={AddLibrary}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.text}>Remove From library</BrandText>
          </View>
        </HoverView>
      )}

      <View style={styles.divideLine} />

      {/* <HoverView
        normalStyle={styles.unitBoxNormal}
        hoverStyle={styles.unitBoxHovered}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Flag}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText style={styles.text}>Flag this track</BrandText>
        </View>
      </HoverView>

      <View style={styles.divideLine} /> */}

      <HoverView
        normalStyle={styles.unitBoxNormal}
        hoverStyle={styles.unitBoxHovered}
        onPress={() => {
          handleTip();
        }}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Tip}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText style={styles.text}>Tip this track</BrandText>
        </View>
      </HoverView>
      <View style={styles.divideLine} />
      <HoverView
        normalStyle={styles.unitBoxNormal}
        hoverStyle={styles.unitBoxHovered}
        onPress={() => {
          copyLinkTrack();
        }}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Tip}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText style={styles.text}>Copy link to the track</BrandText>
        </View>
      </HoverView>

      {/* <HoverView
        normalStyle={styles.unitBoxNormal}
        onPress={() => setOpenShareMenu((value) => !value)}
        hoverStyle={styles.unitBoxHovered}
      >
        <View style={styles.oneLine}>
          <SVG
            source={Share}
            width={layout.padding_x2}
            height={layout.padding_x2}
          />
          <BrandText style={styles.text}>Share</BrandText>
        </View>
        <SVG
          source={Enter}
          width={layout.padding_x2}
          height={layout.padding_x2}
        />

        {openShareMenu && (
          <View style={styles.shareMenuContainer}>
            <HoverView
              normalStyle={styles.unitBoxNormal}
              hoverStyle={styles.unitBoxHovered}
            >
              <View style={styles.oneLine}>
                <SVG
                  source={Link}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
                <BrandText style={styles.text}>
                  Copy link to the track
                </BrandText>
              </View>
            </HoverView>
            <HoverView
              normalStyle={styles.unitBoxNormal}
              hoverStyle={styles.unitBoxHovered}
            >
              <View style={styles.oneLine}>
                <SVG
                  source={Code}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
                <BrandText style={styles.text}>Copy widget code</BrandText>
              </View>
            </HoverView>
          </View>
        )}
      </HoverView> */}
      <TipModal
        author={userName}
        postId={videoInfo.identifier}
        onClose={() => setTipModalVisible(false)}
        isVisible={tipModalVisible}
      />
    </View>
  );
};
