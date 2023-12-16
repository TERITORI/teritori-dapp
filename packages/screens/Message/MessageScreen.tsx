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
import { useAppNavigation, ScreenFC } from "../../utils/navigation";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const MessageScreen: ScreenFC<"Message"> = ({ route }) => {
  const activeView = route?.params?.view;
  const activeTab = route?.params?.tab;
  const isWeshConnected = useSelector(selectIsWeshConnected);

  const { activeConversation, setActiveConversation } = useMessage();

  const navigation = useAppNavigation();
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
        navigation.navigate("Message", { view: "CreateConversation" });
      },
    },
    {
      id: 2,
      title: "Create a group",
      icon: group,
      isActive: true,
      onPress() {
        navigation.navigate("Message", { view: "CreateGroup" });
      },
    },
    {
      id: 3,
      title: "Add a friend",
      icon: friend,
      isActive: true,
      onPress() {
        if (Platform.OS !== "web") {
          navigation.navigate("FriendshipManager");
        } else {
          navigation.navigate("Message", { view: "AddFriend" });
        }
      },
    },
    {
      id: 4,
      title: "Join a group",
      icon: group,
      isActive: true,
      onPress() {
        navigation.navigate("Message", { view: "JoinGroup" });
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
                  navigation.navigate("Message");
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
        <CreateGroup onClose={() => navigation.navigate("Message")} />
      )}
      {activeView === "CreateConversation" && (
        <CreateConversation onClose={() => navigation.navigate("Message")} />
      )}
      {activeView === "JoinGroup" && (
        <JoinGroup onClose={() => navigation.navigate("Message")} />
      )}
    </ScreenContainer>
  );
};
