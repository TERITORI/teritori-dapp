import { ScrollView, Target } from "@nandorojo/anchor";
import React, { useCallback, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { NFTMainInfo } from "../../components/nftDetails/NFTMainInfo";
import { SpacerColumn } from "../../components/spacer";
import { Tabs } from "../../components/tabs/Tabs";
import {
  initialToastError,
  useFeedbacks,
} from "../../context/FeedbacksProvider";
import { Wallet } from "../../context/WalletsProvider";
import { TeritoriNftVaultClient } from "../../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import { NFTVault__factory } from "../../evm-contracts-clients/teritori-nft-vault/NFTVault__factory";
import { useCancelNFTListing } from "../../hooks/useCancelNFTListing";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useMintEnded } from "../../hooks/useMintEnded";
import { useNFTInfo } from "../../hooks/useNFTInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useSellNFT } from "../../hooks/useSellNFT";
import {
  NetworkKind,
  getCollectionId,
  getKeplrSigningCosmWasmClient,
  mustGetCosmosNetwork,
  mustGetEthereumNetwork,
  parseNftId,
} from "../../networks";
import { getMetaMaskEthereumSigner } from "../../utils/ethereum";
import { ScreenFC } from "../../utils/navigation";
import { NFTAttribute } from "../../utils/types/nft";

export interface NFTInfo {
  name: string;
  description: string;
  attributes: NFTAttribute[];
  nftAddress: string;
  imageURL: string;
  tokenId: string;
  mintAddress: string;
  ownerAddress: string;
  isSeller: boolean;
  isListed: boolean;
  isOwner: boolean;
  canSell: boolean;
  price: string;
  priceDenom: string;
  collectionName: string;
  textInsert?: string;
  collectionImageURL: string;
  mintDenom: string;
  royalty: number;
  breedingsAvailable?: number;
  networkId: string;
  collectionId: string;
}

const Content: React.FC<{
  id: string;
}> = ({ id }) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("main");
  const { setToastError } = useFeedbacks();
  const { selectedWallet: wallet } = useSelectedWallet();
  const { info, refresh, notFound } = useNFTInfo(id, wallet?.userId);
  const { width } = useMaxResolution({ noMargin: true });

  const [network, collectionAddress] = parseNftId(id);

  const collectionId = getCollectionId(network?.id, collectionAddress);
  const mintEnded = useMintEnded(collectionId);
  const showMarketplace =
    (network?.secondaryDuringMintList || []).includes(collectionAddress) ||
    (mintEnded !== undefined && mintEnded);

  const screenTabItems = {
    main: {
      name: "Main info",
      scrollTo: "main-info",
    },
    price: {
      name: "Price history",
      scrollTo: "price-history",
      disabled: !showMarketplace,
    },
    activity: {
      name: "Activity",
      scrollTo: "activity",
    },
    more: {
      name: "More from collection",
      disabled: true,
    },
  };

  // Query the Vault client to buy the NFT and returns the transaction reply
  const handleBuy = useCallback(async () => {
    if (!wallet?.connected || !wallet.address || !info?.nftAddress) {
      return;
    }

    let buyFunc: CallableFunction | null = null;
    switch (network?.kind) {
      case NetworkKind.Cosmos:
        buyFunc = teritoriBuy;
        break;
      case NetworkKind.Ethereum:
        buyFunc = ethereumBuy;
        break;
    }

    if (!buyFunc) {
      setToastError({
        title: "Error",
        message: `Unsupported network kind ${network?.kind}`,
      });
      return;
    }

    setToastError(initialToastError);
    try {
      const txHash = await buyFunc(wallet, info);

      console.log("buy", txHash);
      refresh();

      return txHash;
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setToastError({
          title: "Failed to buy NFT",
          message: e.message,
        });
      }
    }
  }, [info, network?.kind, refresh, setToastError, wallet]);

  const sell = useSellNFT(network?.kind);

  const handleSell = useCallback(
    async (price: string, denom: string | undefined) => {
      if (!info) {
        return;
      }
      const txHash = await sell(info.nftAddress, info.tokenId, price, denom);
      console.log("txHash:", txHash);
      refresh();
      return txHash;
    },
    [info, sell, refresh]
  );

  const cancelListing = useCancelNFTListing(
    network?.id,
    info?.nftAddress || "",
    info?.tokenId || ""
  );

  const handleCancelListing = useCallback(async () => {
    const txHash = await cancelListing();
    console.log("txHash:", txHash);
    refresh();
    return txHash;
  }, [cancelListing, refresh]);

  if (
    ![NetworkKind.Cosmos, NetworkKind.Ethereum].includes(
      network?.kind || NetworkKind.Unknown
    )
  ) {
    return (
      <View style={{ alignItems: "center", width: "100%", marginTop: 40 }}>
        <BrandText>Network not supported</BrandText>
      </View>
    );
  } else if (notFound) {
    return (
      <View style={{ alignItems: "center", width: "100%", marginTop: 40 }}>
        <BrandText>NFT not found</BrandText>
      </View>
    );
  }

  // TODO: Reuse this ScrollView pattern (ScrollView + View just bellow) in other Screens to provide a ScreenView (One per screen) width centered scrolling content with fixed max width. And remove it from ScreenContainer
  else {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ width: "100%" }}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <View style={{ backgroundColor: "black", width }}>
            <Tabs
              items={screenTabItems}
              selected={selectedTab}
              style={{
                height: 60,
                justifyContent: "flex-end",
                width: "100%",
              }}
              onSelect={setSelectedTab}
              hideSelector
            />
          </View>

          <Target name="main-info">
            <SpacerColumn size={6} />
          </Target>

          <NFTMainInfo
            nftId={id}
            nftInfo={info || undefined}
            buy={handleBuy}
            sell={handleSell}
            cancelListing={handleCancelListing}
            showMarketplace={showMarketplace}
          />
          <SpacerColumn size={6} />
        </ScrollView>
      </View>
    );
  }
};

export const NFTDetailScreen: ScreenFC<"NFTDetail"> = ({
  route: {
    params: { id },
  },
}) => {
  // needed for emoji
  id = decodeURIComponent(id);

  const [network] = parseNftId(id);

  return (
    <ScreenContainer
      forceNetworkId={network?.id}
      fullWidth
      footerChildren={<></>}
      noScroll
      noMargin
    >
      <Content key={id} id={id} />
    </ScreenContainer>
  );
};

const teritoriBuy = async (wallet: Wallet, info: NFTInfo) => {
  const network = mustGetCosmosNetwork(info.networkId);
  if (!network.vaultContractAddress) {
    throw new Error("network not supported");
  }
  const signingCosmwasmClient = await getKeplrSigningCosmWasmClient(network.id);
  const signingVaultClient = new TeritoriNftVaultClient(
    signingCosmwasmClient,
    wallet.address,
    network.vaultContractAddress
  );
  const tx = await signingVaultClient.buy(
    { nftContractAddr: info.nftAddress, nftTokenId: info.tokenId },
    "auto",
    undefined,
    [
      {
        amount: info.price,
        denom: info.priceDenom,
      },
    ]
  );
  return tx.transactionHash;
};

const ethereumBuy = async (wallet: Wallet, nftInfo: NFTInfo) => {
  const network = mustGetEthereumNetwork(nftInfo.networkId);
  const signer = await getMetaMaskEthereumSigner(network, wallet.address);
  if (!signer) {
    throw Error("Unable to get signer");
  }

  const vaultClient = NFTVault__factory.connect(
    network.vaultContractAddress,
    signer
  );

  const { maxFeePerGas, maxPriorityFeePerGas } = await signer.getFeeData();
  const tx = await vaultClient.buyNFT(nftInfo.nftAddress, nftInfo.tokenId, {
    maxFeePerGas: maxFeePerGas?.toNumber(),
    maxPriorityFeePerGas: maxPriorityFeePerGas?.toNumber(),
    value: nftInfo.price,
  });

  await tx.wait();

  return tx.hash;
};
