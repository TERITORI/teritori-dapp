import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  NativeScrollEvent,
  Image,
} from "react-native";
import { DraxProvider, DraxView } from "react-native-drax";

import teritorriSvg from "../../../assets/icons/networks/teritori.svg";
import {
  Collection,
  CollectionsRequest_Kind,
  NFT,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { useCollections } from "../../components/carousels/CollectionsCarouselSection";
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
import {
  Uint128,
  NftData,
} from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.types";
import { TeritoriNftMinterQueryClient } from "../../contracts-clients/teritori-nft-minter/TeritoriNftMinter.client";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { nftDropedAdjustmentType } from "./RiotersFooterScreen.types";
import { TeritoriNftQueryClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";

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

  const [oldNftPositions, setOldNftPositions] = useState<NftData[]>([]);
  const [oldNftPositionsWithZIndexOrder, setOldNftPositionsWithZIndexOrder] =
    useState<NftData[]>([]);

  const [price, setPrice] = useState<number | undefined>(undefined);

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
  }); // TODO: useCallback mapSize
  const wallet = useSelectedWallet();

  useEffect(() => {
    console.log("nftDroped", nftDroped);

    // const part = nftDroped?.id.split("-");
    // const minterContractAddress = part?.[1];
    // const tokenId = part?.[2];
    // const cosmwasmClient = await getSigningCosmWasmClient();
    // const a = new TeritoriNftMinterQueryClient(
    //   cosmwasmClient,
    //   minterContractAddress
    // );
    // const b = await a.config();
    // const nftContractAdress = b.nft_addr;
  }, [nftDroped]);

  const getFeeConfig = useCallback(async () => {
    if (client) {
      const { fee_per_size } = await client.queryFeeConfig();
      return parseFloat(fee_per_size);
    }
    return 1;
  }, [client]);

  const getFinalPrice = useCallback(async () => {
    if (nftDropedAdjustment && client) {
      const feePerSize = await getFeeConfig();
      setPrice(
        nftDropedAdjustment.width *
          nftDropedAdjustment.height *
          (feePerSize * 0.001)
      );
    }
  }, [nftDropedAdjustment, nftDroped, client, getFeeConfig]);

  useEffect(() => {
    const effect = async () => {
      await getFinalPrice();
    };
    effect();
  }, [nftDropedAdjustment?.width, nftDropedAdjustment?.height, client]);

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

      setMapsize(await rioterFooterClient.queryMapSize());
      setClient(rioterFooterClient);
    };
    effect();
  }, []);

  useEffect(() => {
    const effect = async () => {
      if (!client) {
        return;
      }
      const nftCount = await client.queryNftCount();
      for (let i = 0; i < nftCount; i += 11) {
        const nfts = await client.queryNfts({ from: i, to: i + 10 });
        setOldNftPositions([...oldNftPositions, ...nfts]);
      }
    };
    effect();
  }, [client]);

  const [collections, fetchMoreCollections] = useCollections({
    kind: CollectionsRequest_Kind.KIND_TERITORI_FEATURES,
    limit: 24,
    offset: 0,
  });

  useEffect(() => {
    setOldNftPositionsWithZIndexOrder(
      oldNftPositions.sort(
        (a, b) =>
          JSON.parse(a.additional)?.created_at.getTime() -
          JSON.parse(b.additional)?.created_at.getTime()
      )
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
              oldNftPositionsWithZIndexOrder.map(
                (nft: NftData, index: number) => (
                  <Image
                    key={nft.token_id}
                    source={{ uri: JSON.parse(nft.additional)?.image || "" }}
                    style={[
                      styles.oldNftPositions,
                      {
                        left: nft.position.x,
                        top: nft.position.y,
                        width: nft.position.width,
                        height: nft.position.height,
                        zIndex: index,
                      },
                    ]}
                  />
                )
              )}
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
                  source={{
                    uri: "",
                  }}
                />
              </View>
            )}
          </View>
        </View>
      )}
      {/* ====== "Buy this NFT" three modals*/}
      {/* TODO: Handle these 3 modales with a component, or a hook

      {/* ----- Modal to process payment*/}
      {price !== undefined && (
        <TransactionPaymentModal
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
              {currentCollection?.collectionName}
            </BrandText>
          }
        />
      )}

      {/* ----- Modal with loader, witing for wallet approbation*/}
      <TransactionPendingModal
        operationLabel="Purchase"
        visible={transactionPendingModalVisible}
        onClose={() => setTransactionPendingModalVisible(false)}
      />

      {/* ----- Success modal*/}
      <TransactionSuccessModal
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
            {currentCollection?.collectionName}
          </BrandText>
        }
        onClose={() => setTransactionSuccessModalVisible(false)}
      />
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
