import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";

import { MyAlbumMenu } from "./MyAlbumMenu";
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
import { AlbumInfo } from "../../utils/types/music";
import { SVG } from "../SVG";

export const TrackImageHover: React.FC<{
  album: AlbumInfo;
  hasLibrary: boolean;
  userName: string;
}> = ({ album, hasLibrary, userName }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const navigation = useAppNavigation();
  const [hoverMenuIcon, setHoverMenuIcon] = useState<boolean>(false);
  const [hoverPlayIcon, setHoverPlayIcon] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const userId = getUserId(selectedNetworkId, wallet?.address);

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
      borderRadius: 10,
    },
  });

  return (
    <Pressable
      style={styles.hoverBox}
      onPress={() => {
        navigation.navigate("VideoName", { id: album.id });
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
      {openMenu && userId !== album.createdBy && (
        <TrackHoverMenu
          album={album}
          hasLibrary={hasLibrary}
          userName={userName}
        />
      )}
      {openMenu && userId === album.createdBy && <MyAlbumMenu album={album} />}
    </Pressable>
  );
};
