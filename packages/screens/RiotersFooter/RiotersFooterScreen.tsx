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
  MintState,
  NFT,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
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
import {
  RioterFooterNftClient,
  RioterFooterNftQueryClient,
} from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.client";
import { Uint128 } from "../../contracts-clients/rioter-footer-nft/RioterFooterNft.types";
import { TeritoriBunkerMinterQueryClient } from "../../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNftQueryClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import { useCollections } from "../../hooks/useCollections";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getCosmosNetwork,
  getKeplrSigningCosmWasmClient,
  mustGetNonSigningCosmWasmClient,
  parseNftId,
} from "../../networks";
import { ipfsURLToHTTPURL } from "../../utils/ipfs";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { NFTDropedAdjustmentType, FooterNftData } from "../../utils/types/nft";

export const RiotersFooterScreen: React.FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
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
    NFTDropedAdjustmentType | undefined
  >(undefined);

  const [oldNftPositions, setOldNftPositions] = useState<FooterNftData[]>([]);

  const [price, setPrice] = useState<number | undefined>(undefined);

  const [isPreview, setIsPreview] = useState<boolean>(false);

  const [transactionPaymentModalVisible, setTransactionPaymentModalVisible] =
    useState(false);
  const [transactionPendingModalVisible, setTransactionPendingModalVisible] =
    useState(false);
  const [transactionSuccessModalVisible, setTransactionSuccessModalVisible] =
    useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [client, setClient] = useState<RioterFooterNftQueryClient | undefined>(
    undefined,
  );
  const [mapSize, setMapsize] = useState<{ height: Uint128; width: Uint128 }>({
    height: "552",
    width: "1030",
  });

  const wallet = useSelectedWallet();

  const getFeeConfig = useCallback(async () => {
    if (client) {
      const { fee_per_size } = await client.queryFeeConfig();
      return parseFloat(fee_per_size);
    }
    return 1;
  }, [client]);

  const getPrice = useCallback(async () => {
    if (client && nftDropedAdjustment) {
      const feePerSize = await getFeeConfig();
      return (
        nftDropedAdjustment.width * nftDropedAdjustment.height * feePerSize
      );
    }
    return undefined;
  }, [client, nftDropedAdjustment, getFeeConfig]);

  useEffect(() => {
    const effect = async () => {
      setPrice(await getPrice());
    };
    effect();
  }, [nftDropedAdjustment, client, getPrice]);

  useEffect(() => {
    const effect = async () => {
      const cosmwasmClient =
        await mustGetNonSigningCosmWasmClient(selectedNetworkId);
      const network = getCosmosNetwork(selectedNetworkId);
      const rioterFooterClient = new RioterFooterNftQueryClient(
        cosmwasmClient,
        network?.riotersFooterContractAddress || "",
      );
      setClient(rioterFooterClient);
      setMapsize(await rioterFooterClient.queryMapSize());
    };
    effect();
  }, [selectedNetworkId]);

  useEffect(() => {
    const effect = async () => {
      if (!client) {
        return;
      }
      try {
        const nftCount = await client.queryNftCount();
        const cosmwasmClient =
          await getKeplrSigningCosmWasmClient(selectedNetworkId);
        const allNfts: FooterNftData[] = [];
        for (let i = 0; i < nftCount; i += 11) {
          const nfts = await client.queryNfts({
            from: i,
            to: i + 10 > nftCount ? nftCount : i + 10,
          });
          const newNfts: FooterNftData[] = [];
          for (const nft of nfts) {
            const nftClient = new TeritoriNftQueryClient(
              cosmwasmClient,
              nft.contract_address,
            );
            const nftInfo = await nftClient.nftInfo({
              tokenId: nft.token_id,
            });
            if (!nftInfo || !nftInfo.token_uri) {
              continue;
            }
            const ipfs = ipfsURLToHTTPURL(nftInfo.token_uri);
            const response = await fetch(ipfs);
            const responseJSON = await response.json();
            newNfts.push({
              ...nft,
              imageUri: responseJSON.image.startsWith("ipfs://")
                ? ipfsURLToHTTPURL(responseJSON.image)
                : responseJSON.image,
              // FIXME: sanitize
              // eslint-disable-next-line no-restricted-syntax
              borderRadius: JSON.parse(nft.additional).borderRadius || 0,
            });
          }
          allNfts.push(...newNfts);
        }
        setOldNftPositions(allNfts);
      } catch (e) {
        console.log(e);
      }
    };
    effect();
  }, [client, selectedNetworkId]);

  const { collections, fetchMore: fetchMoreCollections } = useCollections({
    networkId: selectedNetworkId,
    sortDirection: SortDirection.SORT_DIRECTION_DESCENDING,
    upcoming: false,
    sort: Sort.SORT_VOLUME,
    limit: 24,
    offset: 0,
    mintState: MintState.MINT_STATE_UNSPECIFIED,
  });

  useEffect(() => {
    const current: Collection | undefined = collections.find(
      (collection) => collection.id === nftCollectionId,
    );
    setCurrentCollection(current);
  }, [collections, nftCollectionId]);

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

  const handleBuy = useCallback(async () => {
    setTransactionPaymentModalVisible(false);
    const finalPrice = await getPrice();
    if (!nftDropedAdjustment || finalPrice === undefined || !wallet) return;
    const cosmwasmClientSignIn =
      await getKeplrSigningCosmWasmClient(selectedNetworkId);
    const network = getCosmosNetwork(selectedNetworkId);
    const rioterFooterClient = new RioterFooterNftClient(
      cosmwasmClientSignIn,
      wallet.address,
      network?.riotersFooterContractAddress || "",
    );
    if (!rioterFooterClient) return;
    setTransactionPendingModalVisible(true);
    try {
      const [, nftMinterContractAddress, nftTokenId] = parseNftId(
        nftDroped?.id,
      );
      if (!nftMinterContractAddress || !nftTokenId) {
        console.log("nftMinterContractAddress or nftTokenId is undefined");
        return;
      }
      const cosmwasmClient =
        await mustGetNonSigningCosmWasmClient(selectedNetworkId);
      const minterClient = new TeritoriBunkerMinterQueryClient(
        cosmwasmClient,
        nftMinterContractAddress.toString(),
      );
      const nftContractAddress = (await minterClient.config()).nft_addr;
      const response = await rioterFooterClient.addMyNft(
        {
          contractAddress: nftContractAddress,
          tokenId: nftTokenId,
          additional: JSON.stringify({
            borderRadius: nftDropedAdjustment.borderRadius,
          }),
          position: {
            x: Math.ceil(nftDropedAdjustment.x || 0).toString(),
            y: Math.ceil(nftDropedAdjustment.y || 0).toString(),
            width: Math.ceil(nftDropedAdjustment.width || 0).toString(),
            height: Math.ceil(nftDropedAdjustment.height || 0).toString(),
          },
        },
        "auto",
        undefined,
        [
          {
            amount: finalPrice.toString(),
            denom: "utori", // FIXME: don't harcode
          },
        ],
      );
      setTransactionHash(response.transactionHash);
      setTransactionPendingModalVisible(false);
      setTransactionSuccessModalVisible(true);
    } catch (e) {
      setTransactionPendingModalVisible(false);
      console.log("error", e);
    }
  }, [getPrice, nftDroped?.id, nftDropedAdjustment, selectedNetworkId, wallet]);

  const isCloseToBottom = useCallback(
    ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
      const paddingToBottom = 60;
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    },
    [],
  );

  const renderContent = useCallback(
    () =>
      oldNftPositions && (
        <DraxViewReceiverContent
          oldNftPositions={oldNftPositions}
          nftDroped={nftDroped}
          setNftDropedAdjustment={setNftDropedAdjustment}
          nftDropedAdjustment={nftDropedAdjustment}
        />
      ),
    [oldNftPositions, nftDroped, nftDropedAdjustment],
  );

  const onReceiveDragDrop = useCallback(
    (event: any) => {
      // FIXME: sanitize
      // eslint-disable-next-line no-restricted-syntax
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
    [nftDroped, nftDropedAdjustment],
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
                zIndex: (oldNftPositions.length || 0) + 3,
              }}
            />
            {oldNftPositions &&
              oldNftPositions.map((nft: FooterNftData, index: number) => (
                <Image
                  key={nft.token_id}
                  source={{ uri: nft.imageUri }}
                  style={[
                    styles.oldNftPositions,
                    {
                      width: parseInt(nft.position.width, 10),
                      height: parseInt(nft.position.height, 10),
                      left: parseInt(nft.position.x, 10),
                      top: parseInt(nft.position.y, 10),
                      borderRadius: nft.borderRadius,
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
                  zIndex: oldNftPositions.length,
                }}
              >
                <Image
                  style={{
                    width: nftDropedAdjustment.width,
                    height: nftDropedAdjustment.height,
                    borderRadius: nftDropedAdjustment.borderRadius,
                  }}
                  source={{
                    uri: nftDroped.imageUri,
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
          nftId={nftDroped?.id || ""}
          onPressProceed={handleBuy}
          onClose={() => setTransactionPaymentModalVisible(false)}
          visible={transactionPaymentModalVisible}
          price={price.toString()}
          priceDenom="utori" // FIXME: don't hardcode
          label="Pay $Tori"
          textComponent={
            <BrandText style={fontSemibold14}>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                You are about to put a{" "}
              </BrandText>
              {nftDroped?.name}
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                {" "}
                to Rioters footer
              </BrandText>
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
        networkId={nftDroped?.networkId}
        transactionHash={transactionHash}
        visible={transactionSuccessModalVisible}
        textComponent={
          <BrandText style={fontSemibold14}>
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              You successfully puted{" "}
            </BrandText>
            {nftDroped?.name}
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              {" "}
              to Rioters footer
            </BrandText>
          </BrandText>
        }
        onClose={() => setTransactionSuccessModalVisible(false)}
      />
    </ScreenContainer>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
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
