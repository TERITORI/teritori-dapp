import React, { useState, useMemo, useEffect } from "react";
import { View, Pressable, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { CreateVideoModal } from "./CreateVideoModal";
import Logo from "../../../../assets/logos/logo.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { useFetchLibraryIds } from "../../../hooks/videoplayer/useFetchLibraryIds";
import { useFetchOtherAlbums } from "../../../hooks/videoplayer/useFetchOtherVideos";
import {
  useFetchUserVideos,
  combineFetchVideoPages,
} from "../../../hooks/videoplayer/useFetchUserVideos";
import { getUserId } from "../../../networks";
import { primaryColor } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  VIDEO_CARD_WIDTH,
  VideoCard,
} from "../../VideoDetail/components/VideoCard";

const FLAT_LIST_SEPARATOR_WIDTH = 20;
export const VideoMyLibraryContent: React.FC = () => {
  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);

  const isGoingUpOther = useSharedValue(false);

  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);

  // const { data: libraryVideos } = useFetchVideosForLibrary();
  // const videoListForLibrary = useMemo(
  //   () => (libraryVideos ? libraryVideos : []),
  //   [libraryVideos]
  // );

  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const [flatListWidth, setFlatListWidth] = useState(0);
  const [flatListOthersWidth, setFlatListOthersWidth] = useState(0);
  const elemsPerRow =
    Math.floor(
      flatListWidth / (VIDEO_CARD_WIDTH + FLAT_LIST_SEPARATOR_WIDTH)
    ) || 1;
  const elemsOthersPerRow =
    Math.floor(
      flatListOthersWidth / (VIDEO_CARD_WIDTH + FLAT_LIST_SEPARATOR_WIDTH)
    ) || 1;
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    useFetchUserVideos({
      limit: 10,
      offset: 0,
      createdBy: userId,
    });

  const myVideos = useMemo(
    () => (data ? combineFetchVideoPages(data.pages) : []),
    [data]
  );

  const {
    data: dataOther,
    // isFetching: isFetchingOther,
    // hasNextPage: hasNextPageOther,
    // fetchNextPage: fetchNextPageOther,
    // isLoading: isLoadingOther,
    // refetch: refetchOther,
  } = useFetchOtherAlbums({
    user: userId,
    // limit: 10,
    // offset: 0,
  });
  const otherAlbums = useMemo(
    () => (dataOther ? combineFetchVideoPages(dataOther.pages) : []),
    [dataOther]
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
          onLayout={(e) => setFlatListWidth(e.nativeEvent.layout.width)}
          key={`video-library-flat-list-${elemsPerRow}`}
          scrollEventThrottle={0.1}
          data={myVideos}
          numColumns={elemsPerRow}
          renderItem={({ item: videoInfo, index }) => (
            <>
              <VideoCard video={videoInfo} hideAuthor />
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
        />
      </View>

      <View style={oneLineStyle}>
        <BrandText style={fontSemibold20}>Other Videos</BrandText>
      </View>
      <View style={contentGroupStyle}>
        <Animated.FlatList
          onLayout={(e) => setFlatListOthersWidth(e.nativeEvent.layout.width)}
          key={`video-library-others-flat-list-${elemsOthersPerRow}`}
          scrollEventThrottle={0.1}
          data={otherAlbums}
          numColumns={elemsOthersPerRow}
          renderItem={({ item: videoInfo, index }) => (
            <>
              <VideoCard video={videoInfo} />
              {index !== elemsOthersPerRow - 1 && (
                <SpacerRow size={FLAT_LIST_SEPARATOR_WIDTH / 8} />
              )}
            </>
          )}
          onScroll={scrollHandlerOther}
          onEndReachedThreshold={1}
          onEndReached={onEndReachedOther}
          ItemSeparatorComponent={() => <SpacerColumn size={2.5} />}
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
