import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import CustomAppBar from "../../../components/AppBar/CustomAppBar";

import { Post } from "@/api/feed/v1/feed";
import { KeyboardAvoidingView } from "@/components/KeyboardAvoidingView";
import { ScreenContainer } from "@/components/ScreenContainer";
import { CommentsContainer } from "@/components/cards/CommentsContainer";
import { SocialThreadCard } from "@/components/socialFeed/SocialCard/cards/SocialThreadCard";
import { SpacerColumn } from "@/components/spacer";
import { useFetchComments } from "@/hooks/feed/useFetchComments";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { parseUserId } from "@/networks";
import {
  MiniCommentInput,
  MiniCommentInputInputHandle,
} from "@/screens/Mini/components/MiniCommentInput";
import { DEFAULT_USERNAME } from "@/utils/social-feed";
import { neutral00 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";
import {
  OnPressReplyType,
  PostCategory,
  ReplyToType,
} from "@/utils/types/feed";

type Props = {
  post: Post;
  refetchPost: () => Promise<any>;
};

const MiniDefaultPostDetails = ({ post, refetchPost }: Props) => {
  const navigation = useAppNavigation();

  const { width: windowWidth } = useWindowDimensions();

  const aref = useAnimatedRef<Animated.ScrollView>();

  const [localPost, setLocalPost] = useState(post || Post.create());
  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const {
    data: comments,
    refetch: refetchComments,
    hasNextPage,
    fetchNextPage,
  } = useFetchComments({
    parentId: post.id,
    totalCount: post.subPostLength,
    enabled: true,
  });
  const isNextPageAvailable = useSharedValue(hasNextPage);

  useEffect(() => {
    if (post.category === PostCategory.Video)
      navigation.replace("FeedPostView", {
        id: post.id,
      });
  }, [post.category, post.id, navigation]);

  useEffect(() => {
    if (post) {
      setLocalPost(post);
    }
  }, [post]);

  const authorId = post?.authorId;
  const authorNSInfo = useNSUserInfo(authorId);

  const [, authorAddress] = parseUserId(post?.authorId);
  const feedInputRef = useRef<MiniCommentInputInputHandle>(null);

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
    [post.id],
  );

  const handleSubmitInProgress = () => {
    if (replyTo?.parentId && replyTo.yOffsetValue)
      aref.current?.scrollTo(replyTo.yOffsetValue);
    else aref.current?.scrollTo(0);
  };

  return (
    <KeyboardAvoidingView extraVerticalOffset={-100}>
      <ScreenContainer
        forceNetworkId={post.networkId}
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
          scrollEventThrottle={0}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <View
            style={{
              flex: 1,
              position: "relative",
            }}
          >
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
            <SpacerColumn size={3} />
          </View>
        </Animated.ScrollView>
        <SpacerColumn size={3} />
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: neutral00,
            paddingVertical: layout.spacing_x0_75,
          }}
        >
          <MiniCommentInput
            style={{
              alignSelf: "center",
            }}
            ref={feedInputRef}
            replyTo={replyTo}
            parentId={post.id}
            onSubmitInProgress={handleSubmitInProgress}
            onSubmitSuccess={() => {
              setReplyTo(undefined);
              refetchComments();
            }}
          />
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

export default MiniDefaultPostDetails;
