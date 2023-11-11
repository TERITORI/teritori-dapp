import React, { useMemo, useState } from "react";
import { View, ViewStyle, FlatList } from "react-native";

import { TRACK_CARD_WIDTH, TrackCard } from "./TrackCard";
import { UploadMusicButton } from "./UploadMusicButton";
import { UploadMusicModal } from "./UploadMusicModal";
import { PostsRequest } from "../../../api/feed/v1/feed";
import { BrandText } from "../../../components/BrandText";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../../hooks/feed/useFetchFeed";
import { fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { Track, ZodTrack } from "../../../utils/types/music";

const FLAT_LIST_SEPARATOR_WIDTH = 20;
export const MusicHomeContent: React.FC = () => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);

  const tracksFeedRequest: PostsRequest = {
    filter: {
      categories: [PostCategory.ArtisticAudio],
      user: "",
      mentions: [],
      hashtags: [],
    },
    limit: 10,
    offset: 0,
  };

  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(tracksFeedRequest);
  const tracks: Track[] = useMemo(
    () =>
      data
        ? combineFetchFeedPages(data.pages).map((post) =>
            ZodTrack.parse(JSON.parse(post.metadata))
          )
        : [],
    [data]
  );

  const [flatListWidth, setFlatListWidth] = useState(0);
  const elemsPerRow =
    Math.floor(
      flatListWidth / (TRACK_CARD_WIDTH + FLAT_LIST_SEPARATOR_WIDTH)
    ) || 1;
  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return (
    <View style={containerStyle}>
      <View style={oneLineStyle}>
        <BrandText style={fontSemibold20}>All Music</BrandText>
        <View style={buttonGroupStyle}>
          <UploadMusicButton onPress={() => setOpenUploadModal(true)} />

          {/*TODO: Create funding button*/}
        </View>
      </View>
      <View style={contentGroupStyle}>
        <FlatList
          onLayout={(e) => setFlatListWidth(e.nativeEvent.layout.width)}
          keyExtractor={(item, index) => `track-${index}`}
          key={`music-home-flat-list-${elemsPerRow}`}
          scrollEventThrottle={0.1}
          data={tracks}
          numColumns={elemsPerRow}
          renderItem={({ item, index }) => (
            <>
              <TrackCard track={item} />
              {index !== elemsPerRow - 1 && (
                <SpacerRow size={FLAT_LIST_SEPARATOR_WIDTH / 8} />
              )}
            </>
          )}
          onEndReachedThreshold={1}
          onEndReached={onEndReached}
          ItemSeparatorComponent={() => (
            <SpacerColumn size={FLAT_LIST_SEPARATOR_WIDTH / 8} />
          )}
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

const containerStyle: ViewStyle = {
  marginTop: layout.spacing_x3,
  width: "100%",
};
const oneLineStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};
const contentGroupStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  flexWrap: "wrap",
  marginTop: layout.spacing_x3,
  marginBottom: 40,
};
const buttonGroupStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
