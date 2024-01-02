import React, { useEffect, useMemo, useState } from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { UploadVideoModal } from "./UploadVideoModal";
import { VideoCard } from "./VideoCard";
import { Post, PostsRequest } from "../../api/feed/v1/feed";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../hooks/feed/useFetchFeed";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { zodTryParseJSON } from "../../utils/sanitize";
import { fontSemibold16 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { GridList } from "../layout/GridList";
import { ZodSocialFeedVideoMetadata } from "../socialFeed/NewsFeed/NewsFeed.type";

const minCardWidth = 261;

export const VideosList: React.FC<{
  title: string;
  consultedPostId?: string;
  style?: StyleProp<ViewStyle>;
  req: Partial<PostsRequest>;
  onFetchFeedSuccess?: (nbResults: number) => void;
}> = ({ title, consultedPostId, style, req, onFetchFeedSuccess }) => {
  const selectedWallet = useSelectedWallet();
  const reqWithQueryUser = { ...req, queryUserId: selectedWallet?.userId };
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);

  // ======= Getting Video posts
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(reqWithQueryUser);

  const posts = useMemo(
    () =>
      combineFetchFeedPages(data?.pages || []).filter(
        (p) =>
          // We remove the current video from the fetched ones
          !consultedPostId || p.identifier !== consultedPostId,
      ),
    [data?.pages, consultedPostId],
  );

  const videos = useMemo(
    () =>
      posts.filter((p) => {
        const metadata = zodTryParseJSON(
          ZodSocialFeedVideoMetadata,
          p.metadata,
        );
        return !!metadata;
      }),
    [posts],
  );

  useEffect(() => {
    if (isFetching || isLoading || !onFetchFeedSuccess) return;
    onFetchFeedSuccess(posts.length);
  }, [posts.length, isFetching, isLoading, onFetchFeedSuccess]);

  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  if (!data && (isLoading || isFetching))
    return <View style={[{ minWidth: minCardWidth }, style]} />;
  return (
    <View style={[containerCStyle, style]}>
      <BrandText style={fontSemibold16} numberOfLines={1}>
        {title}
      </BrandText>
      <View style={contentGroupCStyle}>
        <GridList<Post>
          keyExtractor={(item) => `video-${item.identifier}`}
          data={videos}
          minElemWidth={minCardWidth}
          renderItem={({ item }, elemSize) => (
            <VideoCard
              post={item}
              style={{ width: elemSize }}
              hideAuthor={item.authorId === req.filter?.user}
              hideDescription={!!consultedPostId}
            />
          )}
          onEndReached={onEndReached}
          noFixedHeight
        />
      </View>
      <UploadVideoModal
        isVisible={openUploadModal}
        onClose={() => {
          setOpenUploadModal(false);
          refetch();
        }}
      />
    </View>
  );
};

const containerCStyle: ViewStyle = {
  width: "100%",
};

const contentGroupCStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  flexWrap: "wrap",
  marginTop: layout.spacing_x2_5,
};
