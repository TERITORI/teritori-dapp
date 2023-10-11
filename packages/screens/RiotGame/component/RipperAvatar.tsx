import { View, ViewStyle, StyleSheet } from "react-native";

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
        <View style={[styles.labelContainer, { top: layout.spacing_x1 }]}>
          <BrandText style={[styles.label, styles.labelRed]}>Staked</BrandText>
        </View>
      )}

      {rarity && (
        <View style={[styles.labelContainer, { bottom: 0 }]}>
          <BrandText style={[styles.label, { color: rarityColor }]}>
            {rarity}
          </BrandText>
        </View>
      )}
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  labelContainer: {
    position: "absolute",
    alignItems: "center",
    width: "100%",
  },

  label: {
    paddingVertical: layout.spacing_x0_5,
    paddingHorizontal: layout.spacing_x0_5,
    borderRadius: 10,
    backgroundColor: withAlpha(orangeDefault, 0.3),
    ...(fontSemibold9 as object),
  },

  labelRed: {
    color: redDefault,
    backgroundColor: withAlpha(redDefault, 0.3),
  },
});
