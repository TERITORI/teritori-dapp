import {
  nonSigningMusicPlayerClient,
  signingMusicPlayerClient,
} from "../../client-creators/musicplayerClient";
import { Wallet } from "../../context/WalletsProvider";
import { MusicAlbumCategory } from "../../utils/types/music";

interface GetPostFeeParams {
  networkId: string;
  postCategory: MusicAlbumCategory;
}

export const getPostFee = async ({
  networkId,
  postCategory,
}: GetPostFeeParams) => {
  try {
    const client = await nonSigningMusicPlayerClient({
      networkId,
    });
    const cost = await client.queryFeeByCategory({
      category: postCategory,
    });
    return +cost;
  } catch (err) {
    console.error("getPostFee err", err);
  }
};

interface GetAvailableFreePostParams {
  networkId: string;
  wallet?: Wallet;
}

export const getAvailableFreePost = async ({
  networkId,
  wallet,
}: GetAvailableFreePostParams) => {
  try {
    if (!wallet?.connected || !wallet.address) {
      return;
    }

    const client = await signingMusicPlayerClient({
      networkId,
      walletAddress: wallet.address,
    });

    const freePostCount = await client.queryAvailableFreePosts({
      wallet: wallet.address,
    });

    return Number(freePostCount);
  } catch (err) {
    console.error("getAvailableFreePost err", err);
  }
};
