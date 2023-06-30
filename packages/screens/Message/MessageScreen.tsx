import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Platform, ScrollView } from "react-native";

import { CreateConversation } from "./components/CreateConversation";
import { CreateGroup } from "./components/CreateGroup";
import { FriendshipManager } from "./components/FriendshipManager";
import { MessageGroupChat } from "./components/MessageGroupChat";
import { MessageHeader } from "./components/MessageHeader";
import { SideBarChats } from "./components/SideBarChats";
import chat from "../../../assets/icons/add-chat.svg";
import friend from "../../../assets/icons/friend.svg";
import group from "../../../assets/icons/group.svg";
import space from "../../../assets/icons/space.svg";
import FlexRow from "../../components/FlexRow";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/Separator";
import { MessageBlankFiller } from "../../components/blankFiller/MessageBlankFiller";
import MessageCard from "../../components/cards/MessageCard";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useAppNavigation, ScreenFC } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { weshServices } from "../../weshnet/client";

export const MessageScreen: ScreenFC<"Message"> = () => {
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [isCreateConversation, setIsCreateConversation] = useState(false);
  const selectedWallet = useSelectedWallet();
  const [activeConversation, setActiveConversation] = useState(false);

  const [activeTab, setActiveTab] = useState<"chat" | "add-friend">("chat");
  const userInfo = useNSUserInfo(selectedWallet?.userId);

  const navigation = useAppNavigation();

  useEffect(() => {
    weshServices.createConfig();
  }, []);

  useEffect(() => {
    weshServices.createSharableLink(userInfo?.metadata?.tokenId);
  }, [userInfo?.metadata?.tokenId]);

  const HEADER_CONFIG = [
    {
      id: 1,
      title: "Create a conversation",
      icon: chat,
      onPress: () => {
        setIsCreateConversation(true);
      },
    },
    {
      id: 2,
      title: "Create a group",
      icon: group,
      onPress() {
        setIsCreateGroup(true);
      },
    },
    {
      id: 3,
      title: "Add a friend",
      icon: friend,
      onPress() {
        ["android", "ios"].includes(Platform.OS)
          ? navigation.navigate("FriendshipManager")
          : setActiveTab("add-friend");
      },
    },
    {
      id: 4,
      title: "Create a Teritori space",
      icon: space,
      subtitle: "coming soon",
      onPress() {},
    },
  ];

  return (
    <ScreenContainer
      footerChildren
      headerChildren={<MessageHeader />}
      responsive
      fullWidth
    >
      <View style={{}}>
        <SpacerColumn size={3} />

        <FlexRow>
          <ScrollView
            horizontal
            style={{
              paddingHorizontal: layout.padding_x1_5,
            }}
          >
            {HEADER_CONFIG.map((item) => (
              <React.Fragment key={item.title}>
                <TouchableOpacity onPress={item.onPress}>
                  <MessageCard
                    text={item.title}
                    icon={item.icon}
                    subtext={item?.subtitle || ""}
                  />
                </TouchableOpacity>
                <SpacerRow size={2} />
              </React.Fragment>
            ))}
          </ScrollView>
        </FlexRow>
        <SpacerColumn size={3} />

        <Separator />

        {["android", "ios"].includes(Platform.OS) ? (
          <SideBarChats
            setActiveConversation={(conv) => {
              setActiveConversation(conv);
              setActiveTab("chat");
            }}
            activeConversation={activeConversation}
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <SideBarChats
              setActiveConversation={(conv) => {
                setActiveConversation(conv);
                setActiveTab("chat");
              }}
              activeConversation={activeConversation}
            />
            <Separator horizontal />

            <View style={{ flex: 1 }}>
              {activeTab === "add-friend" ? (
                <FriendshipManager
                  setActiveConversation={(conv) => {
                    setActiveConversation(conv);
                    setActiveTab("chat");
                  }}
                />
              ) : (
                <>
                  {activeConversation ? (
                    <MessageGroupChat conversation={activeConversation} />
                  ) : (
                    <MessageBlankFiller />
                  )}
                </>
              )}
            </View>
          </View>
        )}

        {isCreateGroup && (
          <CreateGroup onClose={() => setIsCreateGroup(false)} />
        )}
        {isCreateConversation && (
          <CreateConversation onClose={() => setIsCreateConversation(false)} />
        )}
      </View>
    </ScreenContainer>
  );
};
