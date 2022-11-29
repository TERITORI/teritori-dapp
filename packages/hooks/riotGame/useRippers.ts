import {
  NFTsRequest,
  Sort,
  SortDirection,
} from "../../api/marketplace/v1/marketplace";
import {
  TeritoriNftClient,
  TeritoriNftQueryClient,
} from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import {
  TeritoriSquadStakingClient,
  TeritoriSquadStakingQueryClient,
} from "../../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.client";
import { useContractClients } from "../useContractClients";
import { useNFTs } from "../useNFTs";
import { Wallet } from "./../../context/WalletsProvider/wallet";

const THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS =
  process.env.THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS || "";

const THE_RIOT_COLLECTION_ADDRESS =
  process.env.THE_RIOT_COLLECTION_ADDRESS || "";

const useRippers = () => {
  const {
    client: squadStakingClient,
    queryClient: squadStakingQueryClient,
    selectedWallet,
  }: {
    client: TeritoriSquadStakingClient;
    queryClient: TeritoriSquadStakingQueryClient;
    selectedWallet: Wallet | undefined;
  } = useContractClients(
    THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS,
    TeritoriSquadStakingClient,
    TeritoriSquadStakingQueryClient
  );

  const {
    client: nftClient,
    queryClient: nftQueryClient,
  }: {
    client: TeritoriNftClient;
    queryClient: TeritoriNftQueryClient;
    selectedWallet: Wallet | undefined;
  } = useContractClients(
    THE_RIOT_COLLECTION_ADDRESS,
    TeritoriNftClient,
    TeritoriNftQueryClient
  );

  const myRippersRequest: NFTsRequest = {
    collectionId: `tori-${THE_RIOT_COLLECTION_ADDRESS}`,
    ownerId: selectedWallet?.address ? `tori-${selectedWallet.address}` : "",
    limit: 1000,
    offset: 0,
    sort: Sort.SORTING_UNSPECIFIED,
    sortDirection: SortDirection.SORT_DIRECTION_UNSPECIFIED,
  };
  const { nfts } = useNFTs(myRippersRequest);
  const myRippers = nfts as NSRiotGame.RipperListItem[];

  return {
    myRippers,
    squadStakingClient,
    squadStakingQueryClient,
    nftClient,
    nftQueryClient,
  };
};

export default useRippers;
