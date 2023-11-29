import moment from "moment";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { MessageAvatar } from "./MessageAvatar";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useIsMobile } from "../../../hooks/useIsMobile";
import {
  selectConversationById,
  selectLastContactMessageByGroupPk,
  selectLastMessageByGroupPk,
} from "../../../store/slices/message";
import { RootState } from "../../../store/store";
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
import { getConversationName } from "../../../weshnet/messageHelpers";
interface ChatItemProps {
  data: Conversation;
  onPress: () => void;
  isActive: boolean;
  isLastItem: boolean;
}

export const ChatItem = ({
  data,
  onPress,
  isActive,
  isLastItem,
}: ChatItemProps) => {
  const isMobile = useIsMobile();
  const lastMessage = useSelector((state: RootState) =>
    selectLastMessageByGroupPk(state, data.id),
  );
  const lastContactMessage = useSelector((state: RootState) =>
    selectLastContactMessageByGroupPk(state, data.id),
  );
  const contactInfo = data.members?.[0];
  const conversation = useSelector((state: RootState) =>
    selectConversationById(state, data.id),
  );

  const isAllMessageRead = useMemo(() => {
    return lastContactMessage?.id === conversation?.lastReadIdByMe;
  }, [conversation?.lastReadIdByMe, lastContactMessage?.id]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{
        backgroundColor: isActive && isMobile ? neutral00 : neutral22,
        padding: layout.spacing_x1,
        borderRadius: 4,
        borderBottomWidth: isMobile && !isLastItem ? 1 : 0,
        borderBottomColor: neutral22,
        width: "100%",
      }}
      onPress={onPress}
    >
      {!isAllMessageRead && (
        <View
          style={{
            backgroundColor: "white",
            width: 2,
            position: "absolute",
            left: 0,
            top: 20,
            bottom: 20,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}
        />
      )}
      <FlexRow justifyContent="space-between">
        <View>
          <FlexRow>
            <MessageAvatar
              item={contactInfo}
              disableStatus={data.type === "group"}
            />
            <SpacerRow size={1.5} />
            <View>
              <FlexRow>
                <BrandText
                  style={[
                    fontSemibold13,
                    { color: isAllMessageRead ? secondaryColor : "white" },
                  ]}
                >
                  {getConversationName(data)}
                </BrandText>
              </FlexRow>
              <SpacerColumn size={0.5} />
              <BrandText
                numberOfLines={1}
                style={[
                  fontSemibold11,
                  {
                    color: isAllMessageRead ? neutralA3 : "white",
                    maxWidth: 100,
                  },
                ]}
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
    </TouchableOpacity>
  );
};
