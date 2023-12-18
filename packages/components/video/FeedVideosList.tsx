import React, { useMemo, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

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
import { GridList } from "../layout/GridList";
import { ZodSocialFeedVideoMetadata } from "../socialFeed/NewsFeed/NewsFeed.type";

const minCardWidth = 261;

export const FeedVideosList: React.FC<{
  title: string;
  req: Partial<PostsRequest>;
  allowUpload?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ title, req, allowUpload, style }) => {
  const selectedWallet = useSelectedWallet();
  const reqWithQueryUser = { ...req, queryUserId: selectedWallet?.userId };
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);

  // ======= Getting Video posts
  const { data, isFetching, refetch, hasNextPage, fetchNextPage, isLoading } =
    useFetchFeed(reqWithQueryUser);

  const videos = useMemo(
    () =>
      combineFetchFeedPages(data?.pages || []).filter((p) => {
        const metadata = zodTryParseJSON(
          ZodSocialFeedVideoMetadata,
          p.metadata,
        );
        return !!metadata;
      }),
    [data?.pages],
  );

  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  if (!data && (isLoading || isFetching))
    return <View style={{ minWidth: minCardWidth }} />;
  return (
    <View style={[containerCStyle, style]}>
      <View style={oneLineCStyle}>
        <BrandText style={fontSemibold20} numberOfLines={1}>
          {title}
        </BrandText>

        {allowUpload && (
          <UploadVideoButton onPress={() => setOpenUploadModal(true)} />
        )}
      </View>
      <View style={[contentGroupCStyle]}>
        <GridList<Post>
          keyExtractor={(item) => `video-${item.identifier}`}
          data={videos}
          minElemWidth={minCardWidth}
          renderItem={({ item }, elemSize) => (
            <VideoCard
              post={item}
              style={{ width: elemSize }}
              hideAuthor={item.authorId === req.filter?.user}
            />
          )}
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
  marginTop: layout.spacing_x2,
};
