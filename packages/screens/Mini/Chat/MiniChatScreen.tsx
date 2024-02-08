import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SvgProps } from "react-native-svg";
import { useSelector } from "react-redux";

import { ChatList } from "./components/ChatList";
import rightArrowSVG from "../../../../assets/icons/chevron-right-white.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import friendSVG from "../../../../assets/icons/friend.svg";
import { BrandText } from "../../../components/BrandText/BrandText";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { MiniTabScreenFC } from "../../../components/navigation/MiniNavigator";
import { SpacerColumn } from "../../../components/spacer";
import { RoundedTabs } from "../../../components/tabs/RoundedTabs";
import { ToastInfo } from "../../../components/toasts/ToastInfo";
import { useMessage } from "../../../context/MessageProvider";
import {
  selectConversationList,
  selectIsWeshConnected,
} from "../../../store/slices/message";
import { RootState } from "../../../store/store";
import { RouteName, useAppNavigation } from "../../../utils/navigation";
import {
  neutral22,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium16,
  fontSemibold14,
  fontSemibold18,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import DefaultAppBar from "../components/AppBar/DefaultAppBar";

const collectionScreenTabItems = {
  chats: {
    name: "Chats",
  },
  multiChannels: {
    name: "Multichannels",
  },
};

const DATA: (ItemProps & { id: string })[] = [
  {
    id: "1",
    title: "Add a friend",
    icon: friendSVG,
    route: "MiniFriend",
  },
  {
    id: "2",
    title: "New Conversation",
    icon: friendSVG,
    route: "MiniNewConversation",
  },
  {
    id: "3",
    title: "New Group",
    icon: friendSVG,
    route: "MiniNewGroup",
  },
];

type ItemProps = {
  title: string;
  icon: React.FC<SvgProps>;
  route?: RouteName;
  value?: string;
  onClick?: (value: string) => void;
};

const Item = ({ title, icon, route, value, onClick }: ItemProps) => {
  const navigation = useAppNavigation();

  const onNavigateToRoute = () => {
    if (route) {
      //@ts-expect-error
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
        <View
          style={{
            alignItems: "flex-end",
            position: "absolute",
            right: 4,
            top: 4,
          }}
        >
          <TouchableOpacity
            style={{
              height: 24,
              width: 24,
              borderRadius: 50,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SVG source={closeSVG} height={12} width={12} />
          </TouchableOpacity>
        </View>
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
  const [showToast, setShowToast] = useState(true);
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof collectionScreenTabItems>("chats");
  const { width: windowWidth } = useWindowDimensions();

  const { activeConversationType } = useMessage();
  const conversationList = useSelector((state: RootState) =>
    selectConversationList(state, activeConversationType),
  );
  const isWeshConnected = useSelector(selectIsWeshConnected);

  const hasChats = conversationList.length > 0;

  const hideToast = () => {
    setShowToast(false);
  };
  const onLearnMoreToastPress = () => {
    navigation.navigate("MiniChatSetting", { back: undefined });
    // setIsChatSettingModalVisible(true);
  };

  if (!isWeshConnected) {
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
          <ActivityIndicator size={"large"} />
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
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={null}
      noScroll
      mobileTitle="Chats"
      headerMini={
        showToast ? (
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
            onCrossPress={hideToast}
            position={{ left: 10, top: 0 }}
          />
        ) : (
          <DefaultAppBar title="Chat" />
        )
      }
    >
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
          width: windowWidth,
        }}
      >
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

          {!hasChats && (
            <>
              <SpacerColumn size={2} />
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
                  data={DATA}
                  renderItem={({ item }) => (
                    <Item
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
