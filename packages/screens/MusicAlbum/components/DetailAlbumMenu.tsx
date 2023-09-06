import React from "react";
import { View, ViewStyle, TextStyle } from "react-native";

import { HoverView } from "./HoverView";
import Link from "../../../../assets/music-player/link.svg";
import { BrandText } from "../../../components/BrandText";
import { useCopyToClipboard } from "../../../components/CopyToClipboard";
import { SVG } from "../../../components/SVG";
import { SpacerRow } from "../../../components/spacer";
import { neutralA3, neutral33, neutral22 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface DetailAlbumMenuProps {
  id: string;
}

const buttonHeight = 36;
export const DetailAlbumMenu: React.FC<DetailAlbumMenuProps> = ({ id }) => {
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <View style={menuContainerStyle}>
      <HoverView
        normalStyle={unitBoxNormalStyle}
        hoverStyle={unitBoxHoveredStyle}
        onPress={() =>
          copyToClipboard(`${window.location.origin}/music-player/album/${id}`)
        }
      >
        <View style={oneLineStyle}>
          <SVG
            source={Link}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <SpacerRow size={1} />
          <BrandText style={textStyle}>Copy album's URL</BrandText>
        </View>
      </HoverView>

      {/*<SpacerColumn size={.75}/>*/}
      {/* {!mine && (
        <HoverView
          normalStyle={unitBoxNormal}
          hoverStyle={unitBoxHovered}
        >
          <View style={oneLineStyle}>
            <SVG
              source={Flag}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <BrandText style={textStyle}>Flag this Album</BrandText>
          </View>
        </HoverView>
      )} */}

      {/* {!mine && <View style={divideLineStyle} />} */}

      {/* <HoverView
        normalStyle={unitBoxNormal}
        onPress={() => setOpenShareMenu((value) => !value)}
        hoverStyle={unitBoxHovered}
      >
        <View style={[oneLineStyle, { paddingRight: mine ? 40 : 0 }]}>
          <SVG
            source={Share}
            width={layout.spacing_x2}
            height={layout.spacing_x2}
          />
          <BrandText style={textStyle}>Share</BrandText>
        </View>
        <SVG
          source={Enter}
          width={layout.spacing_x2}
          height={layout.spacing_x2}
        />

        {openShareMenu && (
          <View style={shareMenuContainerStyle}>
            <HoverView
              normalStyle={unitBoxNormal}
              hoverStyle={unitBoxHovered}
            >
              <View style={oneLineStyle}>
                <SVG
                  source={Link}
                  width={layout.spacing_x2}
                  height={layout.spacing_x2}
                />
                <BrandText style={textStyle}>
                  Copy track's URL
                </BrandText>
              </View>
            </HoverView>
            <SpacerColumn size={.75}/>
            <HoverView
              normalStyle={unitBoxNormal}
              hoverStyle={unitBoxHovered}
            >
              <View style={oneLineStyle}>
                <SVG
                  source={Code}
                  width={layout.spacing_x2}
                  height={layout.spacing_x2}
                />
                <BrandText style={textStyle}>Copy widget code</BrandText>
              </View>
            </HoverView>
          </View>
        )}
      </HoverView> */}
    </View>
  );
};

const menuContainerStyle: ViewStyle = {
  borderRadius: layout.spacing_x1_5,
  position: "absolute",
  width: 170,
  right: 0,
  bottom: buttonHeight + layout.spacing_x0_5,
  backgroundColor: neutral22,
  padding: layout.spacing_x1_5,
  zIndex: 999,
};
const unitBoxNormalStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: layout.spacing_x0_75,
  borderRadius: layout.spacing_x0_75,
};
const unitBoxHoveredStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: layout.spacing_x0_75,
  backgroundColor: neutral33,
  borderRadius: layout.spacing_x0_75,
};
const oneLineStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const textStyle: TextStyle = {
  ...fontSemibold13,

  color: neutralA3,
};
// const divideLineStyle: ViewStyle = {
//     height: 1,
//     opacity: 0.12,
//     backgroundColor: secondaryColor,
//   }
// const shareMenuContainerStyle: ViewStyle = {
//     borderRadius: layout.spacing_x1_5,
//     position: "absolute",
//     left: -(layout.spacing_x1_5 + shareMenuWidth),
//     bottom: -(
//       layout.spacing_x1_5 +
//       lineHeight +
//       layout.spacing_x1_5 +
//       layout.spacing_x0_75
//     ),
//     backgroundColor: neutral22,
//     padding: layout.spacing_x1_5,
//     width: shareMenuWidth,
//   }
