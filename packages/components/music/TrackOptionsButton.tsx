import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import ThreeDotsCircleWhite from "../../../assets/icons/music/three-dot-circle-white.svg";
import { BrandText } from "../BrandText/BrandText.electron";
import { SVG } from "../SVG";
import ModalBase from "../modals/ModalBase";
import { Separator } from "../separators/Separator";
import { ShareButton } from "../socialFeed/SocialActions/ShareButton";
import { TipButton } from "../socialFeed/SocialActions/TipButton";
import { SpacerColumn } from "../spacer";

import { Post } from "@/api/feed/v1/feed";
import { useAppMode } from "@/hooks/useAppMode";
import { layout } from "@/utils/style/layout";

const BUTTONS_HEIGHT = 28;
const MENU_CONTAINER_MODAL_WIDTH = 500;
type Props = {
  trackName: string;
  post: Post;
  username: string;
};

export const TrackOptionsButton = ({ trackName, post, username }: Props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [appMode] = useAppMode();

  const onClose = () => setShowMenu(false);

  const TrackOptionModalHeader = () => {
    return <BrandText numberOfLines={2}>{trackName}</BrandText>;
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowMenu(true)}>
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
        boxStyle={{ height: 250 }}
        hideMainSeparator={appMode === "mini"}
        Header={TrackOptionModalHeader}
      >
        {appMode === "mini" && <Separator />}
        <SpacerColumn size={2} />
        <View
          style={{
            flexDirection: "row",
            gap: layout.spacing_x1_5,
            alignItems: "center",
            marginBottom: layout.spacing_x3,
          }}
        >
          <BrandText style={{ width: 60 }}>Share</BrandText>
          <ShareButton
            postId={post.identifier}
            useAltStyle
            onSharePress={onClose}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: layout.spacing_x1_5,
            alignItems: "center",
          }}
        >
          <BrandText style={{ width: 60 }}>Tip</BrandText>
          <TipButton
            postId={post.identifier}
            author={username}
            amount={post.tipAmount}
            useAltStyle
            onTipPress={onClose}
          />
        </View>
      </ModalBase>
    </>
  );
};
