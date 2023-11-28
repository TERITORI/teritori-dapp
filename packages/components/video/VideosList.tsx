import React, { useEffect, useMemo, useState } from "react";
import { View, ViewStyle, FlatList, StyleProp } from "react-native";

import { UploadVideoButton } from "./UploadVideoButton";
import { UploadVideoModal } from "./UploadVideoModal";
import { VideoCard } from "./VideoCard";
import { Post, PostsRequest } from "../../api/feed/v1/feed";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../hooks/feed/useFetchFeed";
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
  title?: string;
  consultedPostId?: string;
  allowUpload?: boolean;
  style?: StyleProp<ViewStyle>;
  req: Partial<PostsRequest>;
  onFetchFeedSuccess: (nbResults: number) => void;
}> = ({
  title,
  consultedPostId,
  allowUpload,
  style,
  req,
  onFetchFeedSuccess,
}) => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);

  // ======= Getting Video posts
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(req);

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
    if (!isFetching && !isLoading) {
      onFetchFeedSuccess(posts.length);
    }
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
      <View style={oneLineCStyle}>
        {title && (
          <BrandText style={fontSemibold16} numberOfLines={1}>
            {title}
          </BrandText>
        )}
        <View style={buttonGroupCStyle}>
          {allowUpload && <UploadVideoButton refetch={refetch} />}
        </View>
      </View>
      {allowUpload || (title && <SpacerColumn size={2.5} />)}
      <View style={[contentGroupCStyle]}>
        <FlatList
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          keyExtractor={(item) => `video-${item.identifier}`}
          style={{ width: "100%" }}
          key={`videos-feed-flat-list-${elemsPerRow}`}
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
              hideAuthor={req.filter?.user === item.authorId}
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
const oneLineCStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};
const contentGroupCStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  flexWrap: "wrap",
};
const buttonGroupCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
