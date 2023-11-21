import { useIsFocused } from "@react-navigation/native";
import { Video } from "expo-av";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View, ViewStyle, StyleProp, useWindowDimensions } from "react-native";

import { GameContentView } from "./component/GameContentView";
import trashSVG from "../../../assets/icons/trash.svg";
import {
  NFT,
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import FlexRow from "../../components/FlexRow";
import { OptimizedImage } from "../../components/OptimizedImage";
import { SVG } from "../../components/SVG";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { NFTBridge } from "../../components/nfts/NFTBridge";
import { Separator } from "../../components/separators/Separator";
import { SpacerColumn } from "../../components/spacer";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useNFTs } from "../../hooks/useNFTs";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
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
  fontMedium32,
  fontMedium48,
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const RiotGameBridgeScreen: React.FC = () => {
  const {width} = useWindowDimensions();
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
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

  const { nfts: data, isLoading } = useNFTs(myBridgeRequest);

  const nfts = [...data, ...data, ...data, ...data, ...data, ...data];

  // Check is the Bridge Is already Approved
  useEffect(() => {
    const get_bridge = false;
    if (get_bridge) {
      setIsBridgeApproved(false);
    }
  }, [isBridgeApproved]);

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

  const BREAK_POINT = 600;
  const shouldRestructure = width < 600;

  return (
    <GameContentView hideStats>
      <View
        style={{
          marginTop: layout.spacing_x4,
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <BrandText style={[shouldRestructure ? fontMedium32 : fontMedium48]}>
          NFT Bridge
        </BrandText>

        <FlexRow
          style={{ marginTop: layout.spacing_x4, alignItems: "flex-start" }}
          breakpoint={BREAK_POINT}
        >
          <View style={{ flexGrow: 1, marginBottom: layout.spacing_x2 }}>
            <FlatList
              style={{ height: shouldRestructure ? 400 : 600 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              numColumns={width < 960 ? 1 : 3}
              ItemSeparatorComponent={() => <SpacerColumn size={2} />}
              data={nfts}
              ListEmptyComponent={
                <BrandText style={fontSemibold20}>
                  {isLoading ? "Loading ..." : "No results found"}
                </BrandText>
              }
              renderItem={({ item, index }: { item: NFT; index: number }) => {
                const selected = selectedNfts.includes(item);
                return (
                  <View
                    style={{
                      marginHorizontal: layout.spacing_x1,
                    }}
                  >
                    <NFTBridge
                      key={item.id}
                      data={item}
                      selected={selected}
                      onPress={() => handleSelectItem(index)}
                    />
                  </View>
                );
              }}
            />
          </View>

          <SideBridge
            style={{
              width: 245,
              backgroundColor: neutral00,
              borderRadius: layout.spacing_x2,
              borderColor: neutral33,
              borderWidth: 1,
              paddingVertical: layout.spacing_x1,
              marginHorizontal: layout.spacing_x4,
            }}
            onApproveTheBridge={() => approveTheBridge()}
            isBridgeApproved={isBridgeApproved}
            selected={selectedNfts}
            setSelected={setSelectedNfts}
          />
        </FlexRow>
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
                        <SVG source={trashSVG} color={neutralA3} width={14} />
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
              fullWidth
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
