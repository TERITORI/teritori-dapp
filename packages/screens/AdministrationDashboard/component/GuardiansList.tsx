import React, { FC, useState } from "react";
import { Image, TouchableOpacity, ViewStyle } from "react-native";
import Popover from "react-native-popover-view";

import { TooltipContant } from "./TooltipContant";
import avaPNG from "../../../../assets/default-images/ava.png";
import checkBadgeSVG from "../../../../assets/icons/certified.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { neutral44, neutral11 } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const GuardiansList: FC<{ index: number }> = ({ index }) => {
  const [viewPopover, setViewPopover] = useState<number>(-1);

  const setViewPopoverHandler = (index: number) => {
    setViewPopover((old) => (old === index ? -1 : index));
  };

  return (
    <>
      <Popover
        isVisible={viewPopover === index + 1}
        from={
          <TouchableOpacity
            onPress={() => setViewPopoverHandler(index + 1)}
            style={listToggle}
          >
            <Image
              style={{
                width: 28,
                height: 28,
              }}
              source={avaPNG}
            />
            <BrandText
              style={[fontSemibold16, { marginLeft: 15, marginRight: 10 }]}
            >
              Meebits
            </BrandText>
            <SVG source={checkBadgeSVG} width={18} height={18} />
          </TouchableOpacity>
        }
        onRequestClose={() => setViewPopover(-1)}
        popoverStyle={popoverStyle}
        backgroundStyle={{ opacity: 0 }}
      >
        <TooltipContant />
      </Popover>
    </>
  );
};

const listToggle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 5,
};

const popoverStyle = {
  backgroundColor: neutral11,
  width: 425,
  padding: layout.spacing_x2,
  borderWidth: 2,
  borderColor: neutral44,
  borderRadius: 12,
};
