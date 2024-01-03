import React from "react";
import { View } from "react-native";
import { Badge } from "react-native-paper";

import { BrandText } from "../../../components/BrandText";
import { neutral22 } from "../../../utils/style/colors";
import { fontBold10 } from "../../../utils/style/fonts";
import { Avatar } from "../../Message/components/Avatar";

type ChatAvatarProps = {
  isActive?: boolean;
  membersAvatar: string[];
  size?: "sm" | "md";
};

export const ChatAvatar = ({
  isActive = false,
  membersAvatar,
  size = "md",
}: ChatAvatarProps) => {
  const numberOfMembers = membersAvatar.length;
  const isMembersMoreThanFour = numberOfMembers > 4;
  const extraMembers = numberOfMembers - 3 || 0;
  const avatarSize = size === "md" ? 48 : 32;
  return (
    <View
      style={{ position: "relative", width: avatarSize, height: avatarSize }}
    >
      {membersAvatar.length === 1 ? (
        <Avatar
          source={membersAvatar[0]}
          size={avatarSize}
          style={{ overflow: "hidden", borderRadius: avatarSize }}
        />
      ) : (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            height: avatarSize,
            width: avatarSize,
          }}
        >
          {membersAvatar.map((avatar, index) => {
            if (index > 3) {
              return null;
            }
            if (isMembersMoreThanFour && index > 2) {
              return (
                <View
                  key={index}
                  style={{
                    height: avatarSize / 2,
                    width: avatarSize / 2,
                    backgroundColor: neutral22,
                    borderRadius: avatarSize,
                    justifyContent: "center",
                  }}
                >
                  <BrandText style={[fontBold10, { textAlign: "center" }]}>
                    +{extraMembers}
                  </BrandText>
                </View>
              );
            }
            return (
              <Avatar
                key={index}
                source={avatar}
                size={avatarSize / 2}
                style={{ overflow: "hidden", borderRadius: avatarSize }}
              />
            );
          })}
        </View>
      )}
      {membersAvatar.length === 1 && (
        <Badge
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: isActive ? "green" : "yellow",
            borderWidth: 1,
            borderColor: "#000",
          }}
          size={12}
        />
      )}
    </View>
  );
};
