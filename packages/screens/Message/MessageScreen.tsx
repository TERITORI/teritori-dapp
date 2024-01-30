import React, { useMemo } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";

import { ChatSection } from "./components/ChatSection";
import { CreateConversation } from "./components/CreateConversation";
import { CreateGroup } from "./components/CreateGroup";
import { FriendshipManager } from "./components/FriendshipManager";
import { JoinGroup } from "./components/JoinGroup";
import { MessageBlankFiller } from "./components/MessageBlankFiller";
import MessageCard from "./components/MessageCard";
import { MessageHeader } from "./components/MessageHeader";
import { SideBarChats } from "./components/SideBarChats";
import chat from "../../../assets/icons/add-chat.svg";
import friend from "../../../assets/icons/friend.svg";
import group from "../../../assets/icons/group.svg";
import space from "../../../assets/icons/space.svg";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Separator } from "../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useMessage } from "../../context/MessageProvider";
import { useIsMobile } from "../../hooks/useIsMobile";
import { selectIsWeshConnected } from "../../store/slices/message";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

import { router, useLocalSearchParams } from "@/utils/router";

export const MessageScreen = () => {
  const params = useLocalSearchParams<"/message">();
  const activeView = params?.view;
  const activeTab = params?.tab;

  const isWeshConnected = useSelector(selectIsWeshConnected);

  const { activeConversation, setActiveConversation } = useMessage();

  const isMobile = useIsMobile();
  const { width } = useWindowDimensions();

  const isMobileChatView = useMemo(() => {
    return isMobile && (activeConversation || activeView === "AddFriend");
  }, [isMobile, activeConversation, activeView]);

  const HEADER_CONFIG = [
    {
      id: 1,
      title: "Create a conversation",
      icon: chat,
      isActive: true,
      onPress: () => {
        router.navigate({
          pathname: "/message/[view]",
          params: { view: "CreateConversation" },
        });
      },
    },
    {
      id: 2,
      title: "Create a group",
      icon: group,
      isActive: true,
      onPress() {
        router.navigate({
          pathname: "/message/[view]",
          params: { view: "CreateGroup" },
        });
      },
    },
    {
      id: 3,
      title: "Add a friend",
      icon: friend,
      isActive: true,
      onPress() {
        if (Platform.OS !== "web") {
          router.navigate("/message/friends");
        } else {
          router.navigate({
            pathname: "/message/[view]",
            params: { view: "AddFriend" },
          });
        }
      },
    },
    {
      id: 4,
      title: "Join a group",
      icon: group,
      isActive: true,
      onPress() {
        router.navigate({
          pathname: "/message/[view]",
          params: { view: "JoinGroup" },
        });
      },
    },
    {
      id: 5,
      title: "Create a Teritori space",
      icon: space,
      isActive: false,
      subtitle: "coming soon",
      onPress() {},
    },
  ];

  if (!isWeshConnected) {
    return (
      <ScreenContainer
        headerChildren={<MessageHeader />}
        responsive
        fullWidth
        footerChildren={<></>}
        noScroll
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: layout.spacing_x1,
          }}
        >
          <ActivityIndicator size="large" />
          <BrandText
            style={[
              fontSemibold14,
              { textAlign: "center", marginTop: layout.spacing_x1_5 },
            ]}
          >
            We are currently in the process of setting up Weshnet, and it will
            be ready within just a few short minutes.{"\n"} Thank you for your
            understanding
          </BrandText>
        </View>
      </ScreenContainer>
    );
  }
  return (
    <ScreenContainer
      headerChildren={<MessageHeader />}
      responsive
      fullWidth
      footerChildren={<></>}
      noScroll
    >
      {(!isMobile || !isMobileChatView) && (
        <View>
          <SpacerColumn size={3} />
          <ScrollView
            horizontal
            style={{
              paddingHorizontal: isMobile
                ? layout.spacing_x0_5
                : layout.spacing_x1_5,
              maxWidth: width,
            }}
          >
            {HEADER_CONFIG.map((item) => (
              <React.Fragment key={item.title}>
                <TouchableOpacity onPress={item.onPress}>
                  <MessageCard
                    text={item.title}
                    icon={item.icon}
                    subtext={item?.subtitle || ""}
                    isActive={item.isActive}
                  />
                </TouchableOpacity>
                <SpacerRow size={2} />
              </React.Fragment>
            ))}
          </ScrollView>
          <SpacerColumn size={3} />
          <Separator />
        </View>
      )}
      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          flex: 1,
        }}
      >
        {(!isMobile || !isMobileChatView) && <SideBarChats />}
        {(!isMobile || isMobileChatView) && (
          <>
            {!isMobileChatView && <Separator horizontal />}
            {activeView === "AddFriend" ? (
              <FriendshipManager
                activeTab={activeTab}
                setActiveConversation={(conv) => {
                  setActiveConversation(conv);
                  router.navigate("/message");
                }}
              />
            ) : (
              <>
                {activeConversation ? (
                  <ChatSection conversation={activeConversation} />
                ) : (
                  <MessageBlankFiller />
                )}
              </>
            )}
          </>
        )}
      </View>
      {activeView === "CreateGroup" && (
        <CreateGroup onClose={() => router.navigate("/message")} />
      )}
      {activeView === "CreateConversation" && (
        <CreateConversation onClose={() => router.navigate("/message")} />
      )}
      {activeView === "JoinGroup" && (
        <JoinGroup onClose={() => router.navigate("/message")} />
      )}
    </ScreenContainer>
  );
};
