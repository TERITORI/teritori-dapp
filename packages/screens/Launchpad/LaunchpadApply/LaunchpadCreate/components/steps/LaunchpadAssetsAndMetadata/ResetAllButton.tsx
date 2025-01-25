import { FC } from "react";
import { TouchableOpacity } from "react-native";

import trashSVG from "@/assets/icons/trash.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SpacerRow } from "@/components/spacer";
import { errorColor } from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const ResetAllButton: FC<{
  onPress: () => void;
}> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 32,
        paddingHorizontal: layout.spacing_x2,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: errorColor,
      }}
      onPress={onPress}
    >
      <SVG source={trashSVG} width={16} height={16} />
      <SpacerRow size={1} />
      <BrandText
        style={[
          fontMedium14,
          { color: errorColor, lineHeight: layout.spacing_x2 },
        ]}
      >
        Remove all files
      </BrandText>
    </TouchableOpacity>
  );
};
