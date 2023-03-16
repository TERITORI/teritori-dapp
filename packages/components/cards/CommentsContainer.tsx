import React from "react";
import { StyleSheet, View } from "react-native";

import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { neutral22 } from "../../utils/style/colors";
import {
  SocialCommentCard,
  SocialCommentCardProps,
} from "../socialFeed/SocialThread/SocialCommentCard";
import { SpacerColumn } from "../spacer";

interface CommentsContainerProps
  extends Omit<SocialCommentCardProps, "comment" | "isLast"> {
  comments: PostResult[];
}

export const CommentsContainer: React.FC<CommentsContainerProps> = ({
  comments,
  ...restProps
}) => {
  if (!comments?.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.conversationLine} />

      <View style={{ flex: 1 }}>
        {comments.map((comment, index) => (
          <React.Fragment key={index}>
            <SpacerColumn size={3} />
            <SocialCommentCard
              comment={comment}
              isLast={comments?.length === index + 1}
              {...restProps}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 60,
    flexDirection: "row",
  },
  conversationLine: {
    height: "100%",
    width: 1,
    backgroundColor: neutral22,
  },
});
