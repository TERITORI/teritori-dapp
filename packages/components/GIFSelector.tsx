import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

import gifSVG from "../../assets/icons/gif.svg";
import { TenorItemType } from "../hooks/tenor/types";
import {
  combineTenorFetchPages,
  useTenorFetchFeatured,
} from "../hooks/tenor/useTenorFetchFeatured";
import { useTenorSearch } from "../hooks/tenor/useTenorSearch";
import { neutral33, neutral67, secondaryColor } from "../utils/style/colors";
import { fontSemibold14 } from "../utils/style/fonts";
import { layout } from "../utils/style/layout";
import { BrandText } from "./BrandText";
import { CircleIconBox } from "./CircleIconBox";
import { SpacerColumn } from "./spacer";

type GIFSelectorProps = {
  disabled?: boolean;
  onGIFSelected?: (GIFurl: string | null) => void;
};

export const GIFSelector: React.FC<GIFSelectorProps> = ({
  onGIFSelected,
  disabled,
}) => {
  // functions
  const [isGIFModalVisible, setIsGIFModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const toggleGIFModal = () => setIsGIFModalVisible(!isGIFModalVisible);
  const {
    data: fetchedData,
    hasNextPage: hasFeaturedNextPage,
    fetchNextPage: fetchFeaturedNextPage,
  } = useTenorFetchFeatured();
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    hasNextPage: hasSearchNextPage,
    fetchNextPage: fetchSearchNextPage,
  } = useTenorSearch({
    searchText,
    enabled: isSearchEnabled,
  });

  const isLoading = isSearchLoading || isSearchFetching;

  const gifs = useMemo(() => {
    if (searchText) {
      return combineTenorFetchPages(searchData?.pages || []);
    }
    return combineTenorFetchPages(fetchedData?.pages || []);
  }, [fetchedData, searchText, searchData]);

  // functions
  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    clearTimeout(timeoutRef.current);
    if (text) {
      timeoutRef.current = setTimeout(() => {
        setIsSearchEnabled(true);
      }, 1000);
    }
  };

  const onEndReached = () => {
    if (searchText) {
      if (hasSearchNextPage) fetchSearchNextPage();
    } else if (hasFeaturedNextPage) fetchFeaturedNextPage();
  };

  const onPressItem = (item: TenorItemType) => {
    toggleGIFModal();
    onGIFSelected && onGIFSelected(item.media_formats["gif"].url);
  };

  // returns
  return (
    <Menu
      opened={isGIFModalVisible}
      onBackdropPress={toggleGIFModal}
      // renderer={renderers.Popover}
      rendererProps={{ placement: "bottom" }}
    >
      <MenuTrigger onPress={() => !disabled && toggleGIFModal}>
        <CircleIconBox
          icon={gifSVG}
          onPress={toggleGIFModal}
          disabled={disabled}
        />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: styles.optionsContainer,
        }}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            onChangeText={handleSearchTextChange}
          />

          <FlatList
            data={gifs}
            ListHeaderComponent={() => (
              <>
                <SpacerColumn size={0.75} />
                <BrandText style={fontSemibold14}>
                  {searchText
                    ? `Search result for '${searchText}'`
                    : "Trending"}
                </BrandText>
                <SpacerColumn size={0.75} />
              </>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            numColumns={4}
            renderItem={({ item }) => (
              <Pressable onPress={() => onPressItem(item)}>
                <Image
                  source={{ uri: item.media_formats["gif"].url }}
                  style={styles.gif}
                />
              </Pressable>
            )}
            ListFooterComponent={
              isLoading
                ? () => <ActivityIndicator color={secondaryColor} />
                : null
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
          />
        </View>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: neutral67,
    borderWidth: 1,
    borderColor: neutral33,
    paddingHorizontal: layout.padding_x1,
    paddingVertical: layout.padding_x1_5,
    width: 308,
    height: 300,
    borderRadius: 10,
  },

  input: {
    backgroundColor: neutral33,
    width: "100%",
    paddingVertical: layout.padding_x0_5,
    paddingLeft: layout.padding_x1_5,
    color: secondaryColor,
    borderRadius: 3,
  },
  gif: {
    width: 65,
    height: 65,
    margin: layout.padding_x0_5,
  },
  optionsContainer: {
    marginTop: 44,
    backgroundColor: "transparent",
    marginLeft: -134,
  },
});
