import React, { useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

import LeaveGroupModal from "./components/LeaveGroupModal";
import CustomAppBar from "../components/AppBar/CustomAppBar";

import groupSVG from "@/assets/icons/users-group-white.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { CustomButton } from "@/components/buttons/CustomButton";
import { Separator } from "@/components/separators/Separator";
import { SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import Clipboard from "@/modules/Clipboard";
import { Avatar } from "@/screens/Message/components/Avatar";
import {
  selectContactInfo,
  selectConversationById,
  selectConversationList,
} from "@/store/slices/message";
import { RootState } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import {
  fontMedium10,
  fontMedium15,
  fontSemibold16,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { Contact } from "@/utils/types/message";
import { weshClient, weshConfig, weshServices } from "@/weshnet";
import { getConversationName } from "@/weshnet/messageHelpers";
import {
  createMultiMemberShareableLink,
  createSharableLinkOfFriends,
  sendMessage,
} from "@/weshnet/services";
import { bytesFromString, stringFromBytes } from "@/weshnet/utils";

const GroupActionScreen: ScreenFC<"MiniGroupActions"> = ({
  navigation,
  route,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const { conversationId } = route.params;
  const conversation = useSelector((state: RootState) =>
    selectConversationById(state, conversationId),
  );
  const conversationList = useSelector(selectConversationList);

  const friendMembers = conversationList
    .filter((member) => member.type === "contact")
    .map((fm) => (fm?.members?.length > 0 ? fm?.members[0].id : ""));

  const contactInfo = useSelector(selectContactInfo);
  const [showLeaveGroupConfirmation, setShowLeaveGroupConfirmation] =
    useState(false);

  const { setToast } = useFeedbacks();

  const groupName = conversation && getConversationName(conversation);
  const handleLeaveGroupPress = async () => {
    if (conversation?.id) {
      try {
        await weshClient.client.MultiMemberGroupLeave({
          groupPk: bytesFromString(conversation.id),
        });
        await sendGroupLeaveMessage();
        setToast({
          mode: "mini",
          message: `You left group ${groupName}`,
          duration: 5000,
          type: "success",
        });
      } catch (error: any) {
        console.error(error.message);
        setToast({
          mode: "mini",
          message: "Unable to leave group.",
          duration: 5000,
          type: "error",
        });
        setShowLeaveGroupConfirmation(false);
      }
    }
  };

  const sendGroupLeaveMessage = async () => {
    try {
      if (conversation?.id) {
        await sendMessage({
          groupPk: bytesFromString(conversation.id),
          message: {
            type: "group-leave",
            payload: {
              message: contactInfo.name + " left group.",
              files: [],
              metadata: {
                contact: {
                  id: stringFromBytes(weshConfig.config?.accountPk),
                },
              },
            },
          },
        });
        navigation.navigate("MiniTabs", { screen: "MiniChats" });
      }
    } catch (error) {
      console.error("Sending Group Message:", error);
    }
  };

  const handleAddContact = async (link: string) => {
    try {
      await weshServices.addContact(link, contactInfo);
      setToast({
        mode: "mini",
        type: "success",
        message: "Request sent successfully.",
        duration: 3000,
      });
    } catch (err: any) {
      console.log(err);
      setToast({
        mode: "mini",
        type: "success",
        message: "Failed to sent request.",
        duration: 3000,
      });
    }
  };

  const handleAddMembers = async (member: Contact) => {
    const friendShareableLink = createSharableLinkOfFriends({
      accountPk: member?.id,
      peerId: member?.peerId,
      publicRendezvousSeed: member?.rdvSeed,
      avatar: member?.avatar,
      name: member?.name,
    });
    await handleAddContact(friendShareableLink);
  };
  const copyGroupLink = async () => {
    if (!conversation?.id) {
      return;
    }
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
    setToast({
      mode: "mini",
      type: "success",
      message: "Group link copied!",
      duration: 2000,
    });
  };

  return (
    <>
      <ScreenContainer
        headerChildren={<></>}
        responsive
        fullWidth
        footerChildren={<></>}
        noScroll
        headerMini={<CustomAppBar backEnabled title={groupName} />}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            paddingHorizontal: layout.spacing_x2_5,
            width: windowWidth,
            gap: layout.spacing_x1_5,
            paddingVertical: layout.spacing_x2_5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: layout.spacing_x1_25,
            }}
          >
            <SVG source={groupSVG} height={24} width={24} />
            <BrandText style={[fontSemibold16]}>Group Members</BrandText>
          </View>
          <Separator />
          <FlatList
            data={conversation?.members}
            renderItem={({ item: member, index }) => {
              const isMe =
                member?.id === stringFromBytes(weshConfig.config?.accountPk);

              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: layout.spacing_x1_25,
                      alignItems: "center",
                    }}
                  >
                    <Avatar size={32} source={member?.avatar} />
                    <BrandText style={[fontMedium15]}>{member?.name}</BrandText>
                    {member?.hasLeft ? (
                      <BrandText style={[fontMedium10, { color: neutral77 }]}>
                        Left Group
                      </BrandText>
                    ) : null}
                  </View>
                  {isMe && <BrandText>You</BrandText>}
                  {!friendMembers.includes(member?.id) && !isMe && (
                    <CustomButton
                      onPress={() => handleAddMembers(member)}
                      title="Add"
                      type="outline"
                      size="small"
                      width={80}
                    />
                  )}
                </View>
              );
            }}
            keyExtractor={(member) => member?.id}
            contentContainerStyle={{
              gap: layout.spacing_x2,
              flex: 1,
            }}
          />
          <CustomButton
            type="outline"
            title="Copy Group Link"
            onPress={copyGroupLink}
          />
          <SpacerRow size={1} />
          <CustomButton
            type="danger"
            title="Leave Group"
            onPress={() => setShowLeaveGroupConfirmation(true)}
          />
        </View>
        <LeaveGroupModal
          open={showLeaveGroupConfirmation}
          onClose={() => setShowLeaveGroupConfirmation(false)}
          onYes={handleLeaveGroupPress}
        />
      </ScreenContainer>
    </>
  );
};

export default GroupActionScreen;
