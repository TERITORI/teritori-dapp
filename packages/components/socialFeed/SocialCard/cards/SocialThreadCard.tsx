import React, { memo, useEffect, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Post } from "../../../../api/feed/v1/feed";
import { useNSUserInfo } from "../../../../hooks/useNSUserInfo";
import { useSelectedNetworkInfo } from "../../../../hooks/useSelectedNetwork";
import { getNetworkObjectId, parseUserId } from "../../../../networks";
import { OnPressReplyType } from "../../../../screens/FeedPostView/FeedPostViewScreen";
import { useAppNavigation } from "../../../../utils/navigation";
import {
  neutral00,
  neutral17,
  neutral33,
  withAlpha,
} from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";
import FlexRow from "../../../FlexRow";
import { CustomPressable } from "../../../buttons/CustomPressable";
import { SpacerColumn } from "../../../spacer";
import { PostCategory } from "../../NewsFeed/NewsFeed.type";
import { SocialThreadGovernance } from "../../SocialActions/SocialThreadGovernance";
import { FlaggedCardFooter } from "../FlaggedCardFooter";
import { MusicPostTrackContent } from "../MusicPostTrackContent";
import { SocialCardFooter } from "../SocialCardFooter";
import { SocialCardHeader } from "../SocialCardHeader";
import { SocialCardWrapper } from "../SocialCardWrapper";
import { SocialMessageContent } from "../SocialMessageContent";

export const SOCIAl_CARD_BORDER_RADIUS = 12;

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
    const selectedNetworkInfo = useSelectedNetworkInfo();
    const selectedNetworkId = selectedNetworkInfo?.id || "";
    const authorNSInfo = useNSUserInfo(localPost.authorId);
    const [, authorAddress] = parseUserId(localPost.authorId);
    const navigation = useAppNavigation();
    const username = authorNSInfo?.metadata?.tokenId || authorAddress;

    const handleReply = () =>
      onPressReply?.({
        username,
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
              id: getNetworkObjectId(selectedNetworkId, localPost.identifier),
            })
          }
          style={[
            {
              borderWidth: isPostConsultation ? 4 : 1,
              borderColor: isPostConsultation
                ? withAlpha(neutral33, 0.5)
                : neutral33,
              borderRadius: SOCIAl_CARD_BORDER_RADIUS,
              paddingVertical: layout.spacing_x2,
              paddingHorizontal: layout.spacing_x2_5,
              backgroundColor: neutral00,
            },
            style,
          ]}
        >
          {/*====== Card Header */}
          <SocialCardHeader
            authorAddress={authorAddress}
            authorId={localPost.authorId}
            createdAt={post.createdAt}
            authorMetadata={authorNSInfo?.metadata}
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
