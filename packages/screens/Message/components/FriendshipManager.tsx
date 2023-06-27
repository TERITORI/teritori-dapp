import React, { useMemo, useState } from "react";
import { View, Platform } from "react-native";
import { useSelector } from "react-redux";

import { AddFriend } from "./AddFriend";
import { Friends } from "./Friends";
import { Requests } from "./Requests";
import plus from "../../../../assets/icons/Addplus.svg";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import requestData from "../../../components/requests/data";
import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import {
  selectContactRequestList,
  selectConversationList,
} from "../../../store/slices/message";
import { layout } from "../../../utils/style/layout";
import friendData from "../../components/friends/data";

export const FriendshipManager = ({ setActiveConversation }) => {
  const conversations = useSelector(selectConversationList);
  const contactRequests = useSelector(selectContactRequestList);

  const contactConversations = useMemo(() => {
    return conversations.filter((item) => item.type === "contact");
  }, [conversations]);
  console.log("contact-requests", contactRequests);
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
    },
  };
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("friends");
  const renderContentWeb = () => (
    <>
      <SpacerColumn size={2} />
      <Tabs
        items={tabs}
        onSelect={setSelectedTab}
        selected={selectedTab}
        tabContainerStyle={{
          paddingBottom: layout.padding_x1_5,
        }}
      />
      <Separator horizontal={false} />
      <SpacerColumn size={2} />
      {selectedTab === "friends" && (
        <Friends
          items={contactConversations}
          setActiveConversation={setActiveConversation}
        />
      )}
      {selectedTab === "request" && <Requests items={contactRequests} />}
      {selectedTab === "addFriend" && <AddFriend />}
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
    <ScreenContainer noScroll>
      <View style={{ paddingHorizontal: layout.padding_x0_5 }}>
        {renderContentWeb()}
      </View>
    </ScreenContainer>
  );
};
