import React, { useMemo, useState } from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { TrackCard } from "./TrackCard";
import { UploadMusicButton } from "./UploadMusicButton";
import { UploadMusicModal } from "./UploadMusicModal";
import { Post, PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import {
  PostCategory,
  ZodSocialFeedTrackMetadata,
} from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../hooks/feed/useFetchFeed";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { zodTryParseJSON } from "../../utils/sanitize";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { GridList } from "../layout/GridList";

const minCardWidth = 250;
const gap = layout.spacing_x2;

export const FeedMusicList: React.FC<{
  title?: string;
  authorId?: string;
  allowUpload?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ title, authorId, allowUpload, style }) => {
  const selectedWallet = useSelectedWallet();

  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);

  const musicFeedRequest: Partial<PostsRequest> = {
    filter: {
      categories: [PostCategory.MusicAudio],
      user: authorId || "",
      mentions: [],
      hashtags: [],
    },
    limit: 10,
    offset: 0,
    queryUserId: selectedWallet?.userId,
  };

  // ======= Getting MusicAudio posts as single tracks
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(musicFeedRequest);
  const tracks = useMemo(
    () =>
      combineFetchFeedPages(data?.pages || []).filter((p) => {
        const metadata = zodTryParseJSON(
          ZodSocialFeedTrackMetadata,
          p.metadata,
        );
        return !!metadata;
      }),
    [data],
  );

  // ======= TODO: Getting ??? as albums

  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  if (!data && (isLoading || isFetching))
    return <View style={[{ minWidth: minCardWidth }, style]} />;
  return (
    <View style={[containerCStyle, style]}>
      <View style={oneLineCStyle}>
        <BrandText style={fontSemibold20}>{title}</BrandText>
        <View style={buttonGroupCStyle}>
          {allowUpload && (
            <UploadMusicButton
              disabled={!selectedWallet?.connected}
              onPress={() => setOpenUploadModal(true)}
            />
          )}
        </View>
      </View>
      <View style={[contentGroupCStyle]}>
        <GridList<Post>
          data={tracks}
          minElemWidth={minCardWidth}
          gap={gap}
          keyExtractor={(item) => `track-${item.identifier}`}
          renderItem={({ item }, elemSize) => (
            <TrackCard post={item} style={{ width: elemSize }} />
          )}
          onEndReached={onEndReached}
        />
      </View>

      <UploadMusicModal
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
  marginTop: layout.spacing_x2,
};

const buttonGroupCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
