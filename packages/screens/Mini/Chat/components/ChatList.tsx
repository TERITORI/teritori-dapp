import React from "react";
import { View, FlatList } from "react-native";

import { ChatAvatar } from "./ChatAvatar";
import DoubleCheckSVG from "../../../../../assets/icons/double-check.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { Separator } from "../../../../components/separators/Separator";
import { useAppNavigation } from "../../../../utils/navigation";
import { neutralA3, secondaryColor } from "../../../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";

type ChatListProps = {
  items: SingleChatListType[];
};

export const ChatList = ({ items }: ChatListProps) => {
  return (
    <View
      style={{ flex: 1, paddingVertical: layout.spacing_x2, width: "100%" }}
    >
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <React.Fragment key={item.id}>
            <SingleFriendChatList {...item} />
            <Separator style={{ marginVertical: 12 }} />
          </React.Fragment>
        )}
      />
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
