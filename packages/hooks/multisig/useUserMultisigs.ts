import { useGetUserMultisigsQuery } from "../../api/multisig";
import { getCosmosNetwork, parseUserId } from "../../networks";
import { fetcherConfig } from "../../utils/faunaDB/multisig/multisigGraphql";

const batchSize = 100;

export const useUserMultisigs = (userId: string | undefined) => {
  const [network, userAddress] = parseUserId(userId);
  const cosmosNetwork = getCosmosNetwork(network?.id);
  const { data, ...other } = useGetUserMultisigsQuery(fetcherConfig, {
    chainId: cosmosNetwork?.chainId || "",
    userAddress,
    size: batchSize,
  });
  return { multisigs: data?.multisigs, ...other };
};
