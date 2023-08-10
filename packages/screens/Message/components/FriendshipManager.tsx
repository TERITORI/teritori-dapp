import React, { useMemo } from "react";
import { View, Platform } from "react-native";
import { useSelector } from "react-redux";

import { AddFriend } from "./AddFriend";
import { Friends } from "./Friends";
import { Requests } from "./Requests";
import plus from "../../../../assets/icons/Addplus.svg";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import {
  selectContactRequestList,
  selectConversationList,
} from "../../../store/slices/message";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { Conversation } from "../../../utils/types/message";

interface FriendshipManagerProps {
  setActiveConversation?: (item: Conversation) => void;
  activeTab: string;
}

export const FriendshipManager = ({
  setActiveConversation,
  activeTab = "friends",
}: FriendshipManagerProps) => {
  const conversations = useSelector(selectConversationList);
  const contactRequests = useSelector(selectContactRequestList);
  const { navigate } = useAppNavigation();

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
      <Tabs
        items={tabs}
        onSelect={(tab) => {
          Platform.OS === "web"
            ? navigate("Message", { view: "AddFriend", tab })
            : navigate("FriendshipManager", { tab });
        }}
        selected={activeTab}
        tabContainerStyle={{
          paddingBottom: layout.padding_x1_5,
        }}
        style={{
          height: 40,
        }}
      />
      <Separator horizontal={false} />
      <SpacerColumn size={2} />
      {activeTab === "friends" && (
        <Friends
          items={contactConversations}
          setActiveConversation={setActiveConversation}
        />
      )}
      {activeTab === "request" && <Requests items={contactRequests} />}
      {activeTab === "addFriend" && <AddFriend />}
    </>
  );
  if (Platform.OS === "web") {
    return (
      <View style={{ paddingHorizontal: layout.padding_x2 }}>
        {renderContentWeb()}
      </View>
    );
  }
  return (
    <ScreenContainer onBackPress={() => navigate("Message")}>
      <View style={{ paddingHorizontal: layout.padding_x0_5 }}>
        {renderContentWeb()}
      </View>
    </ScreenContainer>
  );
};

export const FriendshipManagerScreen: ScreenFC<"FriendshipManager"> = ({
  route,
}) => {
  const activeTab = route?.params?.tab;

  return <FriendshipManager activeTab={activeTab} />;
};
