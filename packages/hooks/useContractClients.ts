import { useEffect, useState } from "react";

import { Wallet } from "../context/WalletsProvider";
import {
  TeritoriBreedingClient,
  TeritoriBreedingQueryClient,
} from "../contracts-clients/teritori-breeding/TeritoriBreeding.client";
import {
  TeritoriDistributorClient,
  TeritoriDistributorQueryClient,
} from "../contracts-clients/teritori-distributor/TeritoriDistributor.client";
import {
  TeritoriNftStakingClient,
  TeritoriNftStakingQueryClient,
} from "../contracts-clients/teritori-nft-staking/TeritoriNftStaking.client";
import {
  TeritoriNftVaultClient,
  TeritoriNftVaultQueryClient,
} from "../contracts-clients/teritori-nft-vault/TeritoriNftVault.client";
import {
  TeritoriNftClient,
  TeritoriNftQueryClient,
} from "../contracts-clients/teritori-nft/TeritoriNft.client";
import {
  TeritoriSquadStakingClient,
  TeritoriSquadStakingQueryClient,
} from "../contracts-clients/teritori-squad-staking/TeritoriSquadStaking.client";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../utils/keplr";
import useSelectedWallet from "./useSelectedWallet";

type ContractName =
  | "teritori-nft"
  | "teritori-nft-staking"
  | "teritori-nft-vault"
  | "teritori-breeding"
  | "teritori-distributor"
  | "teritori-squad-staking";

const CONTRACT_CLIENT_MAP: {
  [name in ContractName]: { clientClass: any; queryClientClass: any };
} = {
  "teritori-nft": {
    clientClass: TeritoriNftClient,
    queryClientClass: TeritoriNftQueryClient,
  },
  "teritori-nft-staking": {
    clientClass: TeritoriNftStakingClient,
    queryClientClass: TeritoriNftStakingQueryClient,
  },
  "teritori-nft-vault": {
    clientClass: TeritoriNftVaultClient,
    queryClientClass: TeritoriNftVaultQueryClient,
  },
  "teritori-squad-staking": {
    clientClass: TeritoriSquadStakingClient,
    queryClientClass: TeritoriSquadStakingQueryClient,
  },
  "teritori-breeding": {
    clientClass: TeritoriBreedingClient,
    queryClientClass: TeritoriBreedingQueryClient,
  },
  "teritori-distributor": {
    clientClass: TeritoriDistributorClient,
    queryClientClass: TeritoriDistributorQueryClient,
  },
};

type ClientType<T> = T extends "teritori-nft"
  ? TeritoriNftClient
  : T extends "teritori-nft-staking"
  ? TeritoriNftStakingClient
  : T extends "teritori-nft-vault"
  ? TeritoriNftVaultClient
  : T extends "teritori-squad-staking"
  ? TeritoriSquadStakingClient
  : T extends "teritori-breeding"
  ? TeritoriBreedingClient
  : T extends "teritori-distributor"
  ? TeritoriDistributorClient
  : never;

type QueryClientType<T> = T extends "teritori-nft"
  ? TeritoriNftQueryClient
  : T extends "teritori-nft-staking"
  ? TeritoriNftStakingQueryClient
  : T extends "teritori-nft-vault"
  ? TeritoriNftVaultQueryClient
  : T extends "teritori-squad-staking"
  ? TeritoriSquadStakingQueryClient
  : T extends "teritori-breeding"
  ? TeritoriBreedingQueryClient
  : T extends "teritori-distributor"
  ? TeritoriDistributorQueryClient
  : never;

type ContractClients<T> = {
  selectedWallet: Wallet | undefined;
  isReady: boolean;
  client: ClientType<T>;
  queryClient: QueryClientType<T>;
};

export const useContractClients = <T extends ContractName>(
  contractName: T,
  contractAddress: string
): ContractClients<T> => {
  const { clientClass, queryClientClass } = CONTRACT_CLIENT_MAP[contractName];

  const [isReady, setIsReady] = useState(false);
  const [client, setClient] = useState<typeof clientClass | null>(null);
  const [queryClient, setQueryClient] = useState<
    typeof queryClientClass | null
  >(null);

  const selectedWallet = useSelectedWallet();

  const updateClients = async () => {
    const nonSigningClient = await getNonSigningCosmWasmClient();
    const _queryClient = new queryClientClass(
      nonSigningClient,
      contractAddress
    );
    setQueryClient(_queryClient);

    if (selectedWallet) {
      const signingClient = await getSigningCosmWasmClient();
      const _client = new clientClass(
        signingClient,
        selectedWallet.address,
        contractAddress
      );
      setClient(_client);
    }
    setIsReady(true);
  };

  useEffect(() => {
    updateClients();
  }, [selectedWallet?.address]);

  return { selectedWallet, client, queryClient, isReady };
};
