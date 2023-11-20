import React, { useMemo, useState } from "react";
import { FlatList, View, ViewStyle } from "react-native";

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
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

const FLAT_LIST_SEPARATOR_WIDTH = 20;
export const MusicMyLibraryContent: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);

  // ======= Getting MusicAudio posts as single tracks
  const myMusicFeedRequest: PostsRequest = {
    filter: {
      categories: [PostCategory.MusicAudio],
      user: selectedWallet?.userId || "",
      mentions: [],
      hashtags: [],
    },
    limit: 10,
    offset: 0,
  };
  const {
    data: myMusicData,
    isFetching: myMusicIsFetching,
    refetch: myMusicRefetch,
    hasNextPage: myMusicHasNextPage,
    fetchNextPage: myMusicFetchNextPage,
    isLoading: myMusicIsLoading,
  } = useFetchFeed(myMusicFeedRequest);
  const myMusicPosts = useMemo(
    () => (myMusicData ? combineFetchFeedPages(myMusicData.pages) : []),
    [myMusicData],
  );
  const onEndReachedMyMusic = () => {
    if (!myMusicIsLoading && myMusicHasNextPage && !myMusicIsFetching) {
      myMusicFetchNextPage();
    }
  };

  // TODO: Uncomment  this after "add/remove to library" integration
  // const otherMusicFeedRequest: PostsRequest = {
  //   filter: {
  //     categories: [PostCategory.MusicAudio],
  //     user: "",
  //     mentions: [],
  //     hashtags: [],
  //   },
  //   limit: 10,
  //   offset: 0,
  // };
  // const {
  //   data: otherMusicData, isFetching: otherMusicIsFetching,
  //   refetch: otherMusicRefetch, hasNextPage: otherMusicHasNextPage, fetchNextPage: otherMusicFetchNextPage, isLoading:
  //     otherMusicIsLoading
  // } =
  //   useFetchFeed(otherMusicFeedRequest);
  // const otherMusicPosts = useMemo(
  //   () => (otherMusicData ? combineFetchFeedPages(otherMusicData.pages) : []),
  //   [otherMusicData],
  // );
  // const onEndReachedOtherMusic = () => {
  //   if (!otherMusicIsLoading && otherMusicHasNextPage && !otherMusicIsFetching) {
  //     otherMusicFetchNextPage();
  //   }
  // };

  // ======= TODO: Getting ??? as albums

  const [flatListWidth, setFlatListWidth] = useState(0);
  const elemsPerRow =
    Math.floor(
      flatListWidth / (TRACK_CARD_WIDTH + FLAT_LIST_SEPARATOR_WIDTH),
    ) || 1;

  return (
    <View style={containerStyle}>
      <View style={oneLineStyle}>
        <BrandText style={fontSemibold20}>My Music</BrandText>
        <View style={buttonGroupStyle}>
          <UploadMusicButton onPress={() => setOpenUploadModal(true)} />

          {/*TODO: Create funding button*/}
        </View>
      </View>
      <View style={contentGroupStyle}>
        <FlatList
          onLayout={(e) => setFlatListWidth(e.nativeEvent.layout.width)}
          keyExtractor={(item, index) => `track-${index}`}
          key={`my-music-flat-list-${elemsPerRow}`}
          scrollEventThrottle={0.1}
          data={myMusicPosts}
          numColumns={elemsPerRow}
          renderItem={({ item, index }) => (
            <>
              <TrackCard post={item} />
              {index !== elemsPerRow - 1 && (
                <SpacerRow size={FLAT_LIST_SEPARATOR_WIDTH / 8} />
              )}
            </>
          )}
          onEndReachedThreshold={1}
          onEndReached={onEndReachedMyMusic}
          ItemSeparatorComponent={() => (
            <SpacerColumn size={FLAT_LIST_SEPARATOR_WIDTH / 8} />
          )}
        />
      </View>

      {/*TODO: Uncomment  this after "add/remove to library" integration*/}
      {/*<View style={oneLineStyle}>*/}
      {/*  <BrandText style={fontSemibold20}>Other Music</BrandText>*/}
      {/*</View>*/}
      {/*<View style={contentGroupStyle}>*/}
      {/*  <FlatList*/}
      {/*    onLayout={(e) => setFlatListWidth(e.nativeEvent.layout.width)}*/}
      {/*    keyExtractor={(item, index) => `track-${index}`}*/}
      {/*    key={`other-music-flat-list-${elemsPerRow}`}*/}
      {/*    scrollEventThrottle={0.1}*/}
      {/*    data={otherMusicPosts}*/}
      {/*    numColumns={elemsPerRow}*/}
      {/*    renderItem={({ item, index }) => (*/}
      {/*      <>*/}
      {/*        <TrackCard post={item} />*/}
      {/*        {index !== elemsPerRow - 1 && (*/}
      {/*          <SpacerRow size={FLAT_LIST_SEPARATOR_WIDTH / 8} />*/}
      {/*        )}*/}
      {/*      </>*/}
      {/*    )}*/}
      {/*    onEndReachedThreshold={1}*/}
      {/*    onEndReached={onEndReachedOtherMusic}*/}
      {/*    ItemSeparatorComponent={() => (*/}
      {/*      <SpacerColumn size={FLAT_LIST_SEPARATOR_WIDTH / 8} />*/}
      {/*    )}*/}
      {/*  />*/}
      {/*</View>*/}

      <UploadMusicModal
        isVisible={openUploadModal}
        onClose={() => {
          setOpenUploadModal(false);
          myMusicRefetch();
          // otherMusicRefetch()
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
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: layout.spacing_x3,
  marginBottom: 40,
};
const buttonGroupStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
