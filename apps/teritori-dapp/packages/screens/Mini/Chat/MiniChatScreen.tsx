import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SvgProps } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";

import { ChatList } from "./components/ChatList";
import FriendInfoBar from "./components/FriendInfoBar";
import rightArrowSVG from "@/assets/icons/chevron-right-white.svg";
import closeSVG from "@/assets/icons/close.svg";
import friendSVG from "@/assets/icons/friend.svg";
import DefaultAppBar from "../../../components/mini/DefaultAppBar";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { MiniTabScreenFC } from "@/components/navigation/getMiniModeScreens";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { RoundedTabs } from "@/components/tabs/RoundedTabs";
import { ToastInfo } from "@/components/toasts/ToastInfo";
import { useMessage } from "@/context/MessageProvider";
import {
  selectFilteredConversationList,
  selectIsWeshConnected,
  selectIsChatActivated,
  setGetStartedChecklist,
  selectGetStartedChecklist,
  selectIsForceChatInfoChecked,
  setIsForceChatInfoChecked,
} from "@/store/slices/message";
import { RootState } from "@/store/store";
import { RouteName, useAppNavigation } from "@/utils/navigation";
import { neutral22, neutral77, secondaryColor } from "@/utils/style/colors";
import {
  fontMedium16,
  fontSemibold14,
  fontSemibold18,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { GetStartedKeys } from "@/utils/types/message";

const collectionScreenTabItems = {
  chats: {
    name: "Chats",
  },
  multiChannels: {
    name: "Multichannels",
  },
};

const DATA: ItemProps[] = [
  {
    id: "addAFriend",
    title: "Add a friend",
    icon: friendSVG,
    route: "MiniChatProfile",
  },
  {
    id: "newConversation",
    title: "New Conversation",
    icon: friendSVG,
    route: "MiniAddFriend",
  },
  {
    id: "newGroup",
    title: "New Group",
    icon: friendSVG,
    route: "MiniNewGroup",
  },
];

type ItemProps = {
  id: GetStartedKeys;
  title: string;
  icon: React.FC<SvgProps>;
  route?: RouteName;
  value?: string;
  onClick?: (value: string) => void;
};

const Item = ({ id, title, icon, route, value, onClick }: ItemProps) => {
  const dispatch = useDispatch();
  const navigation = useAppNavigation();

  const onNavigateToRoute = () => {
    if (route) {
      // @ts-expect-error: description todo
      navigation.navigate(route);
      return;
    }

    if (onClick) {
      onClick(value ?? "");
    }
  };

  return (
    <CustomPressable onPress={onNavigateToRoute}>
      <View
        style={[
          fontSemibold14,
          {
            backgroundColor: neutral22,
            width: 140,
            marginRight: 9,
            paddingHorizontal: layout.spacing_x0_5,
            paddingTop: layout.spacing_x0_5,
            paddingBottom: layout.spacing_x1_5,
            borderRadius: 10,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            dispatch(
              setGetStartedChecklist({
                [id]: true,
              }),
            );
          }}
          style={{
            height: 24,
            width: 24,
            borderRadius: 50,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            right: 4,
            top: 4,
            zIndex: 9,
          }}
          hitSlop={10}
        >
          <SVG source={closeSVG} height={12} width={12} />
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: layout.spacing_x2_5,
            paddingTop: layout.spacing_x0_5,
          }}
        >
          <SVG source={icon} height={48} width={48} />
          <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
            {title}
          </BrandText>
        </View>
      </View>
    </CustomPressable>
  );
};
export const MiniChatScreen: MiniTabScreenFC<"MiniChats"> = ({
  navigation,
  route,
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof collectionScreenTabItems>("chats");
  const { width: windowWidth } = useWindowDimensions();

  const dispatch = useDispatch();
  const { activeConversationType } = useMessage();
  const conversationList = useSelector((state: RootState) =>
    selectFilteredConversationList(state, activeConversationType, ""),
  );
  const isWeshConnected = useSelector(selectIsWeshConnected);
  const isChatActivated = useSelector(selectIsChatActivated);
  const getStartedCheckList = useSelector(selectGetStartedChecklist);
  const isForceChatInfoChecked = useSelector(selectIsForceChatInfoChecked);

  const hasChats = conversationList.length > 0;

  const onLearnMoreToastPress = () => {
    navigation.navigate("MiniChatSetting", { back: undefined });
    markForceChatInfoChecked();
  };

  const markForceChatInfoChecked = () => {
    dispatch(setIsForceChatInfoChecked(true));
  };

  if (!isWeshConnected || !isChatActivated) {
    return (
      <ScreenContainer
        headerChildren={<></>}
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
          {!isChatActivated ? (
            <BrandText
              style={[
                fontSemibold14,
                { textAlign: "center", marginTop: layout.spacing_x1_5 },
              ]}
            >
              Chat is turned off. Please toggle the button to activate it.
            </BrandText>
          ) : (
            <>
              <ActivityIndicator size="large" />
              <BrandText
                style={[
                  fontSemibold14,
                  { textAlign: "center", marginTop: layout.spacing_x1_5 },
                ]}
              >
                We are currently in the process of setting up Weshnet, and it
                will be ready within just a few short minutes.{"\n"} Thank you
                for your understanding
              </BrandText>
            </>
          )}
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle="Chats"
      headerMini={<DefaultAppBar title="Chat" />}
    >
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
          width: windowWidth,
        }}
      >
        {!isForceChatInfoChecked && (
          <>
            <SpacerColumn size={1} />
            <ToastInfo
              message={
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <BrandText style={[fontSemibold14]}>
                    Learn more about Forced Chat tab
                  </BrandText>
                  <SVG source={rightArrowSVG} height={20} width={20} />
                </View>
              }
              onPress={onLearnMoreToastPress}
              onCrossPress={markForceChatInfoChecked}
              touchableStyle={{
                position: "relative",
                top: 0,
                left: 0,
              }}
            />
          </>
        )}
        <SpacerColumn size={1} />
        <RoundedTabs
          items={collectionScreenTabItems}
          onSelect={(key) => setSelectedTab(key)}
          selected={selectedTab}
          style={{
            height: 36,
            maxHeight: 36,
          }}
        />

        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          <SpacerColumn size={2} />
          <FriendInfoBar />
          <SpacerColumn size={2} />
          <Separator />

          {!hasChats ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BrandText
                style={[
                  fontMedium16,
                  { textAlign: "center", color: neutral77 },
                ]}
              >
                No chats yet.
              </BrandText>
              <SpacerColumn size={0.5} />
              <BrandText
                style={[
                  fontMedium16,
                  { textAlign: "center", color: neutral77 },
                ]}
              >
                Get Started by messaging a friend.
              </BrandText>
            </View>
          ) : (
            <ChatList />
          )}

          {!hasChats &&
            !!DATA.filter((item) => !getStartedCheckList[item.id]).length && (
              <>
                <View>
                  <BrandText
                    style={[
                      fontSemibold18,
                      { color: secondaryColor, marginBottom: 12 },
                    ]}
                  >
                    Get Started
                  </BrandText>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={DATA.filter((item) => !getStartedCheckList[item.id])}
                    renderItem={({ item }) => (
                      <Item
                        id={item.id}
                        title={item.title}
                        icon={item.icon}
                        value={item.value}
                        route={item.route}
                      />
                    )}
                    keyExtractor={(item) => item.id}
                    style={{ marginBottom: 16 }}
                  />
                </View>
              </>
            )}
        </View>
      </View>
    </ScreenContainer>
  );
};
