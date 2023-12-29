import React from "react";
import { View } from "react-native";
import { Badge } from "react-native-paper";

import DoubleCheckSVG from "../../../../assets/icons/double-check.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral22,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontBold10,
  fontMedium13,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Avatar } from "../../Message/components/Avatar";

type ChatListProps = {
  items: SingleChatListType[];
};

export const ChatList = ({ items }: ChatListProps) => {
  return (
    <View
      style={{ flex: 1, paddingVertical: layout.spacing_x2, width: "100%" }}
    >
      {Array.isArray(items) &&
        items.map((item) => (
          <React.Fragment key={item.id}>
            <SingleFriendChatList {...item} />
            <Separator style={{ marginVertical: 12 }} />
          </React.Fragment>
        ))}
    </View>
  );
};
type SingleChatListType = {
  name: string;
  lastActiveDateTime: string;
  lastMessage: string;
  id: string;
  conversationId: string;
  type?: "single" | "group";
  membersAvatar: string[];
};
const SingleFriendChatList = ({
  lastActiveDateTime,
  lastMessage,
  name,
  type = "single",
  membersAvatar,
  id,
  conversationId,
}: SingleChatListType) => {
  const navigation = useAppNavigation();

  const handleListPress = () => {
    navigation.navigate("Conversation", { conversationId });
  };
  return (
    <CustomPressable
      onPress={handleListPress}
      style={{
        marginHorizontal: layout.spacing_x2,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <ChatAvatar isActive membersAvatar={membersAvatar} />
      <View
        style={{
          width: "100%",
          flex: 1,
          marginLeft: layout.spacing_x2,
          marginRight: layout.spacing_x1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
            {name}
          </BrandText>
          <BrandText style={[fontMedium13, { color: neutralA3 }]}>
            {lastActiveDateTime}
          </BrandText>
        </View>
        <BrandText
          style={[fontMedium13, { color: neutralA3, maxWidth: "100%" }]}
          numberOfLines={1}
        >
          {lastMessage}
        </BrandText>
      </View>
      <SVG source={DoubleCheckSVG} height={16} width={16} />
    </CustomPressable>
  );
};

type ChatAvatarProps = {
  isActive?: boolean;
  membersAvatar: string[];
};

const ChatAvatar = ({ isActive = false, membersAvatar }: ChatAvatarProps) => {
  const numberOfMembers = membersAvatar.length;
  const isMembersMoreThanFour = numberOfMembers > 4;
  const extraMembers = numberOfMembers - 3 || 0;

  return (
    <View style={{ position: "relative", width: 48, height: 48 }}>
      {membersAvatar.length === 1 ? (
        <Avatar
          source={membersAvatar[0]}
          size={48}
          style={{ overflow: "hidden", borderRadius: 48 }}
        />
      ) : (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            height: 48,
            width: 48,
          }}
        >
          {membersAvatar.map((avatar, index) => {
            if (index > 3) {
              return null;
            }
            if (isMembersMoreThanFour && index > 2) {
              return (
                <View
                  style={{
                    height: 24,
                    width: 24,
                    backgroundColor: neutral22,
                    borderRadius: 48,
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
                size={48 / 2}
                style={{ overflow: "hidden", borderRadius: 48 }}
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
