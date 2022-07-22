import { useSigningClient } from "../context/cosmwasm";

// Returns a token by name
export const getToken = async (name: string) => {
  const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string;

  const { signingClient } = useSigningClient();

  // setLoading(true)
  try {
    // If this query fails it means that the token does not exist.
    const token = await signingClient.queryContractSmart(contract, {
      nft_info: {
        token_id: name,
      },
    });
    return token.extension;
  } catch (e) {
    return undefined;
  }
  // setLoading(false)
};
