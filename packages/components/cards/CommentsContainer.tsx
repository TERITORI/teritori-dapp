import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { CommentsContainerProps } from "./comments-props";
import { SocialCommentCard } from "../socialFeed/SocialCard/cards/SocialCommentCard";
import { SpacerColumn } from "../spacer";

import { useIsMobile } from "@/hooks/useIsMobile";
import { LINES_HORIZONTAL_SPACE } from "@/utils/social-feed";
import { neutral22 } from "@/utils/style/colors";
import { RESPONSIVE_BREAKPOINT_S } from "@/utils/style/layout";

export const CommentsContainer: React.FC<CommentsContainerProps> = ({
  comments,
  ...restProps
}) => {
  const isMobile = useIsMobile();
  const { width: windowWidth } = useWindowDimensions();

  if (!comments?.length) {
    return null;
  }
  return (
    <View
      style={[
        styles.container,
        { marginLeft: isMobile ? 0 : LINES_HORIZONTAL_SPACE },
      ]}
    >
      {!isMobile ? <View style={styles.conversationLine} /> : null}

      <View style={{ flex: 1, width: "100%" }}>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            {!isMobile || restProps.parentOffsetValue ? (
              <SpacerColumn size={2} />
            ) : null}
            <SocialCommentCard
              style={
                windowWidth < RESPONSIVE_BREAKPOINT_S && {
                  borderRadius: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                }
              }
              comment={comment}
              isLast={comments?.length === index + 1}
              CommentsContainer={CommentsContainer}
              {...restProps}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
  },
  conversationLine: {
    height: "100%",
    width: 1,
    backgroundColor: neutral22,
  },
});
