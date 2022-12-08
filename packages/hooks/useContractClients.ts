import { useEffect, useState } from "react";

import {
  TeritoriBreedingClient,
  TeritoriBreedingQueryClient,
} from "../contracts-clients/teritori-breeding/TeritoriBreeding.client";
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
};

export const useContractClients = (
  contractAddress: string,
  contractName: ContractName
) => {
  const { clientClass, queryClientClass } = CONTRACT_CLIENT_MAP[contractName];

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
  };

  useEffect(() => {
    updateClients();
  }, [selectedWallet]);

  return { selectedWallet, client, queryClient };
};
