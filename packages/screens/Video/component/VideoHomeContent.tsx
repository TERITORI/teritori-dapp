import React, { useState, useEffect, useMemo } from "react";
import { View, Pressable, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { CreateVideoModal } from "./CreateVideoModal";
import Upload from "../../../../assets/icons/video-player/upload.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  combineFetchVideoPages,
  useFetchVideos,
} from "../../../hooks/videoplayer/useFetchVideos";
import { neutral30, primaryColor } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { VideoInfoWithMeta } from "../../../utils/types/video";
import {
  VIDEO_CARD_WIDTH,
  VideoCard,
} from "../../VideoDetail/components/VideoCard";

const FLAT_LIST_SEPARATOR_WIDTH = 20;
export const VideoHomeContent: React.FC = () => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    useFetchVideos({
      limit: 10,
      offset: 0,
    });

  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const [flatListWidth, setFlatListWidth] = useState(0);
  const elemsPerRow =
    Math.floor(
      flatListWidth / (VIDEO_CARD_WIDTH + FLAT_LIST_SEPARATOR_WIDTH)
    ) || 1;

  const videos = useMemo(
    () => (data ? combineFetchVideoPages(data.pages) : []),
    [data]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      setFlatListContentOffsetY(event.contentOffset.y);
      if (flatListContentOffsetY > event.contentOffset.y) {
        isGoingUp.value = true;
      } else if (flatListContentOffsetY < event.contentOffset.y) {
        isGoingUp.value = false;
      }
      setFlatListContentOffsetY(event.contentOffset.y);
    },
  });
  useEffect(() => {
    if (isFetching || isLoading) {
      isGoingUp.value = false;
      isLoadingValue.value = true;
    } else {
      isLoadingValue.value = false;
    }
  }, [isFetching, isLoading, isGoingUp, isLoadingValue]);
  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return (
    <View style={containerStyle}>
      <View style={oneLineStyle}>
        <BrandText style={fontSemibold20}>All Videos</BrandText>
        <View style={buttonGroupStyle}>
          <Pressable
            style={buttonContainerStyle}
            onPress={() => setOpenUploadModal(true)}
          >
            <SVG
              source={Upload}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <SpacerRow size={1} />
            <BrandText style={buttonTextStyle}>Upload video</BrandText>
          </Pressable>

          {/*TODO: Create funding button*/}
        </View>
      </View>
      <View style={contentGroupStyle}>
        <Animated.FlatList
          onLayout={(e) => setFlatListWidth(e.nativeEvent.layout.width)}
          key={`video-home-flat-list-${elemsPerRow}`}
          scrollEventThrottle={0.1}
          data={videos}
          numColumns={elemsPerRow}
          renderItem={({ item: videoInfo, index }) => (
            <>
              <VideoCard video={videoInfo} />
              {index !== elemsPerRow - 1 && (
                <SpacerRow size={FLAT_LIST_SEPARATOR_WIDTH / 8} />
              )}
            </>
          )}
          onScroll={scrollHandler}
          onEndReachedThreshold={1}
          onEndReached={onEndReached}
          ItemSeparatorComponent={() => (
            <SpacerColumn size={FLAT_LIST_SEPARATOR_WIDTH / 8} />
          )}
          keyExtractor={(video: VideoInfoWithMeta) => video.id}
        />
      </View>
      <CreateVideoModal
        isVisible={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
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
const buttonContainerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
  backgroundColor: neutral30,
  borderRadius: layout.spacing_x4,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
};
