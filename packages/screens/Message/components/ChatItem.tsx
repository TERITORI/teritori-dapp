import moment from "moment";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { selectLastMessageByGroupPk } from "../../../store/slices/message";
import { useAppNavigation } from "../../../utils/navigation";
import {
  neutral00,
  neutral22,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium10,
  fontSemibold11,
  fontSemibold13,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Conversation } from "../../../utils/types/message";
interface ChatItemProps {
  data: Conversation;
  onPress: () => void;
  isActive: boolean;
}

export const ChatItem = ({ data, onPress, isActive }: ChatItemProps) => {
  const navigation = useAppNavigation();
  const lastMessage = useSelector(selectLastMessageByGroupPk(data.id));
  const contactInfo = data.members?.[0];

  return (
    <TouchableOpacity
      onPress={() =>
        ["android", "ios"].includes(Platform.OS)
          ? navigation.navigate("ChatSection")
          : onPress()
      }
    >
      <View
        style={{
          backgroundColor: isActive ? neutral22 : neutral00,
          padding: layout.padding_x1,
          borderRadius: 4,
        }}
      >
        <FlexRow justifyContent="space-between">
          <View>
            <FlexRow>
              <Avatar.Image size={40} source={contactInfo?.avatar || ""} />
              <SpacerRow size={1.5} />
              <View>
                <FlexRow>
                  <BrandText
                    style={[fontSemibold13, { color: secondaryColor }]}
                  >
                    {contactInfo?.name || "Anon"}
                  </BrandText>
                </FlexRow>
                <SpacerColumn size={0.5} />
                <BrandText
                  numberOfLines={1}
                  style={[fontSemibold11, { color: neutralA3, maxWidth: 100 }]}
                >
                  {lastMessage?.payload?.message}
                </BrandText>
              </View>
            </FlexRow>
          </View>
          {!!lastMessage && (
            <View>
              <FlexRow>
                <BrandText style={[fontMedium10, { color: secondaryColor }]}>
                  {moment(lastMessage?.timestamp).fromNow()}
                </BrandText>
              </FlexRow>
            </View>
          )}
        </FlexRow>
      </View>
    </TouchableOpacity>
  );
};
