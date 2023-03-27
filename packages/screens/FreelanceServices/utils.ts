import { getSigningCosmWasmClient } from "../../utils/keplr";

export const getSellerIpfsHash = async (address: string): Promise<string> => {
  try {
    const query_msg = {
      seller_profile: {
        seller: address,
      },
    };
    const contractAddress = process.env
      .TERITORI_SELLER_PROFILE_CONTRACT_ADRESS as string;
    const signingClient = await getSigningCosmWasmClient();
    const res = await signingClient.queryContractSmart(
      contractAddress,
      query_msg
    );
    if (!res) {
      return "";
    }
    return res.ipfs_hash;
  } catch (err) {
    console.log(err);
    return "";
  }
};
