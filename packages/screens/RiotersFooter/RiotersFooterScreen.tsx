import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  Image,
} from "react-native";
import { DraxProvider, DraxView } from "react-native-drax";

import teritorriSvg from "../../../assets/icons/teritori.svg";
import apeOneSvg from "../../../assets/nft/ape-one.svg";
import etherumGangSvg from "../../../assets/nft/etherum-gang.svg";
import freeSnowDenSvg from "../../../assets/nft/free-snowden.svg";
import notACrimeSvg from "../../../assets/nft/not-a-crime.svg";
import privacySvg from "../../../assets/nft/privacy.svg";
import rideOrDieSvg from "../../../assets/nft/ride-or-die.svg";
import satoshiSvg from "../../../assets/nft/satoshi.svg";
import solFarmSvg from "../../../assets/nft/sol-farm.svg";
import {
  Collection,
  CollectionsRequest_Kind,
  NFT,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { useCollections } from "../../components/CollectionsCarouselSection";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { TransactionPaymentModal } from "../../components/modals/transaction/TransactionPaymentModal";
import { TransactionPendingModal } from "../../components/modals/transaction/TransactionPendingModal";
import { TransactionSuccessModal } from "../../components/modals/transaction/TransactionSuccessModal";
import DraxViewReceiverContent from "../../components/riotersFooter/DraxViewReceiverContent";
import ExistingNftType from "../../components/riotersFooter/ExistingNftType";
import NewNftType from "../../components/riotersFooter/NewNftType";
import NftAdjustments from "../../components/riotersFooter/NftAdjustments";
import NftTypeTab from "../../components/riotersFooter/NftTypeTab";
import SelectNewNft from "../../components/riotersFooter/SelectedNewNft";
import { RioterFooterNftClient } from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.client";
import { Uint128 } from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.types";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { neutral33 } from "../../utils/style/colors";
import { nftDropedAdjustmentType } from "./RiotersFooterScreen.types";

const oldNftPositions = [
  {
    id: "0",
    svg: apeOneSvg,
    width: 74,
    height: 74,
    top: 388,
    left: 0,
    date: new Date("August 15, 2022 15:00:00"),
  },
  {
    id: "1",
    svg: etherumGangSvg,
    width: 74,
    height: 43,
    top: 229,
    left: 478,
    date: new Date("August 16, 2022 15:00:00"),
  },
  {
    id: "2",
    svg: freeSnowDenSvg,
    width: 114,
    height: 77,
    top: 415,
    left: 575,
    date: new Date("August 17, 2022 15:00:00"),
  },
  {
    id: "3",
    svg: notACrimeSvg,
    width: 130,
    height: 72,
    top: 279,
    left: 654,
    date: new Date("August 18, 2022 15:00:00"),
  },
  {
    id: "4",
    svg: rideOrDieSvg,
    width: 40,
    height: 36,
    top: 289,
    left: 38,
    date: new Date("August 19, 2022 15:00:00"),
  },
  {
    id: "5",
    svg: satoshiSvg,
    width: 56,
    height: 59,
    top: 333,
    left: 446,
    date: new Date("August 20, 2022 15:00:00"),
  },
  {
    id: "6",
    svg: solFarmSvg,
    width: 82,
    height: 82,
    top: 253,
    left: 174,
    date: new Date("August 21, 2022 15:00:00"),
  },
  {
    id: "7",
    svg: apeOneSvg,
    width: 74,
    height: 74,
    top: 388,
    left: 747,
    date: new Date("August 22, 2022 15:00:00"),
  },
  {
    id: "8",
    svg: solFarmSvg,
    width: 82,
    height: 82,
    top: 253,
    left: 922,
    date: new Date("August 23, 2022 15:00:00"),
  },
  {
    id: "9",
    svg: privacySvg,
    width: 148,
    height: 100,
    top: 396,
    left: 159,
    date: new Date("August 24, 2022 15:00:00"),
  },
  {
    id: "10",
    svg: privacySvg,
    width: 148,
    height: 100,
    top: 396,
    left: 850,
    date: new Date("August 25, 2022 15:00:00"),
  },
];

export const RiotersFooterScreen: React.FC = () => {
  const [tabName, setTabName] = useState<string>("New");
  const [searchNewNftCollection, setSearchNewNftCollection] =
    useState<string>("");
  const [searchNft, setSearchNft] = useState<string>("");
  const [nftCollectionId, setNftCollectionId] = useState<string>("");
  const [currentCollection, setCurrentCollection] = useState<
    Collection | undefined
  >(undefined);
  const [nftDroped, setNftDroped] = useState<NFT | undefined>(undefined);
  const [nftDropedAdjustment, setNftDropedAdjustment] = useState<
    nftDropedAdjustmentType | undefined
  >(undefined);
  const [oldNftPositionsWithZIndexOrder, setOldNftPositionsWithZIndexOrder] =
    useState<any | undefined>(undefined);
  const [price, setPrice] = useState<number>(7.8);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const [transactionPaymentModalVisible, setTransactionPaymentModalVisible] =
    useState(false);
  const [transactionPendingModalVisible, setTransactionPendingModalVisible] =
    useState(false);
  const [transactionSuccessModalVisible, setTransactionSuccessModalVisible] =
    useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactionHash, setTransactionHash] = useState("");
  const [client, setClient] = useState<RioterFooterNftClient | undefined>(
    undefined
  );
  const [mapSize, setMapsize] = useState<{ height: Uint128; width: Uint128 }>({
    height: "552",
    width: "1030",
  });
  const wallet = useSelectedWallet();

  useEffect(() => {
    const effect = async () => {
      if (!wallet?.publicKey) {
        return;
      }
      const cosmwasmClient = await getSigningCosmWasmClient();

      const rioterFooterClient = new RioterFooterNftClient(
        cosmwasmClient,
        wallet?.publicKey,
        "tori1xfxjrxhgjqtvfcmfemu89lxftf0fq4hxz7vcg9shgczta26nt4lqefstyc"
      );
      await rioterFooterClient.updateMapSize({ height: "552", width: "1030" });

      setMapsize(await rioterFooterClient.queryMapSize());
      setClient(rioterFooterClient);
    };
    effect();
  }, []);

  const [collections, fetchMoreCollections] = useCollections({
    kind: CollectionsRequest_Kind.KIND_BY_VOLUME,
    limit: 24,
    offset: 0,
  });

  useEffect(() => {
    setOldNftPositionsWithZIndexOrder(
      oldNftPositions.sort((a, b) => a.date.getTime() - b.date.getTime())
    );
  }, [oldNftPositions]);

  useEffect(() => {
    const current: Collection | undefined = collections.find(
      (collection) => collection.id === nftCollectionId
    );
    setCurrentCollection(current);
  }, [nftCollectionId]);

  const MapNftType = new Map([
    [
      "New",
      <NewNftType
        searchNewNftCollection={searchNewNftCollection}
        setSearchNewNftCollection={setSearchNewNftCollection}
        setNftCollectionId={setNftCollectionId}
        newNftCollections={collections}
      />,
    ],
    ["Existing", <ExistingNftType />],
  ]);

  const handleBuy = useCallback(() => {
    console.log("buy");
    setTransactionPaymentModalVisible(false);
    setTransactionPendingModalVisible(true);
    setTimeout(() => {
      setTransactionPendingModalVisible(false);
      setTransactionSuccessModalVisible(true);
    }, 3000);
  }, []);

  const isCloseToBottom = useCallback(
    ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
      const paddingToBottom = 60;
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    },
    []
  );

  const renderContent = useCallback(
    () =>
      oldNftPositionsWithZIndexOrder && (
        <DraxViewReceiverContent
          oldNftPositionsWithZIndexOrder={oldNftPositionsWithZIndexOrder}
          nftDroped={nftDroped}
          setNftDropedAdjustment={setNftDropedAdjustment}
          nftDropedAdjustment={nftDropedAdjustment}
        />
      ),
    [oldNftPositionsWithZIndexOrder, nftDroped, nftDropedAdjustment]
  );

  const onReceiveDragDrop = useCallback(
    (event) => {
      const nft: NFT = JSON.parse(event.dragged.payload);
      if (
        !nftDroped ||
        (nftDroped && nftDroped.name === event.dragged.payload)
      ) {
        if (!nftDroped) {
          setNftDroped(nft);
        }
      }
      setNftDropedAdjustment({
        width: 104,
        height: 104,
        borderRadius: 0,
        ...nftDropedAdjustment,
        x: event.receiver.receiveOffset.x - event.dragged.grabOffset.x,
        y: event.receiver.receiveOffset.y - event.dragged.grabOffset.y,
      });
    },
    [nftDroped, nftDropedAdjustment]
  );

  return (
    <ScreenContainer hideSidebar={isPreview}>
      {!isPreview ? (
        <DraxProvider>
          <View style={styles.container}>
            <View style={styles.menu}>
              {!nftCollectionId ? (
                <>
                  <View style={{ width: 220 }}>
                    <BrandText style={{ color: "white", fontSize: 14 }}>
                      NFT type for the Rioters’ Footer
                    </BrandText>
                    <NftTypeTab tabName={tabName} setTabName={setTabName} />
                    <View style={styles.separator} />
                  </View>
                  <ScrollView
                    onScroll={({ nativeEvent }) => {
                      if (tabName === "New" && isCloseToBottom(nativeEvent)) {
                        fetchMoreCollections(24);
                      }
                    }}
                    scrollEventThrottle={16}
                  >
                    <View style={{ width: 220 }}>
                      {MapNftType.get(tabName)}
                    </View>
                  </ScrollView>
                </>
              ) : nftDroped && nftDropedAdjustment && currentCollection ? (
                <NftAdjustments
                  nftDroped={nftDroped}
                  setNftDroped={setNftDroped}
                  nftDropedAdjustment={nftDropedAdjustment}
                  setNftDropedAdjustment={setNftDropedAdjustment}
                  price={price}
                  setPrice={setPrice}
                  setTransactionPaymentModalVisible={
                    setTransactionPaymentModalVisible
                  }
                  currentCollection={currentCollection}
                />
              ) : (
                currentCollection && (
                  <SelectNewNft
                    nftCollectionId={nftCollectionId}
                    setNftCollectionId={setNftCollectionId}
                    searchNft={searchNft}
                    setSearchNft={setSearchNft}
                    currentCollection={currentCollection}
                  />
                )
              )}
            </View>
            <View style={{ width: "100%" }}>
              <View style={styles.headerChosePosition}>
                <BrandText
                  style={{ color: "white", fontSize: 28, marginLeft: 20 }}
                >
                  Choose the exact position in footer
                </BrandText>
                <View style={{ marginRight: 124 }}>
                  <SecondaryButton
                    text="Preview"
                    onPress={() => {
                      setIsPreview(true);
                    }}
                    width={126}
                    size="M"
                  />
                </View>
              </View>
              <DraxView
                style={[
                  styles.chosePositionContainer,
                  {
                    height: parseInt(mapSize.height, 10),
                    width: parseInt(mapSize.width, 10),
                  },
                ]}
                onReceiveDragDrop={onReceiveDragDrop}
                renderContent={renderContent}
              />
            </View>
          </View>
        </DraxProvider>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ top: 20, right: 0, position: "absolute" }}>
            <SecondaryButton
              text="Exit Preview"
              onPress={() => {
                setIsPreview(false);
              }}
              width={126}
              size="M"
            />
          </View>
          <View
            style={[
              styles.chosePositionContainer,
              {
                height: parseInt(mapSize.height, 10),
                width: parseInt(mapSize.width, 10),
                marginTop: 100,
              },
            ]}
          >
            <SVG
              width={94}
              height={102}
              source={teritorriSvg}
              style={{
                alignSelf: "center",
                marginTop: 43,
                zIndex: (oldNftPositionsWithZIndexOrder?.length || 0) + 3,
              }}
            />
            {oldNftPositionsWithZIndexOrder &&
              oldNftPositionsWithZIndexOrder.map((nft: any, index: number) => (
                <SVG
                  key={nft.id}
                  width={nft.width}
                  height={nft.height}
                  source={nft.svg}
                  style={[
                    styles.oldNftPositions,
                    {
                      left: nft.left,
                      top: nft.top,
                      zIndex: index,
                    },
                  ]}
                />
              ))}
            {nftDroped && nftDropedAdjustment && (
              <View
                style={{
                  position: "absolute",
                  left: nftDropedAdjustment.x,
                  top: nftDropedAdjustment.y,
                  zIndex: oldNftPositionsWithZIndexOrder.length,
                }}
              >
                <Image
                  style={{
                    width: nftDropedAdjustment.width,
                    height: nftDropedAdjustment.height,
                    borderRadius: nftDropedAdjustment.borderRadius,
                  }}
                  source={{ uri: nftDroped.imageUri }}
                />
              </View>
            )}
          </View>
        </View>
      )}
      {/* ====== "Buy this NFT" three modals*/}
      {/* TODO: Handle these 3 modales with a component, or a hook

      {/* ----- Modal to process payment*/}
      {/* <TransactionPaymentModal
        onPressProceed={handleBuy}
        onClose={() => setTransactionPaymentModalVisible(false)}
        visible={transactionPaymentModalVisible}
        price={price.toString()}
        // priceDenom={nftInfo?.priceDenom}
        label="Checkout"
        textComponent={
          <BrandText style={fontSemibold14}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              You are about to purchase a{" "}
            </BrandText>
            {nftDroped?.name}
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {" "}
              from{" "}
            </BrandText>
            {currentCollection?.name}
          </BrandText>
        }
      /> */}

      {/* ----- Modal with loader, witing for wallet approbation*/}
      {/* <TransactionPendingModal
        operationLabel="Purchase"
        visible={transactionPendingModalVisible}
        onClose={() => setTransactionPendingModalVisible(false)}
      /> */}

      {/* ----- Success modal*/}
      {/* <TransactionSuccessModal
        transactionHash={transactionHash}
        visible={transactionSuccessModalVisible}
        textComponent={
          <BrandText style={fontSemibold14}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              You successfully purchased{" "}
            </BrandText>
            {nftDroped?.name}
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {" "}
              from{" "}
            </BrandText>
            {currentCollection?.name}
          </BrandText>
        }
        onClose={() => setTransactionSuccessModalVisible(false)}
      />  */}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginLeft: -110,
    width: "100%",
  },
  menu: {
    width: 240,
    paddingTop: 24,
    borderRightWidth: 1,
    borderColor: neutral33,
  },
  separator: { height: 1, backgroundColor: neutral33, marginTop: 16 },
  headerChosePosition: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    width: "100%",
  },
  chosePositionContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: neutral33,
    backgroundColor: "black",
    alignSelf: "center",
    overflow: "hidden",
  },
  oldNftPositions: {
    position: "absolute",
    borderWidth: 0,
    padding: 4,
  },
});
