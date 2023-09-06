import React, { useState, useMemo, useEffect } from "react";
import { View, Pressable, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import Logo from "../../../../assets/logos/logo.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  combineFetchAlbumPages as combineFetchAlbumPagesOther,
  useOtherFetchAlbum,
} from "../../../hooks/musicplayer/useOtherFetchAlbum";
import {
  combineFetchAlbumPages,
  useUserFetchAlbum,
} from "../../../hooks/musicplayer/useUserFetchAlbum";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { neutral30, primaryColor } from "../../../utils/style/colors";
import { fontSemibold20, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { AlbumCard } from "../../MusicAlbum/components/AlbumCard";
import { UploadAlbumModal } from "../../MusicAlbum/components/UploadAlbumModal";

const numColumns = 5;
export const MusicMyLibraryContent: React.FC<{ idList: string[] }> = ({
  idList,
}) => {
  const isLoadingValue = useSharedValue(false);
  const isGoingUp = useSharedValue(false);

  const isLoadingValueOther = useSharedValue(false);
  const isGoingUpOther = useSharedValue(false);

  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, wallet?.address);

  const [flatListContentOffsetY, setFlatListContentOffsetY] = useState(0);
  const { data, isFetching, hasNextPage, fetchNextPage, isLoading } =
    useUserFetchAlbum({
      limit: 10,
      offset: 0,
      createdBy: userId,
    });

  const albums = useMemo(
    () => (data ? combineFetchAlbumPages(data.pages) : []),
    [data]
  );

  const {
    data: dataOther,
    isFetching: isFetchingOther,
    hasNextPage: hasNextPageOther,
    fetchNextPage: fetchNextPageOther,
    isLoading: isLoadingOther,
  } = useOtherFetchAlbum({
    limit: 10,
    offset: 0,
    idList,
  });
  const otherAlbums = useMemo(
    () => (dataOther ? combineFetchAlbumPagesOther(dataOther.pages) : []),
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

  useEffect(() => {
    if (isFetchingOther || isLoadingOther) {
      isGoingUpOther.value = false;
      isLoadingValueOther.value = true;
    } else {
      isLoadingValueOther.value = false;
    }
  }, [isFetchingOther, isLoadingOther, isGoingUpOther, isLoadingValueOther]);

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

  const onEndReachedOther = () => {
    if (!isLoadingOther && hasNextPageOther && !isFetchingOther) {
      fetchNextPageOther();
    }
  };

  return (
    <View style={containerStyle}>
      <View style={oneLineStyle}>
        <BrandText style={fontSemibold20}>My Albums</BrandText>
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
            <BrandText style={buttonTextStyle}>Upload album</BrandText>
          </Pressable>
          {/*<SpacerRow size={2}/>*/}
          {/* <Pressable style={buttonContainer}>
            <SVG
              source={Logo}
              width={layout.spacing_x2}
              height={layout.spacing_x2}
            />
            <SpacerRow size={1.5}/>
            <BrandText style={buttonText}>Create funding</BrandText>
          </Pressable> */}
        </View>
      </View>
      <View style={contentGroupStyle}>
        <Animated.FlatList
          scrollEventThrottle={0.1}
          data={albums}
          numColumns={numColumns}
          renderItem={({ item: albumInfo, index }) => (
            <>
              <AlbumCard album={albumInfo} hasLibrary />
              {index !== numColumns - 1 && <SpacerRow size={2.5} />}
            </>
          )}
          onScroll={scrollHandler}
          onEndReachedThreshold={1}
          onEndReached={onEndReached}
          ItemSeparatorComponent={() => <SpacerColumn size={2.5} />}
        />
      </View>

      <View style={oneLineStyle}>
        <BrandText style={fontSemibold20}>Other Albums</BrandText>
      </View>
      <View style={contentGroupStyle}>
        <Animated.FlatList
          scrollEventThrottle={0.1}
          data={otherAlbums}
          numColumns={numColumns}
          renderItem={({ item: albumInfo, index }) => (
            <>
              <AlbumCard album={albumInfo} hasLibrary />
              {index !== numColumns - 1 && <SpacerRow size={2.5} />}
            </>
          )}
          onScroll={scrollHandlerOther}
          onEndReachedThreshold={1}
          onEndReached={onEndReachedOther}
          ItemSeparatorComponent={() => <SpacerColumn size={2.5} />}
        />
      </View>
      <UploadAlbumModal
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
  backgroundColor: neutral30,
  borderRadius: layout.spacing_x4,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,

  color: primaryColor,
};
