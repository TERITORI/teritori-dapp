import { View, ViewStyle, TextStyle } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { OptimizedImage } from "../../../components/OptimizedImage";
import {
  orangeDefault,
  pinkDefault,
  purpleDefault,
  secondaryColor,
  withAlpha,
  redDefault,
} from "../../../utils/style/colors";
import { fontSemibold9 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { RipperRarity } from "../types";

type RipperAvatarProps = {
  size: number;
  source: string;
  containerStyle?: ViewStyle;
  rarity?: RipperRarity;
  rounded?: boolean;
  isStaked?: boolean;
};

export const RipperAvatar: React.FC<RipperAvatarProps> = ({
  size,
  source,
  rarity,
  rounded = false,
  containerStyle,
  isStaked,
}) => {
  let rarityColor;
  switch (rarity) {
    case "Uncommon":
    case "Rare":
      rarityColor = orangeDefault;
      break;
    case "Epic":
      rarityColor = purpleDefault;
      break;
    case "Legendary":
      rarityColor = pinkDefault;
      break;
    default:
      rarityColor = secondaryColor;
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: rounded ? Math.floor(size / 2) : 0,
          overflow: "hidden",
        },
        containerStyle,
      ]}
    >
      <OptimizedImage
        style={{ width: "100%", height: "100%", opacity: isStaked ? 0.4 : 1 }}
        sourceURI={source}
        width={size}
        height={size}
      />

      {isStaked && (
        <View style={[labelContainerStyle, { top: layout.padding_x1 }]}>
          <BrandText style={[labelStyle, labelRedStyle]}>Staked</BrandText>
        </View>
      )}

      {rarity && (
        <View style={[labelContainerStyle, { bottom: 0 }]}>
          <BrandText style={[labelStyle, { color: rarityColor }]}>
            {rarity}
          </BrandText>
        </View>
      )}
    </View>
  );
};

const labelContainerStyle: ViewStyle = {
  position: "absolute",
  alignItems: "center",
  width: "100%",
};

const labelStyle: TextStyle = {
  ...fontSemibold9,
  paddingVertical: layout.padding_x0_5,
  paddingHorizontal: layout.padding_x0_5,
  borderRadius: 10,
  backgroundColor: withAlpha(orangeDefault, 0.3),
};

const labelRedStyle: TextStyle = {
  color: redDefault,
  backgroundColor: withAlpha(redDefault, 0.3),
};
