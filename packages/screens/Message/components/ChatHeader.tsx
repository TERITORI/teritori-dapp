import * as Clipboard from "expo-clipboard";
import React, { useRef, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import { ConversationAvatar } from "./ConversationAvatar";
import { GroupDetails } from "./GroupDetails";
import { SearchInput } from "./SearchInput";
import dots from "../../../../assets/icons/dots.svg";
import searchSVG from "../../../../assets/icons/search.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { LegacyTertiaryBox } from "../../../components/boxes/LegacyTertiaryBox";
import { BackButton } from "../../../components/navigation/components/BackButton";
import { SpacerRow } from "../../../components/spacer";
import { useDropdowns } from "../../../context/DropdownsProvider";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { updateConversationById } from "../../../store/slices/message";
import { neutral17, secondaryColor } from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Conversation } from "../../../utils/types/message";
import { weshClient } from "../../../weshnet/client";
import { subscribeMessages } from "../../../weshnet/message/subscriber";
import { getConversationName } from "../../../weshnet/messageHelpers";
import { createMultiMemberShareableLink } from "../../../weshnet/services";
import { bytesFromString } from "../../../weshnet/utils";

interface ChatHeaderProps {
  searchInput: string;
  setSearchInput: (input: string) => void;
  conversation: Conversation;
  onBackPress?: () => void;
}

export const ChatHeader = ({
  searchInput,
  setSearchInput,
  conversation,
  onBackPress,
}: ChatHeaderProps) => {
  const dispatch = useDispatch();
  const { setToastSuccess } = useFeedbacks();

  const [showTextInput, setShowTextInput] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);

  const { onPressDropdownButton, isDropdownOpen, closeOpenedDropdown } =
    useDropdowns();
  const dropdownRef = useRef<View>(null);
  const handleSearchIconPress = () => {
    setShowTextInput(true);
  };

  const LIST_ITEMS = [
    conversation.type === "group" && {
      label: "Leave Group",
      onPress: async () => {
        await weshClient.client.MultiMemberGroupLeave({
          groupPk: bytesFromString(conversation.id),
        });
        closeOpenedDropdown();
      },
    },
    conversation.type === "group" && {
      label: "Copy conversation link",
      onPress: async () => {
        const groupInfo = await weshClient.client.GroupInfo({
          groupPk: bytesFromString(conversation.id),
        });

        if (!groupInfo.group) {
          return;
        }

        const groupLink = createMultiMemberShareableLink(
          groupInfo?.group,
          conversation.name,
        );
        Clipboard.setStringAsync(groupLink || "");
        setToastSuccess({
          title: "Group link copied!",
          message: "",
        });
      },
    },
    conversation.type === "group" && {
      label: "View Details",
      onPress: async () => {
        setShowGroupDetails(true);
        closeOpenedDropdown();
      },
    },
    conversation.status === "archived" && {
      label: "Unarchive Chat",
      onPress: () => {
        dispatch(
          updateConversationById({
            id: conversation.id,
            status: "active",
          }),
        );
        subscribeMessages(conversation.id);
        closeOpenedDropdown();
      },
    },
    conversation.status === "active" && {
      label: "Archive Chat",
      onPress: () => {
        dispatch(
          updateConversationById({
            id: conversation.id,
            status: "archived",
          }),
        );
        closeOpenedDropdown();
      },
    },
    conversation.status === "archived" && {
      label: "Unarchive Chat",
      onPress: () => {
        dispatch(
          updateConversationById({
            id: conversation.id,
            status: "active",
          }),
        );
        closeOpenedDropdown();
      },
    },
  ].filter(Boolean) as {
    label: string;
    onPress: () => void;
  }[];

  return (
    <>
      <View
        style={{
          backgroundColor: neutral17,
          flexDirection: "row",
          padding: 6,
          justifyContent: "space-between",
          alignItems: "center",
          height: 46,
        }}
        ref={dropdownRef}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {onBackPress && (
            <>
              <BackButton onPress={onBackPress} />
              <SpacerRow size={2} />
            </>
          )}
          <ConversationAvatar conversation={conversation} size={20} />
          <SpacerRow size={1} />
          <View>
            <BrandText style={[fontSemibold13, { color: secondaryColor }]}>
              {getConversationName(conversation)}
            </BrandText>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {showTextInput ? (
            <SearchInput
              value={searchInput}
              setValue={setSearchInput}
              onClose={() => setShowTextInput(false)}
            />
          ) : (
            <View>
              <FlexRow>
                <SpacerRow size={4} />
                <TouchableOpacity
                  onPress={handleSearchIconPress}
                  style={{
                    padding: layout.spacing_x0_75,
                  }}
                >
                  <SVG
                    source={searchSVG}
                    style={{
                      height: 20,
                      width: 20,
                    }}
                  />
                </TouchableOpacity>
                <SpacerRow size={1} />
                <TouchableOpacity
                  style={{
                    padding: layout.spacing_x0_75,
                  }}
                  onPress={() => onPressDropdownButton(dropdownRef)}
                >
                  <SVG source={dots} />
                </TouchableOpacity>
                {isDropdownOpen(dropdownRef) && (
                  <LegacyTertiaryBox
                    width={140}
                    style={{ position: "absolute", top: 30, right: 10 }}
                    mainContainerStyle={{
                      paddingHorizontal: layout.spacing_x2,
                      paddingTop: layout.spacing_x2,
                      backgroundColor: neutral17,
                      alignItems: "flex-start",
                    }}
                    squaresBackgroundColor={neutral17}
                    noRightBrokenBorder
                  >
                    {LIST_ITEMS.map((item) => {
                      return (
                        <TouchableOpacity
                          style={{
                            marginBottom: layout.spacing_x2,
                          }}
                          key={item.label}
                          onPress={item.onPress}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <BrandText
                              style={[
                                fontSemibold12,
                                { marginLeft: layout.spacing_x1_5 },
                              ]}
                            >
                              {item.label}
                            </BrandText>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </LegacyTertiaryBox>
                )}

                <SpacerRow size={1} />
              </FlexRow>
            </View>
          )}
        </View>
        {showGroupDetails && (
          <GroupDetails
            conversation={conversation}
            onClose={() => setShowGroupDetails(false)}
          />
        )}
      </View>
    </>
  );
};
