import React, { useMemo, useState } from "react";
import { View, ScrollView, Platform } from "react-native";
import { useSelector } from "react-redux";

import { CheckboxGroup, CheckboxItem } from "./CheckboxGroup";
import avatar from "../../../../assets/icons/avatar.svg";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import { SeparatorGradient } from "../../../components/SeparatorGradient";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { SearchInput } from "../../../components/sorts/SearchInput";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import {
  selectContactInfo,
  selectConversationList,
} from "../../../store/slices/message";
import {
  neutral00,
  neutral33,
  secondaryColor,
} from "../../../utils/style/colors";
import { GroupInfo_Reply } from "../../../weshnet";
import { weshClient } from "../../../weshnet/client";
import {
  getConversationAvatar,
  getConversationName,
} from "../../../weshnet/client/messageHelpers";
import { sendMessage } from "../../../weshnet/client/services";
import { subscribeMessages } from "../../../weshnet/client/subscribers";
import {
  bytesFromString,
  stringFromBytes,
} from "../../../weshnet/client/utils";

interface CreateGroupProps {
  onClose: () => void;
}

export const CreateGroup = ({ onClose }: CreateGroupProps) => {
  const [groupName, setGroupName] = useState("");
  const [checkedContacts, setCheckedContacts] = useState<string[]>([]);
  const contactInfo = useSelector(selectContactInfo);
  const { setToastError } = useFeedbacks();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const conversations = useSelector(selectConversationList());
  const handleChange = (items: CheckboxItem[]) => {
    setCheckedContacts(
      items.filter((item) => item.checked).map((item) => item.id)
    );
  };

  const items: CheckboxItem[] = useMemo(() => {
    return conversations
      .filter((conv) => conv.type === "contact")
      .map((item) => {
        const contactPk = item?.members?.[0].id;

        return {
          id: contactPk,
          name: getConversationName(item),
          avatar: getConversationAvatar(item),
          checked: checkedContacts.includes(contactPk),
        };
      });
  }, [conversations, checkedContacts]);

  const handleCreateGroup = async () => {
    if (!groupName) {
      return;
    }
    setLoading(true);
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
          .filter((item) => checkedContacts.includes(item?.members?.[0]?.id))
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
          })
      );

      subscribeMessages(stringFromBytes(groupInfo.group?.publicKey));

      onClose();
    } catch (err: any) {
      console.log("create group err", err);
      setToastError({
        title: "Group creation failed",
        message: err?.message,
      });
    }
  };

  return (
    <ModalBase
      label="Create a group chat"
      onClose={onClose}
      visible
      hideMainSeparator
      width={450}
    >
      <SeparatorGradient />

      <SpacerColumn size={2} />

      <FlexRow justifyContent="space-between">
        <SVG source={avatar} />

        <SpacerRow size={1} />

        <TextInputCustom
          name="Groupname"
          label="Group name"
          placeHolder="Group name"
          boxMainContainerStyle={{
            paddingVertical: 2,
          }}
          value={groupName}
          onChangeText={setGroupName}
          rules={{ required: true }}
          placeholderTextColor={secondaryColor}
          squaresBackgroundColor={neutral00}
          fullWidth
          width={Platform.OS === "web" ? 370 : 305}
        />
      </FlexRow>

      <SpacerColumn size={2} />

      <SearchInput borderRadius={12} handleChangeText={setSearchText} />
      <SpacerColumn size={2} />
      <View style={{ maxHeight: 200 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CheckboxGroup
            items={items}
            onChange={handleChange}
            searchText={searchText}
          />
        </ScrollView>
      </View>

      <Separator color={neutral33} />
      <SpacerColumn size={2} />

      <PrimaryButton
        isLoading={loading}
        text="Create group"
        onPress={handleCreateGroup}
        fullWidth
      />

      <SpacerColumn size={2} />
    </ModalBase>
  );
};
