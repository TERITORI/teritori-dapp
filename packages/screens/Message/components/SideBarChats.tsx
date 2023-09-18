import React, { useEffect } from "react";
import {
  Platform,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";

import { ChatItem } from "./ChatItem";
import { ConversationSelector } from "./ConversationSelector";
import { FriendsBar } from "./FriendsBar";
import add from "../../../../assets/icons/add-circle-filled.svg";
import Search from "../../../../assets/icons/search.svg";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useMessage } from "../../../context/MessageProvider";
import { selectConversationList } from "../../../store/slices/message";
import { useAppNavigation } from "../../../utils/navigation";
import {
  primaryColor,
  secondaryColor,
  neutral22,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";

export const SideBarChats = () => {
  const { activeConversationType, activeConversation, setActiveConversation } =
    useMessage();
  const conversationList = useSelector(
    selectConversationList(activeConversationType)
  );

  const { navigate } = useAppNavigation();
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    console.log(
      "test conv",
      conversationList.find((conv) => conv.id === activeConversation?.id)
    );
    if (
      (!activeConversation && conversationList.length) ||
      !conversationList.find((conv) => conv.id === activeConversation?.id)
    ) {
      setActiveConversation?.(conversationList[0]);
    }
  }, [activeConversation, conversationList, setActiveConversation]);

  return (
    <View
      style={{
        paddingHorizontal: layout.spacing_x1_5,
        width: "100%",
        maxWidth: Platform.OS === "web" ? 300 : windowWidth,
      }}
    >
      <>
        <SpacerColumn size={2} />
        <FriendsBar />
        <SpacerColumn size={2.5} />
        <FlexRow justifyContent="space-between" style={{ zIndex: 9 }}>
          <View>
            <FlexRow>
              {/* <BrandText style={[fontSemibold14, { color: secondaryColor }]}>
                All conversation
              </BrandText> */}
              <ConversationSelector />
              {/* <SpacerRow size={0.8} />
              <SVG
                source={chevronDownSVG}
                height={20}
                width={20}
                color={secondaryColor}
              /> */}
            </FlexRow>
          </View>
          <View>
            <FlexRow>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  padding: layout.spacing_x0_25,
                }}
                onPress={() =>
                  navigate("Message", { view: "CreateConversation" })
                }
              >
                <SVG source={add} color={primaryColor} />
              </TouchableOpacity>
              <SpacerRow size={2} />
              <SVG
                source={Search}
                height={20}
                width={20}
                color={secondaryColor}
              />
            </FlexRow>
          </View>
        </FlexRow>
        <SpacerColumn size={2.5} />
        <Separator horizontal={false} color={neutral22} />
        <SpacerColumn size={1.5} />
      </>
      <View style={{ zIndex: 1 }}>
        {conversationList.map((item, index) => (
          <ChatItem
            data={item}
            key={index}
            isActive={item.id === activeConversation?.id}
            onPress={() => {
              if (Platform.OS === "web") {
                setActiveConversation?.(item);
              } else {
                navigate("ChatSection", item);
              }
            }}
            isLastItem={index === conversationList.length - 1}
          />
        ))}
      </View>
    </View>
  );
};
