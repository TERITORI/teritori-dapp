import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { View, TouchableOpacity } from "react-native";

import copy from "../../../../assets/icons/copy.svg";
import reply from "../../../../assets/icons/reply.svg";
import { BrandText } from "../../../components/BrandText";
import FlexRow from "../../../components/FlexRow";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { neutralA3 } from "../../../utils/style/colors";
import { fontSemibold13 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

interface MessagePopupProps {
  message: string;
  onReply: () => void;
  onClose: () => void;
}

export const MessagePopup = ({
  onReply,
  message,
  onClose,
}: MessagePopupProps) => {
  const { setToastSuccess } = useFeedbacks();

  return (
    <View
      style={{
        backgroundColor: "rgba(41, 41, 41, 0.8)",
        paddingVertical: layout.spacing_x1,
        paddingHorizontal: layout.spacing_x2,
        borderRadius: layout.spacing_x2,
        width: 220,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          onReply();
          onClose();
        }}
      >
        <FlexRow>
          <SVG source={reply} height={16} width={16} color={neutralA3} />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            Reply
          </BrandText>
        </FlexRow>
      </TouchableOpacity>

      <SpacerColumn size={1} />

      <SpacerColumn size={1} />
      <Separator />
      <SpacerColumn size={1} />
      <TouchableOpacity
        onPress={() => {
          Clipboard.setString(message);
          setToastSuccess({
            title: "Copied",
            message: "",
          });
          onClose();
        }}
      >
        <FlexRow>
          <SVG source={copy} height={20} width={20} color={neutralA3} />
          <SpacerRow size={1} />
          <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
            Copy text
          </BrandText>
        </FlexRow>
      </TouchableOpacity>
      <SpacerColumn size={1} />
    </View>
  );
};
