import { getSigningCosmWasmClient } from "../../utils/keplr";

export const getSellerIpfsHash = async (address: string): Promise<string> => {
  try {
    const query_msg = {
      seller_profile: {
        seller: address,
      },
    };
    const contractAddress = process.env
      .TERITORI_SELLER_CONTRACT_ADRESS as string;
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

export const getGigsFromContract = async (
  startAfter: number | null,
  limit: number
): Promise<string[]> => {
  try {
    const contractAddress = process.env
      .TERITORI_SELLER_CONTRACT_ADRESS as string;
    const query_msg = {
      gigs: {
        start_after: startAfter,
        limit,
      },
    };
    const signingClient = await getSigningCosmWasmClient();
    const res = await signingClient.queryContractSmart(
      contractAddress,
      query_msg
    );
    return res.gigs as string[];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const updateSellerProfileToContract = async (
  walletAddress: string,
  ipfsHash: string
): Promise<boolean> => {
  try {
    const contractAddress = process.env
      .TERITORI_SELLER_CONTRACT_ADRESS as string;

    const msg = {
      update_seller_profile: {
        seller: walletAddress,
        ipfs_hash: ipfsHash,
      },
    } as any;
    const signingClient = await getSigningCosmWasmClient();
    const updatedProfileRes = await signingClient.execute(
      walletAddress!,
      contractAddress,
      msg,
      "auto"
    );
    return updatedProfileRes.transactionHash !== "";
  } catch (err) {
    console.log(err);
    return false;
  }
};
export const addGigToContract = async (
  walletAddress: string,
  gigInfo: string
): Promise<boolean> => {
  try {
    const contractAddress = process.env
      .TERITORI_SELLER_CONTRACT_ADRESS as string;

    const msg = {
      add_gig: {
        seller: walletAddress,
        gig_info: gigInfo,
      },
    } as any;
    const signingClient = await getSigningCosmWasmClient();
    const updatedProfileRes = await signingClient.execute(
      walletAddress!,
      contractAddress,
      msg,
      "auto"
    );
    return updatedProfileRes.transactionHash !== "";
  } catch (err) {
    console.log(err);
    return false;
  }
};
