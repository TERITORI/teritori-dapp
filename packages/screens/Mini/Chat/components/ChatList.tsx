import moment from "moment";
import React, { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";

import DoubleCheckWhiteSVG from "../../../../../assets/icons/double-check-white.svg";
import DoubleCheckSVG from "../../../../../assets/icons/double-check.svg";
import searchSVG from "../../../../../assets/icons/search-gray.svg";
import { ChatAvatar } from "../../components/ChatAvatar";
import MiniTextInput from "../../components/MiniTextInput";

import { BrandText } from "@/components/BrandText";
import { KeyboardAvoidingView } from "@/components/KeyboardAvoidingView";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useMessage } from "@/context/MessageProvider";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import {
  selectConversationById,
  selectFilteredConversationList,
  selectLastContactMessageByGroupPk,
  selectLastMessageByGroupPk,
  selectPeerById,
} from "@/store/slices/message";
import { RootState } from "@/store/store";
import { neutralA3, secondaryColor } from "@/utils/style/colors";
import { fontMedium13, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { Conversation } from "@/utils/types/message";
import {
  getConversationAvatar,
  getConversationName,
} from "@/weshnet/messageHelpers";

export const ChatList = () => {
  const navigation = useAppNavigation();
  const { activeConversationType, setActiveConversation } = useMessage();
  const conversationList = useSelector((state: RootState) =>
    selectFilteredConversationList(state, activeConversationType, ""),
  );

  const [searchInput, setSearchInput] = useState("");

  const searchResults = useMemo(() => {
    if (!searchInput) {
      return conversationList;
    }
    return conversationList.filter((item) =>
      getConversationName(item)
        .toLowerCase()
        .includes(searchInput?.toLowerCase()),
    );
  }, [conversationList, searchInput]);

  function onSearchChange(text: string) {
    setSearchInput(text);
  }

  return (
    <KeyboardAvoidingView extraVerticalOffset={60}>
      <View
        style={{ flex: 1, paddingVertical: layout.spacing_x2, width: "100%" }}
      >
        <MiniTextInput
          value={searchInput}
          icon={searchSVG}
          onChangeText={onSearchChange}
          style={{
            backgroundColor: "rgba(118, 118, 128, 0.24)",
            paddingVertical: layout.spacing_x1,
          }}
          inputStyle={[fontSemibold14, { lineHeight: 0 }]}
          placeholderTextColor={neutralA3}
          placeholder="Search..."
        />
        <SpacerColumn size={3} />
        <FlatList
          data={searchResults}
          renderItem={({ item }) => {
            return (
              <>
                <SingleFriendChatList
                  data={item}
                  onPress={() => {
                    setActiveConversation?.(item);
                    navigation.navigate("Conversation", {
                      conversationId: item?.id,
                    });
                  }}
                />
                <Separator style={{ marginVertical: 12 }} />
              </>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

type SingleChatListType = {
  data: Conversation;
  onPress: () => void;
};

const SingleFriendChatList = ({ data, onPress }: SingleChatListType) => {
  const lastMessage = useSelector((state: RootState) =>
    selectLastMessageByGroupPk(state, data.id),
  );
  const lastContactMessage = useSelector((state: RootState) =>
    selectLastContactMessageByGroupPk(state, data.id),
  );
  const contactInfo = data.members?.[0];
  const conversation = useSelector((state: RootState) =>
    selectConversationById(state, data.id),
  );
  const peerStatus = useSelector((state: RootState) =>
    selectPeerById(state, contactInfo?.peerId),
  );

  const isAllMessageRead = useMemo(() => {
    return lastContactMessage?.id === conversation?.lastReadIdByMe;
  }, [conversation?.lastReadIdByMe, lastContactMessage?.id]);

  const handleListPress = () => {
    onPress();
  };
  return (
    <CustomPressable
      onPress={handleListPress}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      <ChatAvatar
        membersAvatar={
          conversation
            ? conversation?.members.map((_, index) =>
                getConversationAvatar(conversation, index),
              )
            : [""]
        }
        isActive={peerStatus?.isActive}
      />
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
            {getConversationName(data)}
          </BrandText>
          <BrandText style={[fontMedium13, { color: neutralA3 }]}>
            {moment(lastMessage?.timestamp).fromNow()}
          </BrandText>
        </View>
        <BrandText
          style={[fontMedium13, { color: neutralA3, maxWidth: "100%" }]}
          numberOfLines={1}
        >
          {lastMessage?.payload?.message}
        </BrandText>
      </View>
      {isAllMessageRead ? (
        <SVG source={DoubleCheckSVG} height={16} width={16} />
      ) : (
        <SVG source={DoubleCheckWhiteSVG} height={16} width={16} />
      )}
    </CustomPressable>
  );
};
