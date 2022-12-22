import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { neutral22 } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { SocialCommentCard } from "./SocialCommentCard";

const CommentContainer: React.FC<{
  comment: PostResult;
  isLast?: boolean;
}> = ({ comment, isLast }) => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: isLast ? 0 : 37,
      }}
    >
      <View
        style={{
          width: 60,
          height: 50,
          marginBottom: 50,
          borderLeftWidth: 2,
          borderBottomWidth: 2,
          borderBottomLeftRadius: 30,
          borderColor: neutral22,
        }}
      />
      <SocialCommentCard comment={comment} />
    </View>
  );
};

export const CommentsContainer: React.FC<{
  comments: PostResult[];
  style?: StyleProp<ViewStyle>;
}> = ({ comments }) => {
  if (!comments?.length) {
    return null;
  }
  return (
    <View
      style={{
        flexDirection: "row",
        paddingTop: 68,
        paddingLeft: layout.padding_x2_5,
        width: "100%",
        position: "relative",
      }}
    >
      <View
        style={{
          width: 1,
          backgroundColor: neutral22,
          position: "absolute",
          left: 20,
          top: 0,
          bottom: 80,
        }}
      />
      <View
        style={{
          flex: 1,
          paddingBottom: layout.contentPadding,
        }}
      >
        {comments.map((comment, index) => (
          <CommentContainer
            key={index}
            comment={comment}
            isLast={comments.length === index + 1}
          />
        ))}
      </View>
    </View>
  );
};
