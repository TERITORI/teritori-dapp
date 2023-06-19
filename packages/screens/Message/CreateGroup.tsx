import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";

import { CheckboxGroup } from "./MessengerHomeCreateChatDropdown/CheckboxGroup";
import avatar from "../../../assets/icons/avatar.svg";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { Separator } from "../../components/Separator";
import { SeparatorGradient } from "../../components/SeparatorGradient";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import ModalBase from "../../components/modals/ModalBase";
import { SearchInput } from "../../components/sorts/SearchInput";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { selectConversationList } from "../../store/slices/message";
import {
  neutral00,
  neutral17,
  neutral33,
  primaryTextColor,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import {
  Group,
  GroupInfo,
  GroupInfo_Reply,
  MultiMemberGroupCreate_Reply,
} from "../../weshnet";
import { weshClient } from "../../weshnet/client";
import { activateGroup } from "../../weshnet/client/services";
import { encodeJSON, stringFromBytes } from "../../weshnet/client/utils";

interface CreateGroupProps {
  onClose: () => void;
}

export const CreateGroup = ({ onClose }: CreateGroupProps) => {
  const [groupName, setGroupName] = useState("");
  const [checkedContacts, setCheckedContacts] = useState([]);
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [loading, setLoading] = useState(false);
  const conversations = useSelector(selectConversationList);
  const handleChange = (items: CheckboxItem[]) => {
    setCheckedContacts(
      items.filter((item) => item.checked).map((item) => item.contactPk)
    );
  };

  const items = useMemo(() => {
    return conversations
      .filter((conv) => conv.type === "contact")
      .map((item) => {
        const contactPk = item?.members?.[0].id;

        return {
          name: "Anon",
          contactPk,
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
      const group = await weshClient().MultiMemberGroupCreate({});

      await activateGroup({
        groupPk: group.groupPk,
      });

      await Promise.all(
        conversations
          .filter((item) => checkedContacts.includes(item.members[0].id))
          .map(async (item) => {
            const contactPk = item.members[0].id;
            const _group = await weshClient().GroupInfo({
              contactPk,
            });

            await weshClient().AppMessageSend({
              groupPk: _group.group?.publicKey,
              payload: encodeJSON({
                name: groupName,
                group: GroupInfo_Reply.toJSON(_group),
                createdAt: new Date().toISOString(),
                type: "group-invitation",
                message: `Anon has invited you to join group ${groupName}`,
              }),
            });
          })
      );

      onClose();
    } catch (err) {
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
          width={Platform.OS == "web" ? 370 : 305}
        />
      </FlexRow>

      <SpacerColumn size={2} />

      <SearchInput borderRadius={12} />
      <SpacerColumn size={2} />
      <View style={{ maxHeight: 200 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CheckboxGroup items={items} onChange={handleChange} />
        </ScrollView>
      </View>

      <Separator color={neutral33} />
      <SpacerColumn size={2} />

      <PrimaryButton
        text="Create group"
        onPress={handleCreateGroup}
        fullWidth
      />

      <SpacerColumn size={2} />
    </ModalBase>
  );
};
