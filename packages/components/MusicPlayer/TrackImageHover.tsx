import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";

import HoveredMenu from "../../../assets/music-player/hovered-menu.svg";
import HoveredPlay from "../../../assets/music-player/hovered-play.svg";
import NormalMenu from "../../../assets/music-player/normal-menu.svg";
import NormalPlay from "../../../assets/music-player/normal-play.svg";
import { SVG } from "../SVG";
import { useAppNavigation } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { TrackHoverMenu } from "./TrackHoverMenu";
import { MyAlbumMenu } from "./MyAlbumMenu";


export const TrackImageHover: React.FC<{ mine: boolean }> = ({ mine = false }) => {

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
    }
  });

  return (
    <Pressable
      style={styles.hoverBox}
      onPress={() => {
        if (mine) navigation.navigate("MyAlbum");
        else navigation.navigate("AlbumName");
      }}
    >
      {hoverPlayIcon && (
        <Pressable>
          <SVG
            source={HoveredPlay}
            width={28}
            height={28}
            onMouseLeave={() => setHoverPlayIcon(false)}
          />
        </Pressable>
      )}
      {!hoverPlayIcon && (
        <SVG
          source={NormalPlay}
          width={28}
          height={28}
          onMouseEnter={() => setHoverPlayIcon(true)}
        />
      )}
      {hoverMenuIcon && (
        <Pressable onPress={() => setOpenMenu((value: boolean) => !value)}>
          <SVG
            source={HoveredMenu}
            width={28}
            height={28}
            onMouseLeave={() => { setHoverMenuIcon(false); }}
          />
        </Pressable>
      )}
      {!hoverMenuIcon && (
        <SVG
          source={NormalMenu}
          width={28}
          height={28}
          onMouseEnter={() => setHoverMenuIcon(true)}
        />
      )}
      {openMenu && !mine && (
        <TrackHoverMenu />
      )}
      {openMenu && mine && (
        <MyAlbumMenu />
      )}
    </Pressable>
  );
};
