import React, { useState } from "react";
import { Pressable, ViewStyle } from "react-native";

import { MyVideoMenu } from "./MyVideoMenu";
import { TrackHoverMenu } from "./TrackHoverMenu";
import HoveredMenu from "../../../assets/icons/player/hovered-menu.svg";
import HoveredPlay from "../../../assets/icons/player/hovered-play.svg";
import NormalMenu from "../../../assets/icons/player/normal-menu.svg";
import NormalPlay from "../../../assets/icons/player/normal-play.svg";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { useAppNavigation } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { VideoInfoWithMeta } from "../../utils/types/video";
import { SVG } from "../SVG";

export const TrackImageHover: React.FC<{
  videoInfo: VideoInfoWithMeta;
  hasLibrary: boolean;
  userName: string;
}> = ({ videoInfo, hasLibrary, userName }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const navigation = useAppNavigation();
  const [hoverMenuIcon, setHoverMenuIcon] = useState<boolean>(false);
  const [hoverPlayIcon, setHoverPlayIcon] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const userId = getUserId(selectedNetworkId, wallet?.address);

  return (
    <Pressable
      style={hoverBoxStyle}
      onPress={() => {
        navigation.navigate("VideoShow", { id: videoInfo.identifier });
      }}
    >
      {hoverPlayIcon && (
        <Pressable>
          <SVG
            source={HoveredPlay}
            width={28}
            height={28}
            // @ts-ignore
            onMouseLeave={() => setHoverPlayIcon(false)}
          />
        </Pressable>
      )}
      {!hoverPlayIcon && (
        <SVG
          source={NormalPlay}
          width={28}
          height={28}
          // @ts-ignore
          onMouseEnter={() => setHoverPlayIcon(true)}
        />
      )}
      {hoverMenuIcon && (
        <Pressable onPress={() => setOpenMenu((value: boolean) => !value)}>
          <SVG
            source={HoveredMenu}
            width={28}
            height={28}
            // @ts-ignore
            onMouseLeave={() => {
              setHoverMenuIcon(false);
            }}
          />
        </Pressable>
      )}
      {!hoverMenuIcon && (
        <SVG
          source={NormalMenu}
          width={28}
          height={28}
          // @ts-ignore
          onMouseEnter={() => setHoverMenuIcon(true)}
        />
      )}
      {openMenu && userId !== videoInfo.createdBy && (
        <TrackHoverMenu
          videoInfo={videoInfo}
          hasLibrary={hasLibrary}
          userName={userName}
        />
      )}
      {openMenu && userId === videoInfo.createdBy && (
        <MyVideoMenu videoInfo={videoInfo} />
      )}
    </Pressable>
  );
};

const hoverBoxStyle: ViewStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  left: 0,
  top: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  padding: layout.spacing_x1_5,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-end",
  borderRadius: 10,
};
