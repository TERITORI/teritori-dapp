import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import Logo from "../../../assets/logos/logo.svg";
import { GetAllAlbumListRequest } from "../../api/musicplayer/v1/musicplayer";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { MusicPlayerCard } from "../../components/mediaPlayer/MusicPlayerCard";
import { UploadAlbumModal } from "../../components/mediaPlayer/UploadAlbumModal";
import {
  combineFetchAlbumPages,
  useFetchAlbums,
} from "../../hooks/musicplayer/useFetchAlbums";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
interface MusicPlayerProps {
  req: GetAllAlbumListRequest;
  idList: string[];
}

export const MusicPlayerHomeContent: React.FC<MusicPlayerProps> = ({
  req,
  idList,
}) => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    useFetchAlbums(req);

  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);

  const albums = useMemo(
    () => (data ? combineFetchAlbumPages(data.pages) : []),
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
    <View style={styles.container}>
      <View style={styles.oneLine}>
        <BrandText style={fontSemibold20}>All Albums</BrandText>
        <View style={styles.buttonGroup}>
          <Pressable
            style={styles.buttonContainer}
            onPress={() => setOpenUploadModal(true)}
          >
            <SVG
              source={Logo}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.buttonText}>Upload album</BrandText>
          </Pressable>
          {/* <Pressable style={styles.buttonContainer}>
            <SVG
              source={Logo}
              width={layout.padding_x2}
              height={layout.padding_x2}
            />
            <BrandText style={styles.buttonText}>Create funding</BrandText>
          </Pressable> */}
        </View>
      </View>
      <View style={styles.contentGroup}>
        <Animated.FlatList
          scrollEventThrottle={0.1}
          data={albums}
          numColumns={4}
          renderItem={({ item: albumInfo }) => (
            <View style={styles.albumGrid}>
              <MusicPlayerCard
                album={albumInfo}
                hasLibrary={
                  idList.findIndex((item) => item === albumInfo.id) !== -1
                }
              />
            </View>
          )}
          onScroll={scrollHandler}
          onEndReachedThreshold={1}
          onEndReached={onEndReached}
        />
      </View>
      <UploadAlbumModal
        isVisible={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: layout.padding_x3,
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
    marginTop: layout.padding_x3,
    gap: layout.padding_x2_5,
    marginBottom: 40,
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x2,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: layout.padding_x1,
    paddingRight: layout.padding_x1_5,
    paddingVertical: layout.padding_x1,
    backgroundColor: "#2B2B33",
    borderRadius: layout.padding_x4,
    gap: layout.padding_x1_5,
  },
  buttonText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: primaryColor,
    },
  ]),
  albumGrid: {
    margin: layout.padding_x3,
  },
});
