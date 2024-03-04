import React, { useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

import LeaveGroupModal from "./components/LeaveGroupModal";
import CustomAppBar from "../components/AppBar/CustomAppBar";
import { CustomButton } from "../components/Button/CustomButton";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Separator } from "@/components/separators/Separator";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { Avatar } from "@/screens/Message/components/Avatar";
import {
  selectContactInfo,
  selectConversationById,
  selectConversationList,
} from "@/store/slices/message";
import { RootState } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { fontMedium16, fontSemibold18 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { Contact } from "@/utils/types/message";
import { weshClient, weshConfig, weshServices } from "@/weshnet";
import { getConversationName } from "@/weshnet/messageHelpers";
import { createSharableLinkOfFriends, sendMessage } from "@/weshnet/services";
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
    .map((fm) => fm.id);
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
        if (error.code !== 14) {
          setToast({
            mode: "mini",
            message: "Unable to leave group.",
            duration: 5000,
            type: "error",
          });
          setShowLeaveGroupConfirmation(false);
        } else {
          await sendGroupLeaveMessage();
        }
      }
    }
  };

  const sendGroupLeaveMessage = async () => {
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
      accountPk: member.id,
      peerId: member.peerId,
      publicRendezvousSeed: member.rdvSeed,
      avatar: member.avatar,
      name: member.name,
    });
    await handleAddContact(friendShareableLink);
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
          }}
        >
          <BrandText style={[fontSemibold18]}>Group members</BrandText>
          <Separator />
          <FlatList
            data={conversation?.members}
            renderItem={({ item: member, index }) => {
              const isMe =
                member.id === stringFromBytes(weshConfig.config?.accountPk);

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
                    <Avatar size={32} source={member.avatar} />
                    <BrandText style={[fontMedium16]}>{member.name}</BrandText>
                  </View>
                  {!friendMembers.includes(member.id) && !isMe && (
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
            keyExtractor={(member) => member.id}
            contentContainerStyle={{
              gap: layout.spacing_x2,
              flex: 1,
            }}
          />

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
