import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { Avatar } from "./components/Avatar";
import { ChatSection } from "./components/ChatSection";
import { CreateConversation } from "./components/CreateConversation";
import { CreateGroup } from "./components/CreateGroup";
import { FriendshipManager } from "./components/FriendshipManager";
import { JoinGroup } from "./components/JoinGroup";
import { MessageBlankFiller } from "./components/MessageBlankFiller";
import MessageCard from "./components/MessageCard";
import { MessageHeader } from "./components/MessageHeader";
import { MessageOnboarding } from "./components/MessageOnboarding";
import { Profile } from "./components/Profile";
import { SideBarChats } from "./components/SideBarChats";
import chat from "../../../assets/icons/add-chat.svg";
import friend from "../../../assets/icons/friend.svg";
import group from "../../../assets/icons/group.svg";
import space from "../../../assets/icons/space.svg";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useMessage } from "@/context/MessageProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  selectIsWeshConnected,
  selectIsOnboardingCompleted,
  selectContactInfo,
} from "@/store/slices/message";
import { useAppNavigation, ScreenFC } from "@/utils/navigation";
import {
  neutral00,
  neutral33,
  neutralA3,
  secondaryColor,
} from "@/utils/style/colors";
import {
  fontSemibold14,
  fontMedium10,
  fontSemibold13,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const MessageScreen: ScreenFC<"Message"> = ({ route }) => {
  const activeView = route?.params?.view;
  const activeTab = route?.params?.tab;
  const isWeshConnected = useSelector(selectIsWeshConnected);
  const isOnboardingCompleted = useSelector(selectIsOnboardingCompleted);
  const contactInfo = useSelector(selectContactInfo);
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

  if (!isOnboardingCompleted) {
    return <MessageOnboarding />;
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
              maxHeight: 78,
            }}
            contentContainerStyle={{
              paddingBottom: layout.spacing_x2,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Message", { view: "MyProfile" })
              }
              activeOpacity={0.9}
              style={{
                paddingHorizontal: layout.spacing_x1,
                borderRadius: layout.spacing_x1_5,
                backgroundColor: neutral00,
                borderColor: neutral33,
                borderWidth: 1,
                height: 56,
                width: 140,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Avatar source={contactInfo?.avatar} size={30} />
              <SpacerRow size={1} />
              <View>
                <BrandText
                  style={[fontSemibold13, { color: secondaryColor, width: 80 }]}
                  numberOfLines={1}
                >
                  {contactInfo?.name}
                </BrandText>
                <SpacerColumn size={0.5} />
                <BrandText style={[fontMedium10, { color: neutralA3 }]}>
                  My Profile
                </BrandText>
              </View>
            </TouchableOpacity>
            <SpacerRow size={2} />
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
                  <ChatSection conversationId={activeConversation.id} />
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
      {activeView === "MyProfile" && (
        <Profile onClose={() => navigation.navigate("Message")} />
      )}
    </ScreenContainer>
  );
};
