import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useSelector } from "react-redux";

import forwardSVG from "../../../../assets/icons/forward.svg";
import friendsSVG from "../../../../assets/icons/friends.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { TertiaryBadge } from "../../../components/badges/TertiaryBadge";
import { SpacerRow } from "../../../components/spacer";
import {
  selectConversationList,
  selectContactRequestList,
} from "../../../store/slices/message";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral22,
  secondaryColor,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";

export const FriendsBar = () => {
  const contactRequests = useSelector(selectContactRequestList);
  const conversations = useSelector(selectConversationList());
  const { navigate } = useAppNavigation();
  return (
    <View style={styles.friendBox}>
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <SpacerRow size={1.3} />
            <SVG source={friendsSVG} />
            <SpacerRow size={1} />
            <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
              Friends
            </BrandText>
          </FlexRow>
        </View>
        <SpacerRow size={1} />
        <View>
          <FlexRow>
            {!!contactRequests?.length && (
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === "web") {
                    navigate("Message", { view: "AddFriend", tab: "request" });
                  } else {
                    navigate("FriendshipManager", { tab: "request" });
                  }
                }}
              >
                <TertiaryBadge
                  label={`${contactRequests.length} new`}
                  textColor={primaryColor}
                />
              </TouchableOpacity>
            )}
            <SpacerRow size={3} />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => {
                if (Platform.OS === "web") {
                  navigate("Message", { view: "AddFriend", tab: "friends" });
                } else {
                  navigate("FriendshipManager", { tab: "friends" });
                }
              }}
            >
              <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
                {conversations?.filter((conv) => conv.type === "contact")
                  ?.length || ""}
              </BrandText>
              <SpacerRow size={2} />
              <SVG source={forwardSVG} />
              <SpacerRow size={2} />
            </TouchableOpacity>
          </FlexRow>
        </View>
      </FlexRow>
    </View>
  );
};

const styles = StyleSheet.create({
  friendBox: {
    backgroundColor: neutral22,
    height: 40,
    borderRadius: 6,
    flexDirection: "row",
  },
});
