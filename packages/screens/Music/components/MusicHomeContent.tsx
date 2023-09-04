import React, { useState, useEffect, useMemo } from "react";
import { View, Pressable, TextStyle, ViewStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import Upload from "../../../../assets/icons/music-player/upload.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  combineFetchAlbumPages,
  useFetchAlbums,
} from "../../../hooks/musicplayer/useFetchAlbums";
import { neutral30, primaryColor } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  ALBUM_CARD_WIDTH,
  AlbumCard,
} from "../../MusicAlbum/components/AlbumCard";
import { CreateAlbumModal } from "../../MusicAlbum/components/CreateAlbumModal";

const FLAT_LIST_SEPARATOR_WIDTH = 20;
export const MusicHomeContent: React.FC = () => {
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading, refetch } =
    useFetchAlbums({
      limit: 10,
      offset: 0,
    });

  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);
  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);

  const albums = useMemo(
    () => (data ? combineFetchAlbumPages(data.pages) : []),
    [data]
  );
  const [flatListWidth, setFlatListWidth] = useState(0);
  const elemsPerRow =
    Math.floor(
      flatListWidth / (ALBUM_CARD_WIDTH + FLAT_LIST_SEPARATOR_WIDTH)
    ) || 1;

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
        <BrandText style={fontSemibold20}>All Albums</BrandText>
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
            <BrandText style={buttonTextStyle}>Upload album</BrandText>
          </Pressable>

          {/*TODO: Create funding button*/}
        </View>
      </View>
      <View style={contentGroupStyle}>
        <Animated.FlatList
          onLayout={(e) => setFlatListWidth(e.nativeEvent.layout.width)}
          key={`music-home-flat-list-${elemsPerRow}`}
          scrollEventThrottle={0.1}
          data={albums}
          numColumns={elemsPerRow}
          renderItem={({ item: albumInfo, index }) => (
            <>
              <AlbumCard album={albumInfo} />
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
      <CreateAlbumModal
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
