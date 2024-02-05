import { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import friendGraySVG from "../../../../../assets/icons/friend-gray.svg";
import { GroupInfo_Reply } from "../../../../api/weshnet/protocoltypes";
import { SpacerColumn } from "../../../../components/spacer";
import {
  selectContactInfo,
  selectConversationList,
} from "../../../../store/slices/message";
import {
  neutral33,
  neutralA3,
  withAlpha,
} from "../../../../utils/style/colors";
import { MOBILE_HEADER_HEIGHT, layout } from "../../../../utils/style/layout";
import { weshClient } from "../../../../weshnet";
import { subscribeMessages } from "../../../../weshnet/message/subscriber";
import { sendMessage } from "../../../../weshnet/services";
import { bytesFromString, stringFromBytes } from "../../../../weshnet/utils";
import { Spinner } from "../../Feed/components/Spinner";
import { CustomButton } from "../../components/Button/CustomButton";
import MiniTextInput from "../../components/MiniTextInput";
import MiniToast from "../../components/MiniToast";
import MobileModal from "../../components/MobileModal";
import TitleBar from "../../components/TitleBar";
import { ToastType } from "../MiniFriendScreen";

export default function GroupCreateModal({
  visible,
  onClose,
  checkedContacts,
}: {
  visible: boolean;
  onClose: () => void;
  checkedContacts: string[];
}) {
  const contactInfo = useSelector(selectContactInfo);
  const [groupName, setGroupName] = useState("");
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const conversations = useSelector(selectConversationList);
  const [openToast, setOpenToast] = useState<ToastType>({
    type: undefined,
    message: "",
  });

  const handleGroupCreate = async () => {
    if (!groupName) {
      return;
    }
    setCreateGroupLoading(true);
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
          }),
      );

      subscribeMessages(stringFromBytes(groupInfo.group?.publicKey));

      onClose();
    } catch (err: any) {
      console.error("create group err", err);
      setOpenToast({
        message: err?.message,
      });
    }
  };

  return (
    <MobileModal
      visible={visible}
      onClose={onClose}
      innerContainerOptions={{ height: "40%" }}
    >
      {openToast.type && (
        <>
          <MiniToast
            message={openToast.message}
            type={openToast.type ?? "info"}
            onClose={() => setOpenToast({ type: undefined, message: "" })}
            style={{ position: "absolute", top: -MOBILE_HEADER_HEIGHT }}
          />
          <SpacerColumn size={1.5} />
        </>
      )}
      <View
        style={{
          padding: layout.spacing_x2,
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}
      >
        {createGroupLoading ? (
          <View>
            <Spinner />
          </View>
        ) : (
          <>
            <TitleBar
              title="Create a Group"
              subTitle="Please enter the group name below"
              icon={friendGraySVG}
            />

            <View style={{ width: "100%" }}>
              <MiniTextInput
                placeholder="group name"
                style={{ backgroundColor: withAlpha(neutral33, 0.9) }}
                placeholderTextColor={neutralA3}
                value={groupName}
                onChangeText={setGroupName}
              />
              <SpacerColumn size={1.5} />
              <CustomButton onPress={handleGroupCreate} title="Create" />
            </View>
          </>
        )}
      </View>
    </MobileModal>
  );
}
