import React, { memo, useEffect, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";

import FlexRow from "../../../FlexRow";
import { CustomPressable } from "../../../buttons/CustomPressable";
import { SpacerColumn } from "../../../spacer";
import { SocialThreadGovernance } from "../../SocialActions/SocialThreadGovernance";
import { FlaggedCardFooter } from "../FlaggedCardFooter";
import { MusicPostTrackContent } from "../MusicPostTrackContent";
import { SocialCardFooter } from "../SocialCardFooter";
import { SocialCardHeader } from "../SocialCardHeader";
import { SocialCardWrapper } from "../SocialCardWrapper";
import { SocialMessageContent } from "../SocialMessageContent";

import { Post } from "@/api/feed/v1/feed";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { zodTryParseJSON } from "@/utils/sanitize";
import { SOCIAl_CARD_BORDER_RADIUS } from "@/utils/social-feed";
import {
  neutral00,
  neutral17,
  neutral33,
  withAlpha,
} from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import {
  OnPressReplyType,
  PostCategory,
  ZodSocialFeedPostMetadata,
} from "@/utils/types/feed";

export const SocialThreadCard: React.FC<{
  post: Post;
  style?: StyleProp<ViewStyle>;
  isPostConsultation?: boolean;
  onPressReply?: OnPressReplyType;
  isGovernance?: boolean;
  isPreview?: boolean;
  isFlagged?: boolean;
  refetchFeed?: () => Promise<any>;
}> = memo(
  ({
    post,
    style,
    isPostConsultation,
    onPressReply,
    isGovernance,
    isPreview,
    isFlagged,
    refetchFeed,
  }) => {
    const [localPost, setLocalPost] = useState<Post>(post);
    const [viewWidth, setViewWidth] = useState(0);
    const authorNSInfo = useNSUserInfo(localPost.authorId);
    const [, authorAddress] = parseUserId(localPost.authorId);
    const navigation = useAppNavigation();
    const replyTo = authorNSInfo?.metadata?.tokenId || authorAddress;
    const postMetadata = zodTryParseJSON(
      ZodSocialFeedPostMetadata,
      post.metadata,
    );

    const handleReply = () =>
      onPressReply?.({
        username: replyTo, // todo: refacto handler to use userId
      });

    useEffect(() => {
      setLocalPost(post);
    }, [post]);

    return (
      <SocialCardWrapper
        post={localPost}
        isFlagged={isFlagged}
        refetchFeed={refetchFeed}
      >
        <CustomPressable
          onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
          disabled={isPostConsultation}
          onPress={() =>
            navigation.navigate("FeedPostView", {
              id: localPost.id,
            })
          }
          style={[
            {
              borderWidth: isPostConsultation ? 4 : 1,
              borderColor: withAlpha(neutral33, 0.5),
              borderRadius: SOCIAl_CARD_BORDER_RADIUS,
              paddingVertical: layout.spacing_x2,
              paddingHorizontal: layout.spacing_x2_5,
              backgroundColor: neutral00,
              width: "100%",
              flex: 1,
            },
            style,
          ]}
        >
          {/*====== Card Header */}
          <SocialCardHeader
            authorId={localPost.authorId}
            createdAt={post.createdAt}
            postWithLocationId={postMetadata?.location && localPost.id}
          />

          <SpacerColumn size={1.5} />

          {/*====== Card Content */}
          {post.category === PostCategory.MusicAudio ? (
            <MusicPostTrackContent post={localPost} />
          ) : (
            <SocialMessageContent post={localPost} isPreview={isPreview} />
          )}
          <SpacerColumn size={1.5} />

          {/*====== Card Actions */}
          {isGovernance ? (
            <FlexRow justifyContent="flex-end" style={{ height: 48 }}>
              <SocialThreadGovernance
                squaresBackgroundColor={
                  isPostConsultation ? neutral17 : neutral00
                }
              />
            </FlexRow>
          ) : isFlagged ? (
            <FlaggedCardFooter post={localPost} />
          ) : (
            <SocialCardFooter
              cardWidth={viewWidth}
              isPostConsultation={isPostConsultation}
              post={localPost}
              handleReply={handleReply}
              refetchFeed={refetchFeed}
              setPost={setLocalPost}
            />
          )}
        </CustomPressable>
      </SocialCardWrapper>
    );
  },
);
