import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";

import { MyAlbumMenu } from "./MyAlbumMenu";
import { TrackHoverMenu } from "./TrackHoverMenu";
import HoveredMenu from "../../../assets/music-player/hovered-menu.svg";
import HoveredPlay from "../../../assets/music-player/hovered-play.svg";
import NormalMenu from "../../../assets/music-player/normal-menu.svg";
import NormalPlay from "../../../assets/music-player/normal-play.svg";
import { useAppNavigation } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { SVG } from "../SVG";

export const TrackImageHover: React.FC<{ mine?: boolean; albumId: string }> = ({
  mine = false,
  albumId,
}) => {
  const navigation = useAppNavigation();
  const [hoverMenuIcon, setHoverMenuIcon] = useState<boolean>(false);
  const [hoverPlayIcon, setHoverPlayIcon] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

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
    },
  });

  return (
    <Pressable
      style={styles.hoverBox}
      onPress={() => {
        if (mine) navigation.navigate("MyAlbum");
        else navigation.navigate("AlbumName", { id: albumId });
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
      {openMenu && !mine && <TrackHoverMenu albumId={albumId}/>}
      {openMenu && mine && <MyAlbumMenu />}
    </Pressable>
  );
};
