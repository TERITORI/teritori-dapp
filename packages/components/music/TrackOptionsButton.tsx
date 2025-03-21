import React, { FC, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { BrandText } from "../BrandText/BrandText";
import { SVG } from "../SVG";
import ModalBase from "../modals/ModalBase";
import { Separator } from "../separators/Separator";
import { ShareButton } from "../socialFeed/SocialActions/ShareButton";
import { TipButton } from "../socialFeed/SocialActions/TipButton";
import { SpacerColumn } from "../spacer";

import { Post } from "@/api/feed/v1/feed";
import ThreeDotsCircleWhite from "@/assets/icons/music/three-dot-circle-white.svg";
import { useAppMode } from "@/hooks/useAppMode";
import { fontRegular16, fontRegular20 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const BUTTONS_HEIGHT = 28;
const MENU_CONTAINER_MODAL_WIDTH = 500;

export const TrackOptionsButton: FC<{
  trackName: string;
  post: Post;
}> = ({ trackName, post }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [appMode] = useAppMode();

  const onClose = () => {
    setShowMenu(false);
  };

  const TrackOptionModalHeader = () => {
    return (
      <BrandText
        numberOfLines={2}
        style={{ ...fontRegular20, alignSelf: "center" }}
      >
        {trackName}
      </BrandText>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShowMenu(true);
        }}
      >
        <SVG
          source={ThreeDotsCircleWhite}
          width={BUTTONS_HEIGHT}
          height={BUTTONS_HEIGHT}
        />
      </TouchableOpacity>
      <ModalBase
        visible={showMenu}
        onClose={onClose}
        width={MENU_CONTAINER_MODAL_WIDTH}
        boxStyle={{ height: 240 }}
        hideMainSeparator={appMode === "mini"}
        Header={TrackOptionModalHeader}
      >
        {appMode === "mini" && <Separator />}
        <SpacerColumn size={3} />
        <View
          style={{
            flexDirection: "row",
            gap: layout.spacing_x1_5,
            alignItems: "center",
            marginBottom: layout.spacing_x3,
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              gap: layout.spacing_x1_5,
              alignItems: "center",
            }}
          >
            <BrandText style={fontRegular16}>Share</BrandText>
            <ShareButton postId={post.id} useAltStyle />
          </View>
          <View
            style={{
              gap: layout.spacing_x1_5,
              alignItems: "center",
            }}
          >
            <BrandText style={fontRegular16}>Tip</BrandText>
            <TipButton
              postId={post.id}
              authorId={post.authorId}
              amount={post.tipAmount}
              useAltStyle
            />
          </View>
        </View>
      </ModalBase>
    </>
  );
};
