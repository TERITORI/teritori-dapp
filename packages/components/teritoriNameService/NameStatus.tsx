import React from "react";

import availableSVG from "../../../assets/icons/available.svg";
import mintedSVG from "../../../assets/icons/minted.svg";
import { errorColor, successColor } from "../../utils/style/colors";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const NameStatus: React.FC<{
  available?: boolean;
  hasError?: boolean;
}> = ({ available, hasError }) => {
  return (
    <TertiaryBox
      nonPressable
      mainContainerStyle={{
        flexDirection: "row",
        justifyContent: "flex-start",
      }}
      height={48}
      width={332}
      paddingHorizontal={12}
      borderColor={
        hasError ? errorColor : available ? successColor : errorColor
      }
    >
      <SVG
        width={24}
        height={24}
        source={available ? availableSVG : mintedSVG}
      />
      <BrandText style={{ fontSize: 14, marginLeft: 4 }}>
        {hasError ? "error" : available ? "available" : "minted"}
      </BrandText>
    </TertiaryBox>

    // <View
    //   style={{
    //     flex: 1,
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "flex-start",
    //     borderColor: hasError
    //       ? errorColor
    //       : available
    //       ? successColor
    //       : errorColor,
    //     borderWidth: 1,
    //     borderRadius: 8,
    //     backgroundColor: "#000000",
    //     height: 48,
    //     minHeight: 48,
    //     maxHeight: 48,
    //     width: 332,
    //     paddingHorizontal: 12,
    //   }}
    // >
    //   <SVG
    //     width={24}
    //     height={24}
    //     source={available ? availableSVG : mintedSVG}
    //   />
    //   <BrandText style={{ fontSize: 14, marginLeft: 4 }}>
    //     {hasError ? "error" : available ? "available" : "minted"}
    //   </BrandText>
    // </View>
  );
};
