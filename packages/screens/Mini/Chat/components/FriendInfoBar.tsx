import { View } from "react-native";

import chevronSVG from "@/assets/icons/chevron-right.svg";
import friendSVG from "@/assets/icons/friend-gray.svg";
import { BrandText } from "@/components/BrandText";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { TertiaryBadge } from "@/components/badges/TertiaryBadge";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerRow } from "@/components/spacer";
import { useAppNavigation } from "@/utils/navigation";
import { azureBlue, neutral22, withAlpha } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export default function FriendInfoBar() {
  const navigation = useAppNavigation();

  return (
    <CustomPressable onPress={() => navigation.navigate("MiniFriend")}>
      <View
        style={{
          backgroundColor: withAlpha(neutral22, 0.9),
          paddingHorizontal: 10,
          paddingVertical: 9.5,
          borderRadius: layout.borderRadius,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <SVGorImageIcon icon={friendSVG} iconSize={20} />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold14]}>Friends</BrandText>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TertiaryBadge
            label="2 new"
            style={{ backgroundColor: withAlpha(azureBlue, 0.15) }}
            textColor={azureBlue}
          />
          <SpacerRow size={1} />

          <BrandText style={[fontSemibold14]}>1</BrandText>

          <SpacerRow size={0.75} />
          <SVGorImageIcon icon={chevronSVG} iconSize={16} />
        </View>
      </View>
    </CustomPressable>
  );
}
