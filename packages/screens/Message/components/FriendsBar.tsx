import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
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
import {
  neutral22,
  secondaryColor,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";

import { router } from "@/utils/router";

export const FriendsBar = () => {
  const contactRequests = useSelector(selectContactRequestList);
  const conversations = useSelector(selectConversationList);

  return (
    <View
      style={{
        backgroundColor: neutral22,
        height: 40,
        borderRadius: 6,
        flexDirection: "row",
      }}
    >
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
                  if (Platform.OS !== "web") {
                    router.navigate({
                      pathname: "/message/friends",
                      params: { tab: "request" },
                    });
                  } else {
                    router.navigate({
                      pathname: "/message/[view]",
                      params: {
                        view: "AddFriend",
                        tab: "request",
                      },
                    });
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
                if (Platform.OS !== "web") {
                  router.navigate({
                    pathname: "/message/friends",
                    params: { tab: "friends" },
                  });
                } else {
                  router.navigate({
                    pathname: "/message/[view]",
                    params: {
                      view: "AddFriend",
                      tab: "friends",
                    },
                  });
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
