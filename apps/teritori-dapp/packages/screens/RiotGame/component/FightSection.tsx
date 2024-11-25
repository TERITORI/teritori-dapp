import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { FightBossSection } from "./FightBossSection";
import { FightCountdownSection } from "./FightCountdownSection";
import { FightSquadSection } from "./FightSquadSection";
import { UnstakeModal } from "./UnstakeModal";
import FlexRow from "../../../components/FlexRow";
import useSelectedWallet from "../../../hooks/useSelectedWallet";

import { useFeedbacks } from "@/context/FeedbacksProvider";
import { TeritoriNftQueryClient } from "@/contracts-clients/teritori-nft/TeritoriNft.client";
import { TeritoriNft__factory } from "@/evm-contracts-clients/teritori-nft/TeritoriNft__factory";
import {
  getNetwork,
  mustGetEthereumNetwork,
  mustGetNonSigningCosmWasmClient,
  NetworkInfo,
  NetworkKind,
} from "@/networks";
import {
  getEthereumProvider,
  getMetaMaskEthereumProvider,
} from "@/utils/ethereum";
import { squadWithdraw } from "@/utils/game";
import { web3ToWeb2URI } from "@/utils/ipfs";
import { fontMedium48 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { RipperLightInfo, SquadInfo } from "@/utils/types/riot-p2e";

const cosmosNFTInfos = async (
  network: NetworkInfo,
  squad: SquadInfo,
): Promise<RipperLightInfo[]> => {
  const cosmwasmClient = await mustGetNonSigningCosmWasmClient(network.id);

  const nftInfos = await Promise.all(
    squad.nfts.map(async (nft) => {
      const nftClient = new TeritoriNftQueryClient(
        cosmwasmClient,
        nft.contract,
      );
      return await nftClient.nftInfo({ tokenId: nft.tokenId });
    }),
  );

  const stakedRippers: RipperLightInfo[] = nftInfos.map(({ extension }) => ({
    imageUri: web3ToWeb2URI(`${extension?.image}`),
    name: `${extension?.name}`,
  }));

  return stakedRippers;
};

const ethereumNFTInfos = async (
  network: NetworkInfo,
  squad: SquadInfo,
): Promise<RipperLightInfo[]> => {
  const ethereumNetwork = mustGetEthereumNetwork(network.id);
  const metamaskProvider = await getMetaMaskEthereumProvider(
    ethereumNetwork.chainId,
  );
  if (!metamaskProvider) {
    throw Error("unable to get ethereum provider");
  }

  const nftInfos = await Promise.all(
    squad.nfts.map(async (nft) => {
      const nftContract = nft.contract;
      const ethProvider = await getEthereumProvider(ethereumNetwork);

      const nftClient = TeritoriNft__factory.connect(nftContract, ethProvider);
      const tokenURI = await nftClient.callStatic.tokenURI(nft.tokenId);
      const res = (await fetch(tokenURI)).json();
      return res;
    }),
  );

  const stakedRippers: RipperLightInfo[] = nftInfos.map((nft) => ({
    imageUri: web3ToWeb2URI(`${nft.image}`),
    name: `${nft.name}`,
  }));

  return stakedRippers;
};

type FightSectionProps = {
  squad: SquadInfo;
  onCloseClaimModal: () => void;
  now: number;
  cooldown: number;
};

export const FightSection: React.FC<FightSectionProps> = ({
  squad,
  onCloseClaimModal,
  now,
  cooldown,
}) => {
  const [isUnstaking, setIsUnstaking] = useState(false);
  const { setToastError } = useFeedbacks();
  const [isShowClaimModal, setIsShowClaimModal] = useState(false);
  const selectedWallet = useSelectedWallet();
  const networkId = selectedWallet?.networkId;

  const { data: stakedRippers } = useQuery(
    ["stakedRippers", networkId, squad.nfts],
    async () => {
      if (!networkId) {
        return [];
      }

      if (squad.nfts.length === 0) {
        return [];
      }

      const network = getNetwork(networkId);

      switch (network?.kind) {
        case NetworkKind.Cosmos:
          return cosmosNFTInfos(network, squad);
        case NetworkKind.Ethereum:
          return ethereumNFTInfos(network, squad);
        default:
          return [];
      }
    },
    { staleTime: Infinity },
  );

  const unstake = async () => {
    const currentUser = selectedWallet?.userId;

    if (!currentUser) return;

    try {
      setIsUnstaking(true);

      await squadWithdraw(currentUser, squad.index);
      setIsShowClaimModal(true);
    } catch (e: any) {
      setToastError({
        title: "Error occurs",
        message: e.message,
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  return (
    <FlexRow
      justifyContent="space-between"
      style={styles.section}
      breakpoint={1200}
    >
      <FightBossSection />

      <FightCountdownSection
        unstake={unstake}
        isUnstaking={isUnstaking}
        squad={squad}
        now={now}
        cooldown={cooldown}
      />

      <FightSquadSection stakedRippers={stakedRippers || []} />

      <UnstakeModal
        onClose={onCloseClaimModal}
        squad={squad}
        visible={isShowClaimModal}
      />
    </FlexRow>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  pageTitle: {
    alignSelf: "center",
    ...(fontMedium48 as object),
  },
  section: {
    paddingHorizontal: layout.spacing_x4 * 2,
  },
});
