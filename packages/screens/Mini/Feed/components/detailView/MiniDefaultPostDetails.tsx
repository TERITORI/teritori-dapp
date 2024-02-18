import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import CustomAppBar from "../../../components/AppBar/CustomAppBar";

import { Post } from "@/api/feed/v1/feed";
import { ScreenContainer } from "@/components/ScreenContainer";
import { CommentsContainer } from "@/components/cards/CommentsContainer";
import {
  NewsFeedInput,
  NewsFeedInputHandle,
} from "@/components/socialFeed/NewsFeed/NewsFeedInput";
import { SocialThreadCard } from "@/components/socialFeed/SocialCard/cards/SocialThreadCard";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "@/hooks/feed/useFetchComments";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import { DEFAULT_USERNAME } from "@/utils/social-feed";
import { tinyAddress } from "@/utils/text";
import {
  OnPressReplyType,
  PostCategory,
  ReplyToType,
} from "@/utils/types/feed";

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

  const [localPost, setLocalPost] = useState(post || Post.create());
  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const {
    data,
    refetch: refetchComments,
    hasNextPage,
    fetchNextPage,
  } = useFetchComments({
    parentId: post?.identifier,
    totalCount: post?.subPostLength,
    enabled: true,
  });
  const isNextPageAvailable = useSharedValue(hasNextPage);
  const comments = useMemo(
    () => (data ? combineFetchCommentPages(data.pages) : []),
    [data],
  );
  const postId = post.identifier;

  useEffect(() => {
    if (post?.category === PostCategory.Video)
      navigation.replace("FeedPostView", {
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

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        let offsetPadding = 40;
        offsetPadding += event.layoutMeasurement.height;
        if (
          event.contentOffset.y >= event.contentSize.height - offsetPadding &&
          isNextPageAvailable.value
        ) {
          fetchNextPage();
        }
      },
    },
    [post?.identifier],
  );

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId && replyTo.yOffsetValue)
      aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
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
        onScroll={scrollHandler}
        scrollEventThrottle={1}
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
          <CommentsContainer
            cardWidth={windowWidth - 20}
            comments={comments}
            onPressReply={onPressReply}
          />
          <NewsFeedInput
            style={{ alignSelf: "center" }}
            ref={feedInputRef}
            type="comment"
            replyTo={replyTo}
            parentId={post.identifier}
            onSubmitInProgress={handleSubmitInProgress}
            onSubmitSuccess={() => {
              setReplyTo(undefined);
              refetchComments();
            }}
          />
        </View>
      </Animated.ScrollView>
    </ScreenContainer>
  );
};

export default MiniDefaultPostDetails;
