import React from "react";
import { ScrollView, View } from "react-native";

import doubleCheckSVG from "../../../../assets/icons/double-check-white.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import {
  blueDefault,
  neutral22,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium10, fontNormal15 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

type ConversationType = {
  id: string;
  date: string;
  message: string;
  isMyMessage: boolean;
  status: string;
};

type Props = {
  conversations: ConversationType[];
  isTyping: boolean;
};

export const Conversations = ({ isTyping, conversations }: Props) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      {conversations.map((conversation) => (
        <SingleConversation {...conversation} key={conversation.id} />
      ))}
      {isTyping && (
        <View
          style={{
            borderRadius: 32,
            backgroundColor: neutral22,
            width: "auto",
            paddingHorizontal: 8,
            paddingVertical: 6,
            alignSelf: "flex-start",
            marginTop: layout.spacing_x1_5,
          }}
        >
          <BrandText
            style={[
              fontNormal15,
              {
                color: neutralA3,
                width: "auto",
              },
            ]}
          >
            Typing...
          </BrandText>
        </View>
      )}
    </ScrollView>
  );
};

const SingleConversation = ({
  date,
  isMyMessage,
  message,
  status,
}: ConversationType) => {
  return (
    <View
      style={{
        borderTopStartRadius: isMyMessage ? 10 : 2,
        borderBottomStartRadius: isMyMessage ? 10 : 2,
        borderTopEndRadius: isMyMessage ? 2 : 10,
        borderBottomEndRadius: isMyMessage ? 2 : 10,
        backgroundColor: blueDefault,
        paddingHorizontal: 8,
        paddingVertical: 6,
        minWidth: "auto",
        alignSelf: isMyMessage ? "flex-end" : "flex-start",
        marginBottom: layout.spacing_x0_5,
        maxWidth: "90%",
      }}
    >
      <BrandText
        style={[
          fontNormal15,
          {
            color: secondaryColor,
            width: "auto",
            paddingRight: 38,
          },
        ]}
      >
        {message}
      </BrandText>
      <View
        style={{
          flexDirection: "row",
          gap: layout.spacing_x0_25,
          alignSelf: "flex-end",
        }}
      >
        <BrandText
          style={[
            fontMedium10,
            {
              color: secondaryColor,
              width: "auto",
              margin: layout.spacing_x0_25,
            },
          ]}
        >
          {date}
        </BrandText>
        <SVG source={doubleCheckSVG} height={16} width={16} />
      </View>
    </View>
  );
};
