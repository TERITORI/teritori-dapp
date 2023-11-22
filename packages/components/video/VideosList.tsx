import React, { useMemo, useState } from "react";
import { View, ViewStyle, FlatList, StyleProp } from "react-native";

import { UploadVideoButton } from "./UploadVideoButton";
import { UploadVideoModal } from "./UploadVideoModal";
import { VideoCard } from "./VideoCard";
import { Post, PostsRequest } from "../../api/feed/v1/feed";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../hooks/feed/useFetchFeed";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { zodTryParseJSON } from "../../utils/sanitize";
import { fontSemibold20 } from "../../utils/style/fonts";
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
  authorId?: string;
  allowUpload?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ title, authorId, allowUpload, style }) => {
  const selectedWallet = useSelectedWallet();
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const videoFeedRequest: PostsRequest = {
    filter: {
      categories: [PostCategory.Video],
      user: authorId || "",
      mentions: [],
      hashtags: [],
    },
    limit: 10,
    offset: 0,
  };

  // ======= Getting Video posts
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(videoFeedRequest);
  const tracks = useMemo(
    () =>
      combineFetchFeedPages(data?.pages || []).filter((p) => {
        const metadata = zodTryParseJSON(
          ZodSocialFeedVideoMetadata,
          p.metadata,
        );
        return !!metadata;
      }),
    [data],
  );

  const [containerWidth, setContainerWidth] = useState(0);
  const elemsPerRow = Math.floor(containerWidth / minCardWidth) || 1;
  const elemSize = elemsPerRow
    ? (containerWidth - halfGap * (elemsPerRow - 1) * 2) / elemsPerRow
    : tracks?.length || 0;
  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  let padded: Post[] = tracks;
  if (tracks.length % elemsPerRow !== 0 && elemsPerRow > 1) {
    const padding = Array(elemsPerRow - (tracks.length % elemsPerRow))
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
    padded = tracks.concat(padding);
  }

  return (
    <View style={[containerCStyle, style]}>
      <View style={oneLineCStyle}>
        <BrandText style={fontSemibold20}>{title}</BrandText>
        <View style={buttonGroupCStyle}>
          {allowUpload && (
            <UploadVideoButton
              disabled={!selectedWallet?.connected}
              onPress={() => setOpenUploadModal(true)}
            />
          )}
        </View>
      </View>
      <View style={[contentGroupCStyle]}>
        <FlatList
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          keyExtractor={(item) => `track-${item.identifier}`}
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
            <VideoCard post={item} style={{ width: elemSize }} />
          )}
          ListEmptyComponent={
            <BrandText style={fontSemibold20}>No results found.</BrandText>
          }
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
  marginTop: layout.spacing_x3,
  marginBottom: 40,
};
const buttonGroupCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
