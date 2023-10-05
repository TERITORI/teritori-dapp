import React, { useState, useEffect, useMemo } from "react";
import { View, Pressable, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import Upload from "../../../assets/icons/upload.svg";
import Logo from "../../../assets/logos/logo.svg";
import { GetVideoListRequest } from "../../api/video/v1/video";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { VideoPlayerCard } from "../../components/VideoPlayer/VideoPlayerCard";
import { SpacerRow } from "../../components/spacer";
import { CreateVideoModal } from "../../components/videoPlayer/CreateVideoModal";
import {
  combineFetchVideoPages,
  useFetchVideos,
} from "../../hooks/video/useFetchVideos";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { VideoInfoWithMeta } from "../../utils/types/video";

interface VideoPlayerProps {
  req: GetVideoListRequest;
  videoListForLibrary: VideoInfoWithMeta[];
}

export const VideoPlayerHomeContent: React.FC<VideoPlayerProps> = ({
  req,
  videoListForLibrary,
}) => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    useFetchVideos(req);

  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);

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
          <Pressable style={buttonContainerStyle}>
            <SVG
              source={Logo}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <SpacerRow size={1.5} />
            <BrandText style={buttonTextStyle}>Create funding</BrandText>
          </Pressable>
          <SpacerRow size={2} />
          <Pressable
            style={buttonContainerStyle}
            onPress={() => setOpenUploadModal(true)}
          >
            <SVG
              source={Upload}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <SpacerRow size={1.5} />
            <BrandText style={buttonTextStyle}>Upload video</BrandText>
          </Pressable>
        </View>
      </View>
      <View style={contentGroupStyle}>
        <Animated.FlatList
          scrollEventThrottle={0.1}
          data={videos}
          numColumns={4}
          renderItem={({ item: videoInfo }) => (
            <View style={albumGridStyle}>
              <VideoPlayerCard
                item={videoInfo}
                hasLibrary={
                  videoListForLibrary.findIndex(
                    (item) => item.identifier === videoInfo.identifier
                  ) !== -1
                }
              />
            </View>
          )}
          onScroll={scrollHandler}
          onEndReachedThreshold={1}
          onEndReached={onEndReached}
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
  backgroundColor: "#2B2B33",
  borderRadius: layout.spacing_x4,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,
  color: primaryColor,
};
const albumGridStyle: ViewStyle = {
  margin: layout.spacing_x3,
};
