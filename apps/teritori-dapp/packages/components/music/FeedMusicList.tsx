import React, { useMemo, useState } from "react";
import { View, ViewStyle, StyleProp } from "react-native";

import { TrackCard } from "./TrackCard";
import { UploadMusicButton } from "./UploadMusicButton";
import { UploadMusicModal } from "./UploadMusicModal";
import { Post, PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import { useWalletControl } from "../../context/WalletControlProvider";
import {
  combineFetchFeedPages,
  useFetchFeed,
} from "../../hooks/feed/useFetchFeed";
import { useAppMode } from "../../hooks/useAppMode";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkFeature } from "../../networks";
import { zodTryParseJSON } from "../../utils/sanitize";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import {
  PostCategory,
  ZodSocialFeedTrackMetadata,
} from "../../utils/types/feed";
import { GridList } from "../layout/GridList";

import { Spinner } from "@/components/Spinner";

const minCardWidth = 250;
const gap = layout.spacing_x2;

export const FeedMusicList: React.FC<{
  title?: string;
  networkId?: string;
  authorId?: string;
  allowUpload?: boolean;
  style?: StyleProp<ViewStyle>;
}> = ({ title, networkId, authorId, allowUpload, style }) => {
  const [appMode] = useAppMode();
  const selectedWallet = useSelectedWallet();
  const { showConnectWalletModal } = useWalletControl();
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);

  const musicFeedRequest: Partial<PostsRequest> = {
    filter: {
      networkId: networkId || "",
      categories: [PostCategory.MusicAudio],
      user: authorId || "",
      mentions: [],
      hashtags: [],
      premiumLevelMin: 0,
      premiumLevelMax: -1,
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

  const onPressUploadMusic = async () => {
    if (!selectedWallet?.address || !selectedWallet.connected) {
      showConnectWalletModal({
        forceNetworkFeature: NetworkFeature.SocialFeed,
        action: "Publish Music",
      });
      return;
    }
    setOpenUploadModal(true);
  };

  if (!data && (isLoading || isFetching))
    return (
      <View style={[{ minWidth: minCardWidth }, style]}>
        {appMode === "mini" && (
          <View
            style={{
              alignItems: "center",
              marginVertical: layout.spacing_x1_5,
            }}
          >
            <Spinner />
          </View>
        )}
      </View>
    );

  return (
    <View style={[containerCStyle, style]}>
      <View style={oneLineCStyle}>
        <BrandText style={fontSemibold20}>{title}</BrandText>
        <View style={buttonGroupCStyle}>
          {allowUpload && <UploadMusicButton onPress={onPressUploadMusic} />}
        </View>
      </View>
      <View
        style={
          appMode === "mini"
            ? { marginTop: layout.spacing_x2, paddingBottom: 100 } //paddingBottom :100 to make last card visible completely, otherwise gets hidden behind bottom tabs
            : [contentGroupCStyle]
        }
      >
        <GridList<Post>
          data={tracks}
          minElemWidth={minCardWidth}
          gap={gap}
          keyExtractor={(item) => item.id}
          renderItem={({ item }, elemSize) => (
            <TrackCard post={item} style={{ width: elemSize }} />
          )}
          onEndReached={onEndReached}
          noFixedHeight //FIXME: adding noFixedHeight breaks pagination ie.infinite pagination, without it scroll won't work
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
  paddingBottom: layout.spacing_x4,
};

const buttonGroupCStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
