import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import replySVG from "../../assets/icons/reply.svg";
import messageSVG from "../../assets/icons/social-threads/message.svg";
import tipSVG from "../../assets/icons/tip.svg";
import { neutral33, secondaryColor } from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { SocialStat } from "./SocialStat";
import { SpacerRow } from "./spacer";

const SectionDevider = () => (
  <View style={styles.sectionDevider}>
    <View style={styles.seperator} />
  </View>
);

interface SocialReactionActionsProps {
  statStyle?: ViewStyle;
  isComment?: boolean;
  commentCount?: number;
  onPressReply?: () => void;
}

export const SocialReactionActions: React.FC<SocialReactionActionsProps> = ({
  statStyle,
  isComment,
  commentCount,
  onPressReply,
}) => {
  return (
    <View style={styles.rowCenter}>
      {commentCount !== undefined && (
        <>
          <Pressable style={styles.rowCenter}>
            <SVG
              source={messageSVG}
              color={secondaryColor}
              width={20}
              height={20}
            />
            <SpacerRow size={1.5} />
            <BrandText style={fontSemibold14}>{commentCount}</BrandText>
          </Pressable>
          <SectionDevider />
        </>
      )}

      {isComment && (
        <>
          <Pressable style={styles.rowCenter} onPress={onPressReply}>
            <View style={styles.replyIconContainer}>
              <SVG
                source={replySVG}
                color={secondaryColor}
                width={12}
                height={12}
              />
            </View>
            <SpacerRow size={1.5} />
            <BrandText style={fontSemibold14}>Reply</BrandText>
          </Pressable>
          <SectionDevider />
        </>
      )}

      <Pressable style={styles.rowCenter}>
        <SVG source={tipSVG} width={20} height={20} />
        <SpacerRow size={1.5} />
        <BrandText style={fontSemibold14}>Tip</BrandText>
      </Pressable>
      <SectionDevider />

      <SocialStat label="4,2k" emoji="👍" style={statStyle} />
      <SpacerRow size={1} />

      <SocialStat label="4,2k" emoji="🔥" style={statStyle} />
      <SpacerRow size={1} />

      <SocialStat label="4,2k" emoji="👎" style={statStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  rowCenter: { flexDirection: "row", alignItems: "center" },
  sectionDevider: {
    paddingHorizontal: layout.padding_x2,
  },
  seperator: { height: 18, width: 1, backgroundColor: neutral33 },
  replyIconContainer: {
    borderWidth: 1.2,
    borderColor: secondaryColor,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
