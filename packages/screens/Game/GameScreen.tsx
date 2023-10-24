import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { OmniLink } from "../../components/OmniLink";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import ModalBase from "../../components/modals/ModalBase";
import { NFTView } from "../../components/nfts/NFTView";
import { SpacerColumn } from "../../components/spacer";
import { UserCard } from "../../components/user/UserCard";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import {
  ArenaClient,
  ArenaQueryClient,
} from "../../contracts-clients/arena/Arena.client";
import { TeritoriNftClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import { useCosmWasmUserNFTs } from "../../hooks/useCosmWasmUserNFTs";
import { useNFTInfo } from "../../hooks/useNFTInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  getUserId,
  mustGetCosmosNetwork,
  mustGetNonSigningCosmWasmClient,
  parseNftId,
  parseUserId,
} from "../../networks";
import { ScreenFC } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { modalMarginPadding } from "../../utils/style/modals";

// TODO: use network prefixed game id
const networkId = "teritori-testnet";

const itemsMintAddress =
  "tori1nkn5aqruw9xhzyh7xlgyvj9v89xqw86deehn4f35ejn689k948uqwrr7jn";
const itemsNFTsAddress =
  "tori1p6yrgrgz44nv4fsyunx40zg5rsxey9rgq6ev7dq5slsu2yd3wkuss3ymnc";

export const GameScreen: ScreenFC<"Game"> = ({ route }) => {
  const { gameId } = route.params;
  const selectedWallet = useSelectedWallet();
  const { game: currentGame } = useArenaPlayerGameId(selectedWallet?.address);
  const { game: paramGame } = useArenaGame(gameId);
  const { gamePlayers } = useArenaGamePlayers(gameId);
  const { wrapWithFeedback } = useFeedbacks();
  const [addItemModalVisible, setAddItemModalVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const playerStatus = !currentGame?.gameId
    ? "Not joined"
    : currentGame.gameId === +gameId
    ? "Joined"
    : "In other game";

  return (
    <ScreenContainer forceNetworkId={networkId} footerChildren={<></>}>
      <BrandText>{JSON.stringify(paramGame, null, 2)}</BrandText>
      {paramGame?.state === "created" && (
        <>
          <SpacerColumn size={2} />
          <BrandText>Your status: {playerStatus}</BrandText>
          {playerStatus === "In other game" && (
            <OmniLink
              to={{
                screen: "Game",
                params: { gameId: currentGame?.gameId?.toString() },
              }}
            >
              <BrandText style={{ color: primaryColor }}>
                See your current game
              </BrandText>
            </OmniLink>
          )}
        </>
      )}
      {selectedWallet?.connected &&
        paramGame?.state === "created" &&
        playerStatus === "Not joined" && (
          <>
            <SpacerColumn size={2} />
            <PrimaryButton
              text="Join this lobby"
              loader
              onPress={wrapWithFeedback(async () => {
                const network = mustGetCosmosNetwork(networkId);
                if (!network.arenaContractAddress) {
                  throw new Error("No arena contract address");
                }
                const gameIdNum = +gameId;
                if (isNaN(gameIdNum)) {
                  throw new Error("Invalid game id");
                }
                const senderAddress = selectedWallet?.address;
                if (!senderAddress) {
                  throw new Error("No wallet");
                }
                const cosmWasmClient = await getKeplrSigningCosmWasmClient(
                  networkId
                );
                const arenaClient = new ArenaClient(
                  cosmWasmClient,
                  senderAddress,
                  network.arenaContractAddress
                );
                await arenaClient.joinGame({ gameId: gameIdNum });
                await queryClient.invalidateQueries([
                  "arena-player-game-id",
                  senderAddress,
                ]);
                await queryClient.invalidateQueries([
                  "arena-game-players",
                  gameId,
                ]);
              })}
            />
          </>
        )}
      {paramGame?.state === "created" && playerStatus === "Joined" && (
        <>
          <SpacerColumn size={2} />
          <PrimaryButton
            text="Leave this lobby"
            loader
            onPress={wrapWithFeedback(async () => {
              const network = mustGetCosmosNetwork(networkId);
              if (!network.arenaContractAddress) {
                throw new Error("No arena contract address");
              }
              const senderAddress = selectedWallet?.address;
              if (!senderAddress) {
                throw new Error("No wallet");
              }
              const cosmWasmClient = await getKeplrSigningCosmWasmClient(
                networkId
              );
              const arenaClient = new ArenaClient(
                cosmWasmClient,
                senderAddress,
                network.arenaContractAddress
              );
              await arenaClient.leaveGame();
              await queryClient.invalidateQueries([
                "arena-player-game-id",
                senderAddress,
              ]);
              await queryClient.invalidateQueries([
                "arena-game-players",
                gameId,
              ]);
            })}
          />
        </>
      )}
      <SpacerColumn size={2} />
      <BrandText>Players:</BrandText>
      <SpacerColumn size={1} />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          margin: -layout.spacing_x1,
        }}
      >
        {(gamePlayers || []).map((player) => {
          return (
            <UserCard
              style={{ margin: layout.spacing_x1 }}
              key={player}
              userId={getUserId(networkId, player)}
            />
          );
        })}
      </View>
      {["created", "started"].includes(paramGame?.state || "") &&
        playerStatus === "Joined" && (
          <>
            <SpacerColumn size={2} />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <BrandText>Your items:</BrandText>
              {paramGame?.state !== "started" && (
                <PrimaryButton
                  text="Add item"
                  size="XS"
                  onPress={() => {
                    setAddItemModalVisible(true);
                  }}
                />
              )}
            </View>
            <SpacerColumn size={1} />
            <PlayerItems
              playerId={getUserId(networkId, selectedWallet?.address)}
              canRetrieve={paramGame?.state !== "started"}
            />
            <AddItemModal
              isVisible={addItemModalVisible}
              userId={getUserId(networkId, selectedWallet?.address)}
              onClose={() => {
                setAddItemModalVisible(false);
              }}
            />
          </>
        )}
    </ScreenContainer>
  );
};

const AddItemModal: React.FC<{
  isVisible: boolean;
  onClose?: () => void;
  userId: string;
}> = ({ isVisible, onClose, userId }) => {
  const { wrapWithFeedback } = useFeedbacks();
  const [userNetwork, userAddress] = parseUserId(userId);
  const { tokenIds } = useCosmWasmUserNFTs(
    userNetwork?.id,
    itemsNFTsAddress, // TODO: properly fetch from arena config
    userAddress
  );
  const queryClient = useQueryClient();
  return (
    <ModalBase
      label="Add item"
      visible={isVisible}
      onClose={onClose}
      contentStyle={{ width: 800, paddingBottom: modalMarginPadding }}
      scrollable
    >
      <View
        style={{
          margin: -layout.spacing_x1,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {(tokenIds || []).map((tokenId) => {
          return (
            <OnchainNFTView
              style={{ margin: layout.spacing_x1 }}
              nftId={`${userNetwork?.idPrefix}-${itemsMintAddress}-${tokenId}`}
              onPress={wrapWithFeedback(async (nft) => {
                try {
                  const [, userAddress] = parseUserId(userId);
                  const network = mustGetCosmosNetwork(networkId);
                  const arenaContractAddress = network.arenaContractAddress;
                  if (!arenaContractAddress) {
                    throw new Error("No arena contract address");
                  }
                  const cosmWasmClient = await getKeplrSigningCosmWasmClient(
                    networkId
                  );
                  const nftClient = new TeritoriNftClient(
                    cosmWasmClient,
                    userAddress,
                    nft.nftContractAddress
                  );
                  const [, , tokenId] = parseNftId(nft.id);
                  await nftClient.sendNft({
                    contract: arenaContractAddress,
                    tokenId,
                    msg: "",
                  });
                  await queryClient.invalidateQueries([
                    "onchainNFTs",
                    networkId,
                    itemsNFTsAddress,
                    userAddress,
                  ]);
                  await queryClient.invalidateQueries([
                    "arena-player-items",
                    userId,
                  ]);
                  onClose?.();
                } catch (err) {
                  onClose?.();
                  throw err;
                }
              })}
            />
          );
        })}
      </View>
    </ModalBase>
  );
};

const PlayerItems: React.FC<{ playerId: string; canRetrieve: boolean }> = ({
  playerId,
  canRetrieve,
}) => {
  const [network, playerAddr] = parseUserId(playerId);
  const { playerItems } = useArenaPlayerItems(playerId);
  const { wrapWithFeedback } = useFeedbacks();
  const queryClient = useQueryClient();
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          margin: -layout.spacing_x1,
        }}
      >
        {(playerItems || []).map((item) => {
          // FIXME: how to get mint contract address here ??
          return (
            <OnchainNFTView
              style={{ margin: layout.spacing_x1 }}
              nftId={`${network?.idPrefix}-${itemsMintAddress}-${item[1]}`}
            />
          );
        })}
      </View>
      {!!playerItems?.length && canRetrieve && (
        <>
          <SpacerColumn size={1} />
          <PrimaryButton
            text="Retrieve items"
            loader
            onPress={wrapWithFeedback(async () => {
              const network = mustGetCosmosNetwork(networkId);
              if (!network.arenaContractAddress) {
                throw new Error("No arena contract address");
              }
              const senderAddress = playerAddr;
              if (!senderAddress) {
                throw new Error("No wallet");
              }
              const cosmWasmClient = await getKeplrSigningCosmWasmClient(
                networkId
              );
              const arenaClient = new ArenaClient(
                cosmWasmClient,
                senderAddress,
                network.arenaContractAddress
              );
              const items: { [key: string]: string[] } = {};
              for (const [nftContractAddress, nftTokenId] of playerItems ||
                []) {
                items[nftContractAddress] = [
                  ...(items[nftContractAddress] || []),
                  nftTokenId,
                ];
              }
              await arenaClient.retrieveItems({
                items: Object.entries(items).map(([k, v]) => ({
                  nft_contract_addr: k,
                  nft_token_ids: v,
                })),
              });
              await queryClient.invalidateQueries([
                "onchainNFTs",
                networkId,
                itemsNFTsAddress,
                playerAddr,
              ]);
              await queryClient.invalidateQueries([
                "arena-player-items",
                getUserId(networkId, playerAddr),
              ]);
            })}
          />
        </>
      )}
    </>
  );
};

const OnchainNFTView: React.FC<{
  nftId: string;
  style?: StyleProp<ViewStyle>;
  onPress?: (nft: NFT) => Promise<void>;
}> = ({ nftId, style, onPress }) => {
  const { info } = useNFTInfo(nftId);
  const [network, mintAddress] = parseNftId(nftId);
  const transformed: NFT = {
    id: nftId,
    networkId: network?.id || "",
    imageUri: info?.imageURL || "",
    name: info?.name || "Unknown",
    mintAddress,
    price: "0",
    denom: "utori",
    isListed: false,
    textInsert: "",
    collectionName: info?.collectionName || "Unknown",
    ownerId: getUserId(network?.id, info?.ownerAddress),
    nftContractAddress: info?.nftAddress || "",
    lockedOn: "",
    attributes: [],
  };
  return (
    <TouchableOpacity onPress={() => onPress?.(transformed)}>
      <NFTView style={style} data={transformed} />
    </TouchableOpacity>
  );
};

const useArenaGame = (gameId: string) => {
  const { data, ...other } = useQuery(
    ["arena-game", gameId],
    async () => {
      const network = mustGetCosmosNetwork(networkId);
      if (!network.arenaContractAddress) {
        throw new Error("No arena contract address");
      }
      const gameIdNum = +gameId;
      if (isNaN(gameIdNum)) {
        return null;
      }
      const cosmWasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const client = new ArenaQueryClient(
        cosmWasmClient,
        network.arenaContractAddress
      );
      const game = await client.getGame({ gameId: gameIdNum });
      return game;
    },
    { staleTime: Infinity }
  );
  return { game: data, ...other };
};

const useArenaGamePlayers = (gameId: string) => {
  const { data, ...other } = useQuery(
    ["arena-game-players", gameId],
    async () => {
      const network = mustGetCosmosNetwork(networkId);
      if (!network.arenaContractAddress) {
        throw new Error("No arena contract address");
      }
      const gameIdNum = +gameId;
      if (isNaN(gameIdNum)) {
        return null;
      }
      const cosmWasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const client = new ArenaQueryClient(
        cosmWasmClient,
        network.arenaContractAddress
      );
      const players = await client.getGamePlayers({ gameId: gameIdNum });
      return players;
    },
    { staleTime: Infinity }
  );
  return { gamePlayers: data, ...other };
};

const useArenaPlayerItems = (playerId: string) => {
  const { data, ...other } = useQuery(
    ["arena-player-items", playerId],
    async () => {
      const [playerNetwork, playerAddress] = parseUserId(playerId);
      const network = mustGetCosmosNetwork(playerNetwork?.id);
      if (!network.arenaContractAddress) {
        throw new Error("No arena contract address");
      }
      const cosmWasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const client = new ArenaQueryClient(
        cosmWasmClient,
        network.arenaContractAddress
      );
      const items = await client.getPlayerItems({
        playerAddr: playerAddress,
      });
      return items;
    },
    { staleTime: Infinity }
  );
  return { playerItems: data, ...other };
};

type PlayerGame =
  | {
      state: "idle";
      gameId: undefined;
    }
  | {
      state: "joined";
      gameId: number;
    };

const useArenaPlayerGameId = (playerAddr: string | undefined) => {
  const { data, ...other } = useQuery<PlayerGame | null>(
    ["arena-player-game-id", playerAddr],
    async () => {
      if (!playerAddr) {
        return null;
      }
      const network = mustGetCosmosNetwork(networkId);
      if (!network.arenaContractAddress) {
        throw new Error("No arena contract address");
      }
      const cosmWasmClient = await mustGetNonSigningCosmWasmClient(networkId);
      const client = new ArenaQueryClient(
        cosmWasmClient,
        network.arenaContractAddress
      );
      try {
        const gameId = await client.getPlayerGameId({ playerAddr });
        const r: PlayerGame = { state: "joined", gameId };
        return r;
      } catch (err: unknown) {
        if (
          !(err instanceof Error && err.message.includes("Player not in game"))
        ) {
          throw err;
        }
        const r: PlayerGame = { state: "idle", gameId: undefined };
        return r;
      }
    },
    { staleTime: Infinity }
  );
  return { game: data, ...other };
};
