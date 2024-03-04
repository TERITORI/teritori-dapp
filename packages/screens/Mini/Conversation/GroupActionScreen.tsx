import React, { useState } from "react";
import { FlatList, View, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

import LeaveGroupModal from "./components/LeaveGroupModal";
import CustomAppBar from "../components/AppBar/CustomAppBar";
import { CustomButton } from "../components/Button/CustomButton";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { Avatar } from "@/screens/Message/components/Avatar";
import {
  selectContactInfo,
  selectConversationById,
} from "@/store/slices/message";
import { RootState } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { fontMedium16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { weshClient, weshConfig } from "@/weshnet";
import { getConversationName } from "@/weshnet/messageHelpers";
import { sendMessage } from "@/weshnet/services";
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
            padding: layout.spacing_x1,
            width: windowWidth,
            gap: layout.spacing_x1_5,
          }}
        >
          <FlatList
            data={conversation?.members}
            renderItem={({ item: member, index }) => {
              return (
                <View
                  key={member.tokenId}
                  style={{
                    flexDirection: "row",
                    gap: layout.spacing_x1_25,
                    alignItems: "center",
                  }}
                >
                  <Avatar size={20} source={member.avatar} />
                  <BrandText style={[fontMedium16]}>{member.name}</BrandText>
                </View>
              );
            }}
            keyExtractor={(member) => member.id}
            contentContainerStyle={{
              gap: layout.spacing_x1,
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
