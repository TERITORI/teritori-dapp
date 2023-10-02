import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";

import { ChatItem } from "./ChatItem";
import { ConversationSelector } from "./ConversationSelector";
import { FriendsBar } from "./FriendsBar";
import { SearchInput } from "./SearchInput";
import addSVG from "../../../../assets/icons/add-circle-filled.svg";
import searchSVG from "../../../../assets/icons/search.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useMessage } from "../../../context/MessageProvider";
import { selectConversationList } from "../../../store/slices/message";
import { setSearchText } from "../../../store/slices/search";
import { useAppNavigation } from "../../../utils/navigation";
import {
  primaryColor,
  secondaryColor,
  neutral22,
  neutral77,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { getConversationName } from "../../../weshnet/client/messageHelpers";

export const SideBarChats = () => {
  const { activeConversationType, activeConversation, setActiveConversation } =
    useMessage();
  const conversationList = useSelector(
    selectConversationList(activeConversationType)
  );

  const { navigate } = useAppNavigation();
  const { width: windowWidth } = useWindowDimensions();

  const [isSearch, setIsSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (
      (!activeConversation && conversationList.length) ||
      !conversationList.find((conv) => conv.id === activeConversation?.id)
    ) {
      setActiveConversation?.(conversationList[0]);
    }
  }, [activeConversation, conversationList, setActiveConversation]);

  const searchResults = useMemo(() => {
    if (!searchInput) {
      return conversationList;
    }
    return conversationList.filter((item) =>
      getConversationName(item)
        .toLowerCase()
        .includes(searchInput?.toLowerCase())
    );
  }, [conversationList, searchInput]);

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
          {isSearch ? (
            <SearchInput
              value={searchInput}
              setValue={setSearchInput}
              onClose={() => {
                setIsSearch(false);
                setSearchText("");
              }}
            />
          ) : (
            <>
              <View>
                <FlexRow>
                  <ConversationSelector />
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
                    <SVG source={addSVG} color={primaryColor} />
                  </TouchableOpacity>
                  <SpacerRow size={2} />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                      padding: layout.spacing_x0_25,
                    }}
                    onPress={() => setIsSearch(true)}
                  >
                    <SVG
                      source={searchSVG}
                      height={20}
                      width={20}
                      color={secondaryColor}
                    />
                  </TouchableOpacity>
                </FlexRow>
              </View>
            </>
          )}
        </FlexRow>
        <SpacerColumn size={2.5} />
        <Separator horizontal={false} color={neutral22} />
        <SpacerColumn size={1.5} />
      </>
      <ScrollView style={{}}>
        <View style={{ zIndex: 1 }}>
          {searchResults.map((item, index) => (
            <ChatItem
              data={item}
              key={index}
              isActive={item.id === activeConversation?.id}
              onPress={() => {
                if (Platform.OS === "web") {
                  setActiveConversation?.(item);
                  navigate("Message");
                } else {
                  navigate("ChatSection", item);
                }
              }}
              isLastItem={index === conversationList.length - 1}
            />
          ))}
        </View>

        {!!searchInput && !searchResults.length && (
          <BrandText
            style={[fontSemibold14, { color: neutral77, textAlign: "center" }]}
          >
            No records found
          </BrandText>
        )}
      </ScrollView>
    </View>
  );
};
