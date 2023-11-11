import React, { useState } from "react";
import { View, ViewStyle, TextStyle } from "react-native";

import { UploadMusicButton } from "./UploadMusicButton";
import { UploadMusicModal } from "./UploadMusicModal";
import { BrandText } from "../../../components/BrandText";
import { neutral30, primaryColor } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

// const FLAT_LIST_SEPARATOR_WIDTH = 20;
export const MusicMyLibraryContent: React.FC = () => {
  // const { data: libraryIds } = useFetchLibraryIds();
  // const libraryIdList = useMemo(
  //   () => (libraryIds ? libraryIds : []),
  //   [libraryIds]
  // );
  // const isLoadingValue = useSharedValue(false);
  // const isGoingUp = useSharedValue(false);
  //
  // const isLoadingValueOther = useSharedValue(false);
  // const isGoingUpOther = useSharedValue(false);
  //
  // const selectedNetworkId = useSelectedNetworkId();
  // const wallet = useSelectedWallet();
  // const userId = getUserId(selectedNetworkId, wallet?.address);
  //
  // const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  // const { data, isFetching, hasNextPage, fetchNextPage, isLoading, refetch } =
  //   useFetchUserAlbums({
  //     limit: 10,
  //     offset: 0,
  //     createdBy: userId,
  //   });
  //
  // const albums = useMemo(
  //   () => (data ? combineFetchAlbumPages(data.pages) : []),
  //   [data]
  // );
  //
  // const {
  //   data: dataOther,
  //   isFetching: isFetchingOther,
  //   hasNextPage: hasNextPageOther,
  //   fetchNextPage: fetchNextPageOther,
  //   isLoading: isLoadingOther,
  //   refetch: refetchOther,
  // } = useFetchOtherAlbums({
  //   limit: 10,
  //   offset: 0,
  //   idList: libraryIdList,
  // });
  // const otherAlbums = useMemo(
  //   () => (dataOther ? combineFetchAlbumPagesOther(dataOther.pages) : []),
  //   [dataOther]
  // );
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  // const [flatListWidth, setFlatListWidth] = useState(0);
  // const [flatListOthersWidth, setFlatListOthersWidth] = useState(0);
  // const elemsPerRow =
  //   Math.floor(
  //     flatListWidth / (ALBUM_CARD_WIDTH + FLAT_LIST_SEPARATOR_WIDTH)
  //   ) || 1;
  // const elemsOthersPerRow =
  //   Math.floor(
  //     flatListOthersWidth / (ALBUM_CARD_WIDTH + FLAT_LIST_SEPARATOR_WIDTH)
  //   ) || 1;
  //
  // useEffect(() => {
  //   if (isFetching || isLoading) {
  //     isGoingUp.value = false;
  //     isLoadingValue.value = true;
  //   } else {
  //     isLoadingValue.value = false;
  //   }
  // }, [isFetching, isLoading, isGoingUp, isLoadingValue]);
  //
  // useEffect(() => {
  //   if (isFetchingOther || isLoadingOther) {
  //     isGoingUpOther.value = false;
  //     isLoadingValueOther.value = true;
  //   } else {
  //     isLoadingValueOther.value = false;
  //   }
  // }, [isFetchingOther, isLoadingOther, isGoingUpOther, isLoadingValueOther]);
  //
  // const scrollHandler = useAnimatedScrollHandler({
  //   onScroll: (event) => {
  //     setFlatListContentOffsetY(event.contentOffset.y);
  //     if (flatListContentOffsetY > event.contentOffset.y) {
  //       isGoingUp.value = true;
  //     } else if (flatListContentOffsetY < event.contentOffset.y) {
  //       isGoingUp.value = false;
  //     }
  //     setFlatListContentOffsetY(event.contentOffset.y);
  //   },
  // });
  //
  // const scrollHandlerOther = useAnimatedScrollHandler({
  //   onScroll: (event) => {
  //     setFlatListContentOffsetY(event.contentOffset.y);
  //     if (flatListContentOffsetY > event.contentOffset.y) {
  //       isGoingUpOther.value = true;
  //     } else if (flatListContentOffsetY < event.contentOffset.y) {
  //       isGoingUpOther.value = false;
  //     }
  //     setFlatListContentOffsetY(event.contentOffset.y);
  //   },
  // });
  //
  // const onEndReached = () => {
  //   if (!isLoading && hasNextPage && !isFetching) {
  //     fetchNextPage();
  //   }
  // };
  //
  // const onEndReachedOther = () => {
  //   if (!isLoadingOther && hasNextPageOther && !isFetchingOther) {
  //     fetchNextPageOther();
  //   }
  // };

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
        {/*<Animated.FlatList*/}
        {/*  onLayout={(e) => setFlatListWidth(e.nativeEvent.layout.width)}*/}
        {/*  key={`music-library-flat-list-${elemsPerRow}`}*/}
        {/*  scrollEventThrottle={0.1}*/}
        {/*  data={albums}*/}
        {/*  numColumns={elemsPerRow}*/}
        {/*  renderItem={({ item: albumInfo, index }) => (*/}
        {/*    <>*/}
        {/*      <AlbumCard album={albumInfo} hideAuthor />*/}
        {/*      {index !== elemsPerRow - 1 && (*/}
        {/*        <SpacerRow size={FLAT_LIST_SEPARATOR_WIDTH / 8} />*/}
        {/*      )}*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*  onScroll={scrollHandler}*/}
        {/*  onEndReachedThreshold={1}*/}
        {/*  onEndReached={onEndReached}*/}
        {/*  ItemSeparatorComponent={() => (*/}
        {/*    <SpacerColumn size={FLAT_LIST_SEPARATOR_WIDTH / 8} />*/}
        {/*  )}*/}
        {/*/>*/}
      </View>

      <View style={oneLineStyle}>
        <BrandText style={fontSemibold20}>Other Music</BrandText>
      </View>
      <View style={contentGroupStyle}>
        {/*<Animated.FlatList*/}
        {/*  onLayout={(e) => setFlatListOthersWidth(e.nativeEvent.layout.width)}*/}
        {/*  key={`music-library-others-flat-list-${elemsOthersPerRow}`}*/}
        {/*  scrollEventThrottle={0.1}*/}
        {/*  data={otherAlbums}*/}
        {/*  numColumns={elemsOthersPerRow}*/}
        {/*  renderItem={({ item: albumInfo, index }) => (*/}
        {/*    <>*/}
        {/*      <AlbumCard album={albumInfo} />*/}
        {/*      {index !== elemsOthersPerRow - 1 && (*/}
        {/*        <SpacerRow size={FLAT_LIST_SEPARATOR_WIDTH / 8} />*/}
        {/*      )}*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*  onScroll={scrollHandlerOther}*/}
        {/*  onEndReachedThreshold={1}*/}
        {/*  onEndReached={onEndReachedOther}*/}
        {/*  ItemSeparatorComponent={() => (*/}
        {/*    <SpacerColumn size={FLAT_LIST_SEPARATOR_WIDTH / 8} />*/}
        {/*  )}*/}
        {/*/>*/}
      </View>

      <UploadMusicModal
        isVisible={openUploadModal}
        onClose={() => {
          setOpenUploadModal(false);
          // refetch();
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
// const buttonContainerStyle: ViewStyle = {
//   flexDirection: "row",
//   alignItems: "center",
//   paddingLeft: layout.spacing_x1,
//   paddingRight: layout.spacing_x1_5,
//   paddingVertical: layout.spacing_x1,
//   backgroundColor: neutral30,
//   borderRadius: layout.spacing_x4,
// };
// const buttonTextStyle: TextStyle = {
//   ...fontSemibold14,
//
//   color: primaryColor,
// };
