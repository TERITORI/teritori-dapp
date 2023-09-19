import React, { FC, useMemo } from "react";
import { TextStyle, View } from "react-native";

import { CommentInfo } from "../../api/video/v1/video";
import { BrandText } from "../../components/BrandText";
import { UserAvatarWithFrame } from "../../components/images/AvatarWithFrame";
import { DateTime } from "../../components/socialFeed/SocialThread/DateTime";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { parseUserId } from "../../networks";
import { neutral77 } from "../../utils/style/colors";
import { fontMedium14, fontSemibold13 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { tinyAddress } from "../../utils/text";

export const VideoComment: FC<{
  comment: CommentInfo;
}> = ({ comment }) => {
  const authorNSInfo = useNSUserInfo(comment.createdBy);
  const [, userAddr] = parseUserId(comment.createdBy);
  const username = useMemo(() => {
    return authorNSInfo?.metadata?.tokenId
      ? authorNSInfo?.metadata?.tokenId
      : tinyAddress(userAddr);
  }, [authorNSInfo, userAddr]);

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <UserAvatarWithFrame
          style={{
            marginRight: layout.spacing_x2,
          }}
          userId={comment.createdBy}
          size="S"
        />
        <BrandText style={blueContentsStyle}>{username}</BrandText>
        <BrandText style={contentDateStyle}>
          <DateTime
            date={new Date(comment.createdAt * 1000).toISOString()}
            textStyle={{ color: neutral77 }}
          />
        </BrandText>
      </View>
      <BrandText style={commentContentStyle}>{comment.comment}</BrandText>
    </View>
  );
};

const contentDateStyle: TextStyle = {
  ...fontMedium14,

  color: neutral77,
  marginLeft: "0.5em",
};
const blueContentsStyle: TextStyle = {
  ...fontSemibold13,
  color: "#16BBFF",
};
const commentContentStyle: TextStyle = {
  marginTop: "0.5em",
  display: "flex",
  flexDirection: "row",
  marginLeft: "40px",
  fontSize: 13,
  // gap: "0.6em",
};
