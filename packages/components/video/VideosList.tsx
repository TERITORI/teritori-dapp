import React, { useEffect, useMemo, useState } from "react";
import { View, ViewStyle, FlatList, StyleProp } from "react-native";

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
import {
  PostCategory,
  ZodSocialFeedVideoMetadata,
} from "../socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn } from "../spacer";

const minCardWidth = 261;
const halfGap = layout.spacing_x1;

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

  const [containerWidth, setContainerWidth] = useState(0);
  const elemsPerRow = Math.floor(containerWidth / minCardWidth) || 1;
  const elemSize = elemsPerRow
    ? (containerWidth - halfGap * (elemsPerRow - 1) * 2) / elemsPerRow
    : videos?.length || 0;
  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  let padded: Post[] = videos;
  if (videos.length % elemsPerRow !== 0 && elemsPerRow > 1) {
    const padding = Array(elemsPerRow - (videos.length % elemsPerRow))
      .fill(undefined)
      .map((_, i) => {
        const n: Post = {
          identifier: `padded-${i}`,
          category: PostCategory.Video,
          authorId: "",
          metadata: "",
          isDeleted: false,
          parentPostIdentifier: "",
          subPostLength: 0,
          createdAt: 0,
          tipAmount: 0,
          reactions: [],
        };
        return n;
      });
    padded = videos.concat(padding);
  }

  if (!data && (isLoading || isFetching))
    return <View style={[{ minWidth: minCardWidth }, style]} />;
  return (
    <View style={[containerCStyle, style]}>
      <BrandText style={fontSemibold16} numberOfLines={1}>
        {title}
      </BrandText>
      <View style={contentGroupCStyle}>
        <FlatList
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          keyExtractor={(item) => `video-${item.identifier}`}
          style={{ width: "100%" }}
          key={`videos-flat-list-${elemsPerRow}`}
          columnWrapperStyle={
            elemsPerRow < 2
              ? undefined
              : { flex: 1, justifyContent: "space-between" }
          }
          ItemSeparatorComponent={() => <SpacerColumn size={2} />}
          data={padded}
          numColumns={elemsPerRow}
          renderItem={({ item }) => (
            <VideoCard
              post={item}
              style={{ width: elemSize }}
              hideAuthor={item.authorId === req.filter?.user}
              hideDescription={!!consultedPostId}
            />
          )}
          onEndReachedThreshold={1}
          onEndReached={onEndReached}
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
