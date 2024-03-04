import React from "react";
import { View, useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";

import CustomAppBar from "../components/AppBar/CustomAppBar";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { selectConversationById } from "@/store/slices/message";
import { RootState } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { layout } from "@/utils/style/layout";
import { getConversationName } from "@/weshnet/messageHelpers";
import { CustomButton } from "../components/Button/CustomButton";
import { Avatar } from "@/screens/Message/components/Avatar";

const GroupActionScreen: ScreenFC<"MiniGroupActions"> = ({
  navigation,
  route,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const { conversationId } = route.params;
  const conversation = useSelector((state: RootState) =>
    selectConversationById(state, conversationId),
  );

  const handleLeaveGroupPress = () => [];

  return (
    <ScreenContainer
      headerChildren={<></>}
      responsive
      fullWidth
      footerChildren={<></>}
      noScroll
      headerMini={
        <CustomAppBar
          backEnabled
          title={conversation && getConversationName(conversation)}
        />
      }
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
        <View>
          {conversation?.members?.map((member) => {
            return (
              <View
                key={member.tokenId}
                style={{
                  flexDirection: "row",
                  gap: layout.spacing_x1_25,
                  alignItems: "center",
                }}
              >
                <Avatar source={member.avatar} />
                <BrandText>{member.name}</BrandText>
              </View>
            );
          })}
        </View>
        <CustomButton
          type="danger"
          title="Leave Group"
          onPress={handleLeaveGroupPress}
        />
      </View>
    </ScreenContainer>
  );
};

export default GroupActionScreen;
