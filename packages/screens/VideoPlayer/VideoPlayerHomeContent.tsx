import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import Upload from "../../../assets/icons/upload.svg";
import Logo from "../../../assets/logos/logo.svg";
import { GetVideoListRequest } from "../../api/video/v1/video";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { UploadVideoModal } from "../../components/VideoPlayer/UploadVideoModal";
import { VideoPlayerCard } from "../../components/VideoPlayer/VideoPlayerCard";
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

  const styles = StyleSheet.create({
    container: {
      marginTop: layout.spacing_x3,
      width: "100%",
    },
    oneLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    contentGroup: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: layout.spacing_x3,
      gap: layout.spacing_x2_5,
      marginBottom: 40,
    },
    buttonGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.spacing_x2,
    },
    buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: layout.spacing_x1,
      paddingRight: layout.spacing_x1_5,
      paddingVertical: layout.spacing_x1,
      backgroundColor: "#2B2B33",
      borderRadius: layout.spacing_x4,
      gap: layout.spacing_x1_5,
    },
    buttonText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: primaryColor,
      },
    ]),
    albumGrid: {
      margin: layout.spacing_x3,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.oneLine}>
        <BrandText style={fontSemibold20}>All Videos</BrandText>
        <View style={styles.buttonGroup}>
          <Pressable style={styles.buttonContainer}>
            <SVG
              source={Logo}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <BrandText style={styles.buttonText}>Create funding</BrandText>
          </Pressable>
          <Pressable
            style={styles.buttonContainer}
            onPress={() => setOpenUploadModal(true)}
          >
            <SVG
              source={Upload}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <BrandText style={styles.buttonText}>Upload video</BrandText>
          </Pressable>
        </View>
      </View>
      <View style={styles.contentGroup}>
        <Animated.FlatList
          scrollEventThrottle={0.1}
          data={videos}
          numColumns={4}
          renderItem={({ item: videoInfo }) => (
            <View style={styles.albumGrid}>
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
      <UploadVideoModal
        isVisible={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      />
    </View>
  );
};
