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
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useSellNFT } from "../../hooks/useSellNFT";
import { secondaryDuringMintList } from "../../utils/collections";
import { getMetaMaskEthereumSigner } from "../../utils/ethereum";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { ScreenFC } from "../../utils/navigation";
import { Network } from "../../utils/network";
import { vaultContractAddress } from "../../utils/teritori";
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
}

const Content: React.FC<{
  id: string;
}> = ({ id }) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("main");
  const { setToastError } = useFeedbacks();
  const wallet = useSelectedWallet();
  const { info, refresh, notFound } = useNFTInfo(id, wallet?.address);
  const { width } = useMaxResolution({ noMargin: true });
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetwork = selectedNetworkInfo?.network;

  const collectionAddress = id.split("-")[1];

  const collectionId = `${selectedNetworkInfo?.addressPrefix}-${collectionAddress}`;
  const mintEnded = useMintEnded(collectionId);
  const showMarketplace =
    secondaryDuringMintList.includes(collectionId) ||
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
    switch (selectedNetwork) {
      case Network.Teritori:
        buyFunc = teritoriBuy;
        break;
      case Network.Ethereum:
        buyFunc = ethereumBuy;
        break;
    }

    if (!buyFunc) {
      setToastError({
        title: "Error",
        message: `Unsupported network ${selectedNetwork}`,
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
  }, [
    wallet?.address,
    wallet?.connected,
    info?.tokenId,
    info?.nftAddress,
    selectedNetwork,
  ]);

  const teritoriBuy = async (wallet: Wallet, info: NFTInfo) => {
    const signingCosmwasmClient = await getSigningCosmWasmClient();
    const signingVaultClient = new TeritoriNftVaultClient(
      signingCosmwasmClient,
      wallet.address,
      vaultContractAddress
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
    const signer = await getMetaMaskEthereumSigner(wallet.address);
    if (!signer) {
      throw Error("Unable to get signer");
    }

    const vaultClient = await NFTVault__factory.connect(
      process.env.ETHEREUM_VAULT_ADDRESS || "",
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

  const sell = useSellNFT(selectedNetwork);

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
    [info, sell, selectedNetwork, refresh]
  );

  const cancelListing = useCancelNFTListing(
    selectedNetwork,
    info?.nftAddress || "",
    info?.tokenId || ""
  );

  const handleCancelListing = useCallback(async () => {
    const txHash = await cancelListing();
    console.log("txHash:", txHash);
    refresh();
    return txHash;
  }, [cancelListing, refresh, selectedNetwork]);

  if (!id.startsWith("tori-") && !id.startsWith("eth-")) {
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
            nftInfo={info}
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

  return (
    <ScreenContainer fullWidth footerChildren={<></>} noScroll noMargin>
      <Content key={id} id={id} />
    </ScreenContainer>
  );
};
