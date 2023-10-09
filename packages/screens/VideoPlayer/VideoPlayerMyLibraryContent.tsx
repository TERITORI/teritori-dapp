import React, { useState, useMemo, useEffect } from "react";
import { View, Pressable, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import Logo from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SpacerRow } from "../../components/spacer";
import { CreateVideoModal } from "../../components/videoPlayer/CreateVideoModal";
import { VideoPlayerCard } from "../../components/videoPlayer/VideoPlayerCard";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  useUserFetchVideos,
  combineFetchVideoPages,
} from "../../hooks/video/useUserFetchVideos";
import { getUserId } from "../../networks";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold20, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { VideoInfoWithMeta } from "../../utils/types/video";

export const VideoPlayerMyLibraryContent: React.FC<{
  videoListForLibrary: VideoInfoWithMeta[];
}> = ({ videoListForLibrary }) => {
  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);

  const isGoingUpOther = useSharedValue(false);

  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);

  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    useUserFetchVideos({
      limit: 10,
      offset: 0,
      createdBy: userId,
    });

  const myVideos = useMemo(
    () => (data ? combineFetchVideoPages(data.pages) : []),
    [data]
  );

  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  useEffect(() => {
    if (isFetching || isLoading) {
      isGoingUp.value = false;
      isLoadingValue.value = true;
    } else {
      isLoadingValue.value = false;
    }
  }, [isFetching, isLoading, isGoingUp, isLoadingValue]);

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

  const scrollHandlerOther = useAnimatedScrollHandler({
    onScroll: (event) => {
      setFlatListContentOffsetY(event.contentOffset.y);
      if (flatListContentOffsetY > event.contentOffset.y) {
        isGoingUpOther.value = true;
      } else if (flatListContentOffsetY < event.contentOffset.y) {
        isGoingUpOther.value = false;
      }
      setFlatListContentOffsetY(event.contentOffset.y);
    },
  });

  const onEndReached = () => {
    if (!isLoading && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const onEndReachedOther = () => {};

  return (
    <View style={containerStyle}>
      <View style={oneLineStyle}>
        <BrandText style={fontSemibold20}>My Videos</BrandText>
        <View style={buttonGroupStyle}>
          <Pressable
            style={buttonContainerStyle}
            onPress={() => setOpenUploadModal(true)}
          >
            <SVG
              source={Logo}
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
          data={myVideos}
          numColumns={4}
          renderItem={({ item: videoInfo }) => (
            <View style={albumGridStyle}>
              <VideoPlayerCard item={videoInfo} hasLibrary />
            </View>
          )}
          onScroll={scrollHandler}
          onEndReachedThreshold={1}
          onEndReached={onEndReached}
        />
      </View>

      <View style={oneLineStyle}>
        <BrandText style={fontSemibold20}>Other Videos</BrandText>
      </View>
      <View style={contentGroupStyle}>
        <Animated.FlatList
          scrollEventThrottle={0.1}
          data={videoListForLibrary}
          numColumns={4}
          renderItem={({ item: videoInfo }) => (
            <View style={albumGridStyle}>
              <VideoPlayerCard item={videoInfo} hasLibrary />
            </View>
          )}
          onScroll={scrollHandlerOther}
          onEndReachedThreshold={1}
          onEndReached={onEndReachedOther}
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
  flexWrap: "wrap",
  justifyContent: "center",
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
