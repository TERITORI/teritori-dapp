import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { Post } from "../../../../../api/feed/v1/feed";
import { ScreenContainer } from "../../../../../components/ScreenContainer";
import {
  PostCategory,
  ReplyToType,
} from "../../../../../components/socialFeed/NewsFeed/NewsFeed.type";
import {
  NewsFeedInput,
  NewsFeedInputHandle,
} from "../../../../../components/socialFeed/NewsFeed/NewsFeedInput";
import { SocialThreadCard } from "../../../../../components/socialFeed/SocialCard/cards/SocialThreadCard";
import { useNSUserInfo } from "../../../../../hooks/useNSUserInfo";
import { parseUserId } from "../../../../../networks";
import { useAppNavigation } from "../../../../../utils/navigation";
import { BASE_POST, DEFAULT_USERNAME } from "../../../../../utils/social-feed";
import { tinyAddress } from "../../../../../utils/text";
import { OnPressReplyType } from "../../../../FeedPostView/FeedPostViewScreen";
import CustomAppBar from "../../../components/AppBar/CustomAppBar";

type Props = {
  networkId: string;
  post: Post;
  refetchPost: () => Promise<any>;
  isLoading?: boolean;
};

const MiniDefaultPostDetails = ({
  networkId,
  post,
  refetchPost,
  isLoading,
}: Props) => {
  const navigation = useAppNavigation();

  const { width: windowWidth } = useWindowDimensions();

  const aref = useAnimatedRef<Animated.ScrollView>();

  const [localPost, setLocalPost] = useState(post || BASE_POST);
  const [replyTo, setReplyTo] = useState<ReplyToType>();

  const postId = post.identifier;

  useEffect(() => {
    if (post?.category === PostCategory.Video)
      navigation.replace("MiniFeedDetails", {
        id: postId,
      });
  }, [post?.category, postId, navigation]);

  useEffect(() => {
    if (post) {
      setLocalPost(post);
    }
  }, [post]);

  const authorId = post?.authorId;
  const authorNSInfo = useNSUserInfo(authorId);

  const [, authorAddress] = parseUserId(post?.authorId);
  const feedInputRef = useRef<NewsFeedInputHandle>(null);

  const headerLabel = useMemo(() => {
    const authorDisplayName =
      authorNSInfo?.metadata?.tokenId ||
      tinyAddress(authorAddress) ||
      DEFAULT_USERNAME;

    if (post?.parentPostIdentifier) {
      return `Comment by ${authorDisplayName}`;
    }

    if (post.category === PostCategory.MusicAudio) {
      return `Track by ${authorDisplayName}`;
    }

    return `Post by ${authorDisplayName}`;
  }, [post, authorNSInfo?.metadata?.tokenId, authorAddress]);

  const onPressReply: OnPressReplyType = (data) => {
    feedInputRef.current?.resetForm();
    setReplyTo(data);
    feedInputRef.current?.setValue(`@${data.username} `);
    feedInputRef.current?.focusInput();
  };
  return (
    <ScreenContainer
      forceNetworkId={networkId}
      fullWidth
      responsive
      noMargin
      footerChildren
      noScroll
      headerMini={<CustomAppBar backEnabled title={headerLabel} />}
    >
      <Animated.ScrollView
        ref={aref}
        // onScroll={scrollHandler}
        // scrollEventThrottle={1}
      >
        <View style={{ flex: 1, width: windowWidth - 20 }}>
          {!!post && (
            <View style={{ width: "100%" }}>
              <SocialThreadCard
                refetchFeed={refetchPost}
                style={{
                  borderRadius: 0,
                  borderLeftWidth: 0,
                  borderRightWidth: 0,
                }}
                post={localPost}
                isPostConsultation
                onPressReply={onPressReply}
              />
            </View>
          )}
          <NewsFeedInput
            style={{ alignSelf: "center" }}
            ref={feedInputRef}
            type="comment"
            replyTo={replyTo}
            parentId={post.identifier}
            // onSubmitInProgress={handleSubmitInProgress}
            onSubmitSuccess={() => {
              setReplyTo(undefined);
              //   refetchComments();
            }}
          />
        </View>
      </Animated.ScrollView>
    </ScreenContainer>
  );
};

export default MiniDefaultPostDetails;
