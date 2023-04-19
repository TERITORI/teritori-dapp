import { useQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import {
  StyleProp,
  View,
  ViewStyle,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";

import searchSVG from "../../../assets/icons/search.svg";
import { MintState } from "../../api/marketplace/v1/marketplace";
import { useDropdowns } from "../../context/DropdownsProvider";
import { useNSNameInfo } from "../../hooks/useNSNameInfo";
import { useNSNameOwner } from "../../hooks/useNSNameOwner";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { getCosmosNetwork, getUserId } from "../../networks";
import { selectSearchText, setSearchText } from "../../store/slices/search";
import { useAppDispatch } from "../../store/store";
import { getMarketplaceClient } from "../../utils/backend";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { useAppNavigation } from "../../utils/navigation";
import { neutral17, neutral22, neutralA3 } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { BrandText } from "../BrandText";
import { COLLECTION_VIEW_SM_WIDTH, CollectionView } from "../CollectionView";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";

const resultsMarginLeft = 15;
const inputHeight = 40;

export const SearchBar: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const selectedNetworkId = useSelectedNetworkId();
  const text = useSelector(selectSearchText);
  const { openDropdown, closeOpenedDropdown, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);

  const { data: names } = useQuery(
    ["searchNames", selectedNetworkId, text],
    async () => {
      if (!selectedNetworkId || !text) {
        return [];
      }
      const client = getMarketplaceClient(selectedNetworkId);
      if (!client) {
        return [];
      }
      const reply = await client.SearchNames({
        networkId: selectedNetworkId,
        input: text,
        limit: 12,
      });
      return reply.names;
    },
    {
      staleTime: Infinity,
    }
  );
  const hasNames = !!names?.length;

  const { data: collections } = useQuery(
    ["searchCollections", selectedNetworkId, text],
    async () => {
      if (!selectedNetworkId || !text) {
        return [];
      }
      const client = getMarketplaceClient(selectedNetworkId);
      if (!client) {
        return [];
      }
      const reply = await client.SearchCollections({
        input: text,
        limit: 6,
      });
      return reply.collections;
    },
    {
      staleTime: Infinity,
    }
  );
  const hasCollections = !!collections?.length;

  const hasSomething = hasNames || hasCollections;

  const collectionsMargin = 4;
  const namesMargin = 8;

  return (
    <View
      style={[{ justifyContent: "center", alignItems: "center" }, style]}
      ref={dropdownRef}
    >
      <SearchInput onInteraction={() => openDropdown(dropdownRef)} />
      {isDropdownOpen(dropdownRef) && hasSomething && (
        <TertiaryBox
          noBrokenCorners
          style={{ position: "absolute", top: inputHeight + 4, right: 0 }}
          mainContainerStyle={{
            // make the popup fit 3 collections horizontally
            width:
              3 * COLLECTION_VIEW_SM_WIDTH +
              4 * collectionsMargin +
              2 * resultsMarginLeft +
              2, // need to add 2 arbitrary pixel to fit in tertiary box, not needed if using a view
          }}
        >
          {hasNames && (
            <SearchResultsSection
              title="Teritori Name Service"
              style={{ width: "100%" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  margin: -namesMargin,
                }}
              >
                {(names || []).map((n, index) => (
                  <NameResult
                    key={n}
                    networkId={selectedNetworkId}
                    name={n}
                    style={{ margin: namesMargin }}
                    onPress={closeOpenedDropdown}
                  />
                ))}
              </View>
            </SearchResultsSection>
          )}
          {hasCollections && (
            <SearchResultsSection title="Collections" style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  margin: -collectionsMargin,
                }}
              >
                {(collections || []).map((c, index) => {
                  return (
                    <View key={c.id} style={{ margin: collectionsMargin }}>
                      <CollectionView
                        key={c.id}
                        item={c}
                        size="XS"
                        mintState={MintState.MINT_STATE_UNSPECIFIED}
                        onPress={closeOpenedDropdown}
                      />
                    </View>
                  );
                })}
              </View>
            </SearchResultsSection>
          )}
        </TertiaryBox>
      )}
    </View>
  );
};

const SearchInput: React.FC<{ onInteraction?: () => void }> = ({
  onInteraction,
}) => {
  const text = useSelector(selectSearchText);
  const ref = useRef<TextInput>(null);
  const dispatch = useAppDispatch();
  return (
    <TertiaryBox
      mainContainerStyle={{
        flexDirection: "row",
        paddingHorizontal: 12,
        backgroundColor: neutral17,
        width: 250,
      }}
      height={inputHeight}
    >
      <SVG source={searchSVG} width={16} height={16} />
      <TextInput
        value={text}
        ref={ref}
        style={[
          fontSemibold14,
          {
            color: "white",
            flex: 1,
            marginLeft: 8,
          },
          { outlineStyle: "none" } as any,
        ]}
        onChangeText={(text) => {
          dispatch(setSearchText(text));
          onInteraction && onInteraction();
          setTimeout(() => ref.current?.focus(), 10); // restore focus in case it got lost in previous side-effects, this happens in firefox
        }}
        onFocus={() => {
          onInteraction && onInteraction();
        }}
      />
    </TertiaryBox>
  );
};

const NameResult: React.FC<{
  networkId: string;
  name: string;
  style: StyleProp<ViewStyle>;
  onPress: () => void;
}> = ({ networkId, name, style, onPress }) => {
  const { nameOwner } = useNSNameOwner(networkId, name);
  const { nsInfo } = useNSNameInfo(networkId, name);
  const network = getCosmosNetwork(networkId);
  const navigation = useAppNavigation();
  const content = (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={{
          uri: ipfsURLToHTTPURL(
            nsInfo?.extension.image || network?.nameServiceDefaultImage
          ),
        }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 4,
          marginRight: 10,
          borderWidth: 1,
          borderColor: neutral22,
        }}
      />
      <BrandText style={[fontSemibold12]}>@{name}</BrandText>
    </View>
  );
  return (
    <View style={style}>
      {nameOwner ? (
        <TouchableOpacity
          onPress={() => {
            onPress();
            navigation.navigate("UserPublicProfile", {
              id: getUserId(networkId, nameOwner),
            });
          }}
        >
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
};

const SearchResultsSection: React.FC<{
  title: string;
  style: StyleProp<ViewStyle>;
}> = ({ children, title, style }) => {
  return (
    <View style={style}>
      <View style={{ backgroundColor: neutral22, paddingVertical: 4 }}>
        <BrandText
          style={[
            { marginLeft: resultsMarginLeft, color: neutralA3 },
            fontSemibold12,
          ]}
        >
          {title}
        </BrandText>
      </View>
      <View style={{ padding: resultsMarginLeft }}>{children}</View>
    </View>
  );
};
