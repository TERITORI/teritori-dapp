import React, { useMemo } from "react";
import { Platform, View, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

import { Friends } from "./Friends";
import { Requests } from "./Requests";
import plus from "../../../../assets/icons/add-circle.svg";
import FlexRow from "../../../components/FlexRow";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { BackButton } from "../../../components/navigation/components/BackButton";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import { useIsMobile } from "../../../hooks/useIsMobile";
import {
  selectContactRequestList,
  selectConversationList,
} from "../../../store/slices/message";
import { layout } from "../../../utils/style/layout";
import {
  Conversation,
  MessageFriendsTabItem,
} from "../../../utils/types/message";

import { router, useLocalSearchParams } from "@/utils/router";

interface FriendshipManagerProps {
  setActiveConversation?: (item: Conversation) => void;
  activeTab?: string;
}

export const FriendshipManager = ({
  setActiveConversation,
  activeTab = "friends",
}: FriendshipManagerProps) => {
  const conversations = useSelector(selectConversationList);
  const contactRequests = useSelector(selectContactRequestList);

  const isMobile = useIsMobile();
  const { width } = useWindowDimensions();

  const contactConversations = useMemo(() => {
    return conversations.filter((item) => item.type === "contact");
  }, [conversations]);

  const tabs = {
    friends: {
      name: "Friends",
      badgeCount: contactConversations.length,
      icon: "",
    },
    request: {
      name: "Requests",
      badgeCount: contactRequests.length,
      icon: "",
    },
    addFriend: {
      name: "Add a friend",
      icon: plus,
      disabled: true,
    },
  };

  const renderContentWeb = () => (
    <>
      <SpacerColumn size={2} />
      <FlexRow>
        {isMobile && (
          <BackButton
            style={{
              marginRight: layout.spacing_x2,
              marginTop: -layout.spacing_x1_5,
            }}
            onPress={() => router.navigate("/message")}
          />
        )}
        <Tabs
          items={tabs}
          onSelect={(tab) => {
            if (Platform.OS !== "web") {
              router.navigate({
                pathname: "/message/friends",
                params: { tab },
              });
            } else {
              router.navigate({
                pathname: "/message/[view]",
                params: { view: "AddFriend", tab },
              });
            }
          }}
          selected={activeTab as MessageFriendsTabItem}
          tabContainerStyle={{
            paddingBottom: layout.spacing_x1_5,
          }}
          style={{
            height: 40,
          }}
        />
      </FlexRow>
      <Separator horizontal={false} />
      <SpacerColumn size={2} />
      {activeTab === "friends" && (
        <Friends
          items={contactConversations}
          setActiveConversation={setActiveConversation}
        />
      )}
      {activeTab === "request" && <Requests items={contactRequests} />}
    </>
  );
  if (Platform.OS !== "web") {
    return (
      <ScreenContainer onBackPress={() => router.navigate("/message")}>
        <View style={{ paddingHorizontal: layout.spacing_x0_5 }}>
          {renderContentWeb()}
        </View>
      </ScreenContainer>
    );
  }
  return (
    <View
      style={{
        paddingHorizontal: layout.spacing_x2,
        flex: 1,
        width: isMobile ? width : "100%",
      }}
    >
      {renderContentWeb()}
    </View>
  );
};

export const FriendshipManagerScreen = () => {
  const params = useLocalSearchParams<"/message/friends">();
  const activeTab = params?.tab || "friends";

  return <FriendshipManager activeTab={activeTab} />;
};
