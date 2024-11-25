import {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} from "@axelar-network/axelarjs-sdk";
import { Decimal } from "@cosmjs/math";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  View,
  ViewStyle,
  StyleProp,
  useWindowDimensions,
} from "react-native";

import { GameContentView } from "./component/GameContentView";
import trashSVG from "@/assets/icons/trash.svg";
import FlexRow from "../../components/FlexRow";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import {
  NFT,
  NFTsRequest,
  Sort,
  SortDirection,
} from "@/api/marketplace/v1/marketplace";
import { BrandText } from "@/components/BrandText";
import { ExternalLink } from "@/components/ExternalLink";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SVG } from "@/components/SVG";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { NFTBridge } from "@/components/nfts/NFTBridge";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { AxelarBridgeETH__factory } from "@/evm-contracts-clients/axelar-bridge-eth/AxelarBridgeETH__factory";
import { TeritoriMinter__factory } from "@/evm-contracts-clients/teritori-bunker-minter/TeritoriMinter__factory";
import { TeritoriNft__factory } from "@/evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import { useNFTs } from "@/hooks/useNFTs";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import {
  EthereumNetworkInfo,
  NetworkFeature,
  getCollectionId,
  getEthereumNetwork,
  parseNftId,
  txExplorerLink,
} from "@/networks";
import { polygonNetwork } from "@/networks/polygon";
import { polygonMumbaiNetwork } from "@/networks/polygon-mumbai";
import { getMetaMaskEthereumSigner } from "@/utils/ethereum";
import {
  codGrayColor,
  errorColor,
  neutral00,
  neutral33,
  neutral44,
  neutralA3,
  yellowDefault,
} from "@/utils/style/colors";
import {
  fontMedium10,
  fontMedium14,
  fontMedium32,
  fontMedium48,
  fontSemibold12,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const _toDecimalNumber = (
  bn: BigNumber,
  strLen: number = 10,
  decNum: number = 18,
) => {
  const numStr = Decimal.fromAtomics(bn.toString(), decNum).toString();
  return numStr.substring(0, strLen) + "...";
};

const getNFTClient = async (
  network: EthereumNetworkInfo | undefined,
  address: string | undefined,
) => {
  if (!network) {
    throw Error("Network must be given");
  }

  if (!address) {
    throw Error("Sender must be provided");
  }

  const signer = await getMetaMaskEthereumSigner(network, address);
  if (!signer) {
    throw Error("Unable to get signer");
  }

  const minterClient = TeritoriMinter__factory.connect(
    network?.riotContractAddressGen0 || "",
    signer,
  );

  const nftAddress = await minterClient.callStatic.nft();
  const nftClient = TeritoriNft__factory.connect(nftAddress, signer);
  return { nftClient, signer };
};

export const RiotGameBridgeScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const selectedWallet = useSelectedWallet();
  const [isBridgeApproved, setIsBridgeApproved] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  const { setToastError } = useFeedbacks();
  const [isCheckingNFT, setIsCheckingNFT] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isBridging, setIsBridging] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState(BigNumber.from(0));
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);
  const [axelarGas, setAxelarGas] = useState(BigNumber.from(0));
  const [txHash, setTxHash] = useState("");

  const networkId = useSelectedNetworkId();
  const network = getEthereumNetwork(networkId);

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

  // Get only not locked NFTs
  const nfts = useMemo(() => {
    const res = data.filter((data) => !data.lockedOn);
    return res;
  }, [data]);

  // Check is the Bridge Is already Approved
  useEffect(() => {
    const get_bridge = false;
    if (get_bridge) {
      setIsBridgeApproved(false);
    }
  }, [isBridgeApproved]);

  const fetchAxelarGas = async (
    signer: ethers.providers.JsonRpcSigner,
    tokenId: string,
  ) => {
    setIsEstimatingGas(true);

    // Estimated gas
    const bridgeClient = AxelarBridgeETH__factory.connect(
      network?.riotBridgeAddressGen0 || "",
      signer,
    );

    const { maxFeePerGas } = await signer.getFeeData();
    const estimatedGasRequest = bridgeClient.estimateGas.bridgeNft(tokenId);

    if (!network?.riotBridgeAddressGen0) {
      throw Error("Bridge is undefined");
    }

    let destNetwork: EthereumNetworkInfo;
    let axelarEnv;
    if (network.id === "ethereum-goerli") {
      destNetwork = polygonMumbaiNetwork;
      axelarEnv = Environment.TESTNET;
    } else if (network.id === "ethereum") {
      destNetwork = polygonNetwork;
      axelarEnv = Environment.MAINNET;
    } else {
      throw Error("Network is not supported for bridging");
    }

    if (!destNetwork?.riotBridgedNFTAddressGen0) {
      throw Error("Destination NFT is undefined");
    }

    const GMPGasFee = {
      showDetailedFees: false,
      destinationContractAddress: destNetwork.riotBridgedNFTAddressGen0,
      sourceContractAddress: network.riotBridgeAddressGen0,
      tokenSymbol: "matic",
    };

    const axelarSdk = new AxelarQueryAPI({
      environment: axelarEnv,
    });

    const srcChainId = EvmChain.ETHEREUM;
    const destChainId = EvmChain.POLYGON;
    const srcChainTokenSymbol = GasToken.ETH;
    const gasLimit = 700_000;

    try {
      const axelarGasRequest = await axelarSdk.estimateGasFee(
        srcChainId,
        destChainId,
        srcChainTokenSymbol,
        gasLimit,
        1.1,
        "0",
        GMPGasFee,
      );

      const gasData = await Promise.all([
        estimatedGasRequest,
        axelarGasRequest,
      ]);
      const estimatedGas = (maxFeePerGas || BigNumber.from(0)).mul(gasData[0]);
      const axelarGas = BigNumber.from(gasData[1]);

      console.log({
        estimatedGas: estimatedGas.toString(),
        axelarGas: axelarGas.toString(),
        total: estimatedGas.add(axelarGas).toString(),
      });

      setEstimatedGas(estimatedGas);
      setAxelarGas(axelarGas);
      setIsEstimatingGas(false);
    } catch (e: any) {
      console.error(e);
      setToastError({ title: "Error", message: e.message });
    }
  };

  const bridgeNFT = async () => {
    if (!selectedNFT) return;
    if (!network) return;

    if (axelarGas.add(estimatedGas).toString() === "0") {
      return setToastError({
        title: "Warning",
        message: "Unable to estimate gas",
      });
    }

    const address = selectedWallet?.address || "";

    const signer = await getMetaMaskEthereumSigner(network, address);
    if (!signer) {
      throw Error("Unable to get signer");
    }

    setIsBridging(true);

    const bridgeClient = AxelarBridgeETH__factory.connect(
      network?.riotBridgeAddressGen0 || "",
      signer,
    );

    const [, , tokenId] = parseNftId(selectedNFT.id);

    const tx = await bridgeClient.bridgeNft(tokenId, { value: axelarGas });
    setTxHash(tx.hash);

    await tx.wait();

    setIsBridging(false);
  };

  const approveTheBridge = async () => {
    if (!selectedNFT) return;
    if (!network) return;

    try {
      const { nftClient, signer } = await getNFTClient(
        network,
        selectedWallet?.address,
      );

      const [, , tokenId] = parseNftId(selectedNFT.id);
      const { maxFeePerGas: maxFee, maxPriorityFeePerGas: maxPrio } =
        await signer.getFeeData();
      const maxFeePerGas = maxFee?.toString();
      const maxPriorityFeePerGas = maxPrio?.toString();
      const txFeeData = {
        maxFeePerGas,
        maxPriorityFeePerGas,
      };

      const approveTx = await nftClient.approve(
        network?.riotBridgeAddressGen0 || "",
        tokenId,
        txFeeData,
      );

      setIsApproving(true);

      await approveTx.wait();
      setIsBridgeApproved(true);

      await fetchAxelarGas(signer, tokenId);
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    }

    setIsApproving(false);
  };

  const onSelectNFT = async (nft: NFT) => {
    setIsCheckingNFT(true);
    setSelectedNFT(nft);
    setEstimatedGas(BigNumber.from(0));
    setTxHash("");

    const { nftClient, signer } = await getNFTClient(
      network,
      selectedWallet?.address,
    );
    const [, , tokenId] = parseNftId(nft.id);

    const approvedFor = await nftClient.callStatic.getApproved(tokenId);
    const isApproved =
      approvedFor.toLowerCase() === network?.riotBridgeAddressGen0;
    setIsBridgeApproved(isApproved);
    setIsCheckingNFT(false);

    if (isApproved) {
      fetchAxelarGas(signer, tokenId);
    }
  };

  const BREAK_POINT = 600;
  const shouldRestructure = width < BREAK_POINT;
  const numCols = width < 1200 ? (width < 900 ? 1 : 2) : 3;

  return (
    <GameContentView forceNetworkFeatures={[NetworkFeature.NFTBridge]}>
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
          style={{ marginTop: layout.spacing_x4, alignItems: "center" }}
          breakpoint={BREAK_POINT}
        >
          <View style={{ flexGrow: 1, marginBottom: layout.spacing_x2 }}>
            <FlatList
              style={{ height: shouldRestructure ? 400 : 600 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              numColumns={numCols}
              key={numCols}
              ItemSeparatorComponent={() => <SpacerColumn size={2} />}
              data={nfts}
              ListEmptyComponent={
                <BrandText style={fontSemibold20}>
                  {isLoading ? "Loading ..." : "No results found"}
                </BrandText>
              }
              renderItem={({ item, index }: { item: NFT; index: number }) => {
                return (
                  <View
                    style={{
                      marginHorizontal: layout.spacing_x1,
                    }}
                  >
                    <NFTBridge
                      key={item.id}
                      data={item}
                      selected={selectedNFT?.id === item.id}
                      onPress={() => onSelectNFT(item)}
                    />
                  </View>
                );
              }}
            />
          </View>

          <View
            style={{
              marginHorizontal: layout.spacing_x4,
              alignSelf: "flex-start",
            }}
          >
            <SideBridge
              style={{
                width: 245,
                backgroundColor: neutral00,
                borderRadius: layout.spacing_x2,
                borderColor: neutral33,
                borderWidth: 1,
                paddingVertical: layout.spacing_x1,
              }}
              onApproveTheBridge={() => approveTheBridge()}
              onBridge={() => bridgeNFT()}
              isBridgeApproved={isBridgeApproved}
              selected={selectedNFT}
              setSelected={setSelectedNFT}
              isCheckingNFT={isCheckingNFT}
              isApproving={isApproving}
              estimatedGas={estimatedGas}
              axelarGas={axelarGas}
              isEstimatingGas={isEstimatingGas}
              isBridging={isBridging}
            />

            <SpacerColumn size={2} />

            {txHash && (
              <ExternalLink
                externalUrl={txExplorerLink(network?.id, txHash)}
                style={[fontMedium14, { width: "100%" }]}
                ellipsizeMode="middle"
                numberOfLines={1}
              >
                View the transaction on Explorer
              </ExternalLink>
            )}
            <SpacerColumn size={2} />

            {txHash && (
              <ExternalLink
                externalUrl={`https://axelarscan.io/gmp/${txHash}`}
                style={[fontMedium14, { width: "100%" }]}
                ellipsizeMode="middle"
                numberOfLines={1}
              >
                View the transaction on Axelar Bridge
              </ExternalLink>
            )}
          </View>
        </FlexRow>
      </View>
    </GameContentView>
  );
};

const SideBridge: React.FC<{
  style?: StyleProp<ViewStyle>;
  onApproveTheBridge: () => void;
  onBridge: () => void;
  selected: NFT | undefined;
  setSelected: any;
  isBridgeApproved: boolean;
  isCheckingNFT: boolean;
  isApproving: boolean;
  isBridging: boolean;
  estimatedGas: BigNumber;
  axelarGas: BigNumber;
  isEstimatingGas: boolean;
}> = ({
  style,
  onApproveTheBridge,
  onBridge,
  selected,
  setSelected,
  isBridgeApproved,
  isCheckingNFT,
  isApproving,
  isBridging,
  estimatedGas,
  axelarGas,
  isEstimatingGas,
}) => {
  const handleRemoveCartItem = () => {
    setSelected();
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
                sourceURI={selected?.imageUri}
                width={40}
                height={40}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 4,
                  marginRight: 6,
                }}
              />
              <BrandText style={fontSemibold12}>{selected?.name}</BrandText>
              <Pressable onPress={() => handleRemoveCartItem()}>
                <SVG source={trashSVG} color={neutralA3} width={14} />
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
      <Separator />

      {/*Footer*/}
      <View style={{ paddingHorizontal: layout.spacing_x1_5 }}>
        <View style={{ paddingVertical: layout.spacing_x1 }}>
          <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
            Estimated Gas:{" "}
            {isEstimatingGas ? "estimating..." : _toDecimalNumber(estimatedGas)}
          </BrandText>

          <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
            Estimated Axelar Gas:{" "}
            {isEstimatingGas ? "estimating..." : _toDecimalNumber(axelarGas)}
          </BrandText>

          <BrandText style={[fontSemibold12, { color: neutralA3 }]}>
            Duration: {isEstimatingGas ? "estimating..." : "~ 30m"}
          </BrandText>
        </View>

        <Separator />

        <BrandText
          style={[
            fontSemibold12,
            { color: neutralA3, marginVertical: layout.spacing_x1 },
          ]}
        >
          You pay:{" "}
          {isEstimatingGas
            ? "estimating..."
            : _toDecimalNumber(axelarGas.add(estimatedGas))}
        </BrandText>

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
              disabled={!selected || isBridging || isEstimatingGas}
              onPress={onBridge}
            />
          ) : (
            <SecondaryButton
              fullWidth
              color={yellowDefault}
              size="SM"
              text={isApproving ? "Approving..." : "Approve Bridge"}
              onPress={onApproveTheBridge}
              disabled={isCheckingNFT || isApproving}
            />
          )}
        </View>
      </View>
    </View>
  );
};
