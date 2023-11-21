import { useIsFocused } from "@react-navigation/native";
import { Video } from "expo-av";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TrashIcon } from "react-native-heroicons/outline";
import { GameContentView } from "./component/GameContentView";
import {
  NFT,
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { OptimizedImage } from "../../components/OptimizedImage";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { NFTBridge } from "../../components/nfts/NFTBridge";
import { minNFTWidth } from "../../components/nfts/NFTs";
import { Separator } from "../../components/separators/Separator";
import { SpacerColumn } from "../../components/spacer";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNFTs } from "../../hooks/useNFTs";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
// import { useAppNavigation } from "../../utils/navigation";
import { getCollectionId, getNetwork } from "../../networks";
import {
  codGrayColor,
  errorColor,
  neutral00,
  neutral33,
  neutral44,
  neutralA3,
  yellowDefault,
} from "../../utils/style/colors";
import {
  fontMedium10,
  fontMedium48,
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
  fontSemibold28,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

// const RIPPER_SLOTS = [0, 1, 2, 3, 4, 5];
// const EMBEDDED_VIDEO_URI ="https://bafybeihfkmpunve47w4avfnuv3mfnsgoqclahpx54zj4b2ypve52iqmxsa.ipfs.nftstorage.link/";
// const embeddedVideoHeight = 267;
// const embeddedVideoWidth = 468;

export const RiotGameBridgeScreen: React.FC = () => {
  const isMobile = useIsMobile();
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const videoRef = React.useRef<Video>(null);
  const isScreenFocused = useIsFocused();
  const [isBridgeApproved, setIsBridgeApproved] = useState(false);
  const [selectedNfts, setSelectedNfts] = useState<NFT[]>([]);
  const network = getNetwork(networkId);

  const ethCollectionId = getCollectionId(
    networkId,
    network?.riotContractAddressGen0,
  );

  const nftReq: Omit<NFTsRequest, "collectionId"> = {
    ownerId: selectedWallet?.userId || "",
    limit: 100,
    offset: 0,
    sort: Sort.SORT_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
    attributes: [],
    isListed: false,
    priceRange: undefined,
  };

  const myBridgeRequest: NFTsRequest = {
    collectionId: ethCollectionId,
    ...nftReq,
  };

  const { nfts } = useNFTs(myBridgeRequest);
  const SideCartWidth = 245 + 10;

  const { height } = useMaxResolution({ isLarge: true });
  const halfGap = layout.spacing_x1;
  const [containerWidth, setContainerWidth] = useState(0);
  const elemsPerRow = Math.floor(containerWidth / minNFTWidth) || 1;
  const elemSize = elemsPerRow
    ? (containerWidth - halfGap * (elemsPerRow - 1) * 2) / elemsPerRow
    : nfts?.length || 0;

  // Stop video when changing screen through react-navigation
  useEffect(() => {
    if (!isScreenFocused && videoRef.current) {
      videoRef.current.pauseAsync();
    }
  }, [isScreenFocused]);
  // Check is the Bridge Is already Approved
  useEffect(() => {
    const get_bridge = false;
    if (get_bridge) {
      setIsBridgeApproved(false);
    }
  }, [isBridgeApproved]);

  // const cartIsShown = useShowCart();
  const { width } = useMaxResolution({
    responsive: true,
    noMargin: false,
    isLarge: true,
  });

  const nftViewStyle = useMemo(() => {
    return {
      width: elemSize,
    };
  }, [elemSize]);

  // Approve
  const approveTheBridge = () => {
    setIsBridgeApproved(true);
  };

  const handleSelectItem = (index: number) => {
    const temp = [...nfts];
    const getSelected = temp.at(index);
    if (getSelected) {
      setSelectedNfts([getSelected]);
    }
  };

  return (
    <GameContentView>
      <View>
        <BrandText
          style={[
            {
              alignSelf: "center",
            },
            isMobile ? fontSemibold28 : fontMedium48,
          ]}
        >
          NFT Bridge
        </BrandText>
      </View>

      <View
        style={{
          justifyContent: "space-around",
          // margin: layout.spacing_x1_5,
          // flexDirection: "row",
          flexWrap: "wrap",
          marginTop: layout.spacing_x4,
        }}
      >
        <View style={[styles.childrenContainer, { width, flex: 1 }]}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <ScrollView
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
                width: width - SideCartWidth,
              }}
            >
              <FlatList
                onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
                style={{ width: "100%" }}
                contentContainerStyle={{ maxHeight: height }}
                columnWrapperStyle={
                  elemsPerRow < 2
                    ? undefined
                    : { flex: 1, justifyContent: "space-between" }
                }
                numColumns={elemsPerRow}
                key={`nft-flat-list-${elemsPerRow}`}
                ItemSeparatorComponent={() => <SpacerColumn size={2} />}
                data={nfts}
                onEndReachedThreshold={4}
                ListEmptyComponent={
                  <BrandText style={fontSemibold20}>
                    No results found.
                  </BrandText>
                }
                renderItem={({ item, index }: { item: NFT; index: number }) => {
                  const selected = selectedNfts.includes(item);
                  return (
                    <>
                      <NFTBridge
                        key={item.id}
                        data={item}
                        style={nftViewStyle}
                        selected={selected}
                        onPress={() => handleSelectItem(index)}
                      />
                    </>
                  );
                }}
              />
            </ScrollView>
            <SideBridge
              style={{
                position: "absolute",
                right: -10,
                flexDirection: "column",
                width: 245,
                marginBottom: layout.spacing_x2_5,
                backgroundColor: neutral00,
                borderRadius: layout.spacing_x2,
                borderColor: neutral33,
                borderWidth: 1,
                paddingVertical: layout.spacing_x1,
                // paddingHorizontal: layout.spacing_x1_5,
                borderStyle: "solid",
              }}
              onApproveTheBridge={() => approveTheBridge()}
              isBridgeApproved={isBridgeApproved}
              selected={selectedNfts}
              setSelected={setSelectedNfts}
            />
          </View>
        </View>
      </View>
    </GameContentView>
  );
};

const SideBridge: React.FC<{
  style?: StyleProp<ViewStyle>;
  onApproveTheBridge: () => void;
  selected: NFT[];
  setSelected: any;
  isBridgeApproved: boolean;
}> = ({
  style,
  onApproveTheBridge,
  selected,
  setSelected,
  isBridgeApproved,
}) => {
  const handleRemoveCartItem = (index: number) => {
    const temp = [...selected];
    temp.splice(index, 1);
    setSelected(temp);
  };
  const handleEmptyCart = () => {
    setSelected([]);
  };
  return (
    <View style={style}>
      {/*Header*/}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          borderStyle: "solid",
          borderBottomColor: neutral44,
          borderWidth: 1,
          marginBottom: 10,
          paddingBottom: 6,
          paddingHorizontal: layout.spacing_x1_5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <BrandText style={fontSemibold14}>Bridge </BrandText>
        </View>
        <BrandText
          style={[
            {
              backgroundColor: "rgba(244, 111, 118, 0.22)",
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 32,
              width: 37,
              height: 18,
              color: errorColor,
              paddingTop: 2.5,
              paddingRight: 6,
              paddingBottom: 2,
              paddingLeft: 6,
            },
            fontMedium10,
          ]}
          onPress={() => handleEmptyCart()}
        >
          Clear
        </BrandText>
      </View>
      {selected ? (
        <View style={{ paddingHorizontal: layout.spacing_x1_5 }}>
          <FlatList
            data={selected}
            ListEmptyComponent={() => {
              return (
                <>
                  <View
                    style={{
                      borderRadius: 8,
                      padding: layout.spacing_x1,
                      marginBottom: layout.spacing_x1,
                      height: 60,
                    }}
                  >
                    None
                  </View>
                </>
              );
            }}
            renderItem={({ item, index }) => {
              return (
                <>
                  <View
                    style={{
                      backgroundColor: codGrayColor,
                      borderRadius: 8,
                      padding: layout.spacing_x1,
                      marginBottom: layout.spacing_x1,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        alignItems: "center",
                        marginBottom: layout.spacing_x0_5,
                      }}
                    >
                      <OptimizedImage
                        sourceURI={item?.imageUri}
                        width={40}
                        height={40}
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 4,
                          marginRight: 6,
                        }}
                      />
                      <BrandText style={fontSemibold12}>{item?.name}</BrandText>
                      <Pressable onPress={() => handleRemoveCartItem(index)}>
                        <TrashIcon size={14} color={neutralA3} />
                      </Pressable>
                    </View>
                  </View>
                </>
              );
            }}
          />
        </View>
      ) : null}
      <Separator />

      {/*Footer*/}
      <View style={{ paddingHorizontal: layout.spacing_x1_5 }}>
        <View style={{ paddingVertical: layout.spacing_x1 }}>
          <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
            Price:
          </BrandText>
        </View>

        <Separator />
        <View
          style={{
            marginTop: layout.spacing_x1,
          }}
        >
          {isBridgeApproved ? (
            <PrimaryButton
              fullWidth={true}
              color={yellowDefault}
              size="SM"
              text="Bridge your NFT"
              disabled={selected.length <= 0}
            />
          ) : (
            <SecondaryButton
              fullWidth
              color={yellowDefault}
              size="SM"
              text="Approve Bridge"
              onPress={onApproveTheBridge}
            />
          )}
        </View>
      </View>
    </View>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colStyles: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
};

// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    flexDirection: "row",
  },
  childrenContainer: {
    height: "100%",
    alignSelf: "center",
  },
});
