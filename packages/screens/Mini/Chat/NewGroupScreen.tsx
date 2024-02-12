import React, { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import {
  ContactSelectionType,
  NewConversationOrGroupSelector,
} from "./components/NewConversationOrGroupSelector";
import searchSVG from "../../../../assets/icons/search-gray.svg";
import { GroupInfo_Reply } from "../../../api/weshnet/protocoltypes";
import { SpacerColumn } from "../../../components/spacer";
import {
  selectContactInfo,
  selectConversationList,
} from "../../../store/slices/message";
import { ScreenFC } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { weshClient } from "../../../weshnet";
import { subscribeMessages } from "../../../weshnet/message/subscriber";
import {
  getConversationAvatar,
  getConversationName,
} from "../../../weshnet/messageHelpers";
import { sendMessage } from "../../../weshnet/services";
import { bytesFromString, stringFromBytes } from "../../../weshnet/utils";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

export const NewGroupScreen: ScreenFC<"MiniNewGroup"> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const conversations = useSelector(selectConversationList);
  const contactInfo = useSelector(selectContactInfo);

  const usersList = conversations.reduce((acc, conversation) => {
    const name = getConversationName(conversation);
    if (conversation && conversation?.type === "contact") {
      const contactPk = conversation?.members?.[0].id;
      if (search) {
        if (name.toLowerCase().includes(search.toLowerCase())) {
          acc.push({
            id: contactPk,
            avatar: conversation?.members.map((_, index) =>
              getConversationAvatar(conversation, index),
            ),
            name,
          });
        }
        return acc;
      }
      acc.push({
        id: contactPk,
        avatar: conversation?.members.map((_, index) =>
          getConversationAvatar(conversation, index),
        ),
        name,
      });
    }
    return acc;
  }, [] as ContactSelectionType[]);

  const handleCreateGroup = async (
    selectedContacts: string[],
    groupName: string,
  ) => {
    if (!groupName) {
      return;
    }
    try {
      const group = await weshClient.client.MultiMemberGroupCreate({});

      const groupInfo = await weshClient.client.GroupInfo({
        groupPk: group.groupPk,
      });

      await sendMessage({
        groupPk: group.groupPk,
        message: {
          type: "group-create",
          payload: {
            message: "",
            files: [],
            metadata: {
              groupName,
            },
          },
        },
      });

      await Promise.all(
        conversations
          .filter((item) => selectedContacts.includes(item?.members?.[0]?.id))
          .map(async (item) => {
            const contactPk = bytesFromString(item.members[0].id);
            const _group = await weshClient.client.GroupInfo({
              contactPk,
            });

            await sendMessage({
              groupPk: _group.group?.publicKey,
              message: {
                type: "group-invite",
                payload: {
                  message: `${
                    contactInfo.name || "Anon"
                  } has invited you to join group ${groupName}`,
                  metadata: {
                    groupName,
                    group: (GroupInfo_Reply.toJSON(groupInfo) as any).group,
                    contact: item?.members?.[0],
                  },
                  files: [],
                },
              },
            });
          }),
      );

      subscribeMessages(stringFromBytes(groupInfo.group?.publicKey));
    } catch (err: any) {
      console.error("create group err", err);
    }
  };

  return (
    <BlurScreenContainer title="New group">
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <MiniTextInput
          onChangeText={setSearch}
          value={search}
          icon={searchSVG}
          placeholder="Search by nickname"
          style={{ paddingVertical: layout.spacing_x1 }}
          inputStyle={[fontMedium14, { lineHeight: 0 }]}
          placeholderTextColor={neutralA3}
        />
        <SpacerColumn size={2} />
        <NewConversationOrGroupSelector
          contacts={usersList}
          isGroupSelector
          onPressContact={({ id }) =>
            navigation.replace("Conversation", { conversationId: id })
          }
          onCreateGroup={(selectedContactsGroup, groupName) => {
            handleCreateGroup(
              selectedContactsGroup.map((con) => con.id),
              groupName,
            );
          }}
        />
      </View>
    </BlurScreenContainer>
  );
};
