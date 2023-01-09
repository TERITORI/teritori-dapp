import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import replySVG from "../../assets/icons/reply.svg";
import messageSVG from "../../assets/icons/social-threads/message.svg";
import tipSVG from "../../assets/icons/tip.svg";
import { PostResult } from "../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { neutral33, secondaryColor } from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { SVG } from "./SVG";
import { SocialStat } from "./SocialStat";
import { SpacerRow } from "./spacer";

const SectionDivider = () => (
  <View style={styles.sectionDivider}>
    <View style={styles.separator} />
  </View>
);

interface SocialReactionActionsProps {
  reactions: PostResult["reactions"];
  statStyle?: ViewStyle;
  isComment?: boolean;
  commentCount?: number;
  onPressReply?: () => void;
  onPressTip?: () => void;
  onPressReaction: (icon: string) => void;
}

export const SocialReactionActions: React.FC<SocialReactionActionsProps> = ({
  reactions,
  statStyle,
  isComment,
  commentCount,
  onPressReply,
  onPressTip,
  onPressReaction,
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
          <SectionDivider />
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
          <SectionDivider />
        </>
      )}

      <Pressable style={[styles.rowCenter, { zIndex: 9 }]} onPress={onPressTip}>
        <SVG source={tipSVG} width={20} height={20} />
        <SpacerRow size={1.5} />
        <BrandText style={fontSemibold14}>Tip</BrandText>
      </Pressable>
      <SectionDivider />
      {reactions.map((reaction, index) => (
        <React.Fragment key={index}>
          <SocialStat
            label={String(reaction.count)}
            emoji={reaction.icon}
            style={statStyle}
            onPress={() => onPressReaction(reaction.icon)}
          />
          <SpacerRow size={1} />
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  rowCenter: { flexDirection: "row", alignItems: "center" },
  sectionDivider: {
    paddingHorizontal: layout.padding_x2,
  },
  separator: { height: 18, width: 1, backgroundColor: neutral33 },
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
