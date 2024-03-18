import { View } from "react-native";
import { useSelector } from "react-redux";

import chevronSVG from "@/assets/icons/chevron-right.svg";
import friendSVG from "@/assets/icons/friends-white.svg";
import { BrandText } from "@/components/BrandText";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { TertiaryBadge } from "@/components/badges/TertiaryBadge";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { SpacerRow } from "@/components/spacer";
import {
  selectContactRequestList,
  selectConversationList,
} from "@/store/slices/message";
import { useAppNavigation } from "@/utils/navigation";
import { azureBlue, neutral22, withAlpha } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export default function FriendInfoBar() {
  const navigation = useAppNavigation();
  const contactRequestList = useSelector(selectContactRequestList);
  const conversations = useSelector(selectConversationList);

  const totalContactRequests = contactRequestList.length;
  const totalFriends =
    conversations?.filter((conv) => conv.type === "contact")?.length || "";

  return (
    <CustomPressable
      onPress={() =>
        navigation.navigate("MiniFriend", { activeTab: "friends" })
      }
    >
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

        <CustomPressable
          onPress={() =>
            navigation.navigate("MiniFriend", { activeTab: "requests" })
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {totalContactRequests > 0 && (
            <TertiaryBadge
              label={`${totalContactRequests} new`}
              style={{ backgroundColor: withAlpha(azureBlue, 0.15) }}
              textColor={azureBlue}
            />
          )}
          <SpacerRow size={1} />

          <BrandText style={[fontSemibold14]}>{totalFriends}</BrandText>

          <SpacerRow size={0.75} />
          <SVGorImageIcon icon={chevronSVG} iconSize={16} />
        </CustomPressable>
      </View>
    </CustomPressable>
  );
}
