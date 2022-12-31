import { useFocusEffect } from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, View, ScrollView, StyleSheet } from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import {
  NewsFeedInput,
  NewsFeedInputHandle,
} from "../../components/NewsFeed/NewsFeedInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import { CommentsContainer } from "../../components/cards/CommentsContainer";
import { SocialThreadCard } from "../../components/cards/SocialThreadCard";
import { BackTo } from "../../components/navigation/BackTo";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import {
  combineFetchCommentPages,
  useFetchComments,
} from "../../hooks/useFetchComments";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { ReplyToType } from "./types";

export type OnPressReplyType = (username: string, parentId: string) => void;

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id },
  },
}) => {
  const wallet = useSelectedWallet();
  const [refresh, setRefresh] = useState(0);
  const { triggerError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<PostResult>();
  const feedInputRef = useRef<NewsFeedInputHandle>(null);
  const [replyTo, setReplyTo] = useState<ReplyToType>();
  const { data, refetch, hasNextPage, fetchNextPage, isFetching } =
    useFetchComments({
      parentId: post?.identifier,
      totalCount: post?.sub_post_length,
    });

  const comments = useMemo(
    () => (data ? combineFetchCommentPages(data.pages) : []),
    [data]
  );

  const fetchPost = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    try {
      setIsLoading(true);
      const client = await socialFeedClient({
        walletAddress: wallet.address,
      });
      const _post = await client.queryPost({ identifier: id });
      setPost(_post);
    } catch (error) {
      triggerError({ error });
    } finally {
      setIsLoading(false);
    }
  };

  const onPressReply: OnPressReplyType = (username, parentId) => {
    feedInputRef.current?.resetForm();
    setReplyTo({ username, parentId });
    feedInputRef.current?.setValue(`@${username} `);
    feedInputRef.current?.focusInput();
  };

  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [wallet?.connected])
  );

  useEffect(() => {
    refetch();
  }, [post?.identifier, refresh]);

  return (
    <ScreenContainer
      responsive
      headerChildren={<BackTo label="Feed" />}
      footerChildren
      fullWidth
      noScroll
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        onScroll={(e) => {
          let offsetPadding = 40;
          offsetPadding += e.nativeEvent.layoutMeasurement.height;

          if (
            e.nativeEvent.contentOffset.y >=
              e.nativeEvent.contentSize.height - offsetPadding &&
            hasNextPage
          ) {
            fetchNextPage();
          }
        }}
        scrollEventThrottle={1}
      >
        {!!post && (
          <SocialThreadCard
            post={post}
            singleView
            refresh={refresh}
            onPressReply={onPressReply}
          />
        )}

        <CommentsContainer
          comments={comments}
          onPressReply={onPressReply}
          refresh={refresh}
        />
        {isLoading ||
          (isFetching && (
            <ActivityIndicator
              size="small"
              color={secondaryColor}
              style={styles.indicator}
            />
          ))}
      </ScrollView>

      <View style={styles.footer}>
        <NewsFeedInput
          ref={feedInputRef}
          type="comment"
          parentId={id}
          onSubmitSuccess={() => setRefresh((prev) => prev + 1)}
          replyTo={replyTo}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: layout.contentPadding,
    paddingHorizontal: layout.contentPadding,
  },
  footer: {
    marginBottom: layout.padding_x2,
    marginHorizontal: layout.contentPadding,
  },
  indicator: {
    marginBottom: 56,
    marginLeft: 56,
  },
});
