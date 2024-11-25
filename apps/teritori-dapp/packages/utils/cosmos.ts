import { getNonSigningStargateClient, parseUserId } from "../networks";

export const getCosmosAccount = async (userId: string | undefined) => {
  const [network, address] = parseUserId(userId);

  if (!network) {
    return null;
  }

  const client = await getNonSigningStargateClient(network.id);

  return await client.getAccount(address);
};
