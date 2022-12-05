import { v4 as uuidv4 } from "uuid";

import { nftStorageFile } from "../../candymachine/nft-storage-upload";
import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { IMAGE_MIME_TYPES, AUDIO_MIME_TYPES } from "../../utils/mime";
import { Wallet } from "./../../context/WalletsProvider/wallet";
import { defaultSocialFeedFee } from "./../../utils/fee";
import { PostCategory, NewPostFormValues } from "./NewsFeed.type";
interface GetAvailableFreePostParams {
  wallet?: Wallet;
}

export const getAvailableFreePost = async ({
  wallet,
}: GetAvailableFreePostParams) => {
  try {
    if (!wallet?.connected || !wallet.address) {
      return;
    }

    const client = await socialFeedClient({
      walletAddress: wallet.address,
    });

    const freePostCount = await client.queryAvailableFreePosts({
      wallet: wallet.address,
    });

    return Number(freePostCount);
  } catch (err) {
    console.log("getAvailableFreePost err", err);
  }
};

interface GetPostFeeParams {
  wallet?: Wallet;
  postCategory: PostCategory;
}

export const getPostFee = async ({
  wallet,
  postCategory,
}: GetPostFeeParams) => {
  try {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await socialFeedClient({
      walletAddress: wallet.address,
    });

    const cost = await client.queryFeeByCategory({
      category: postCategory,
    });

    return +cost;
  } catch (err) {
    console.log("getPostFee err", err);
  }
};

export const getPostCategory = ({
  title,
  file,
}: NewPostFormValues): PostCategory => {
  let category = PostCategory.Normal;
  if (file) {
    if (IMAGE_MIME_TYPES.includes(file.type)) {
      category = PostCategory.Picture;
    } else if (AUDIO_MIME_TYPES.includes(file.type)) {
      category = PostCategory.Audio;
    } else {
      category = PostCategory.Video;
    }
  } else if (title) {
    category = PostCategory.Article;
  } else {
    category = PostCategory.Normal;
  }
  return category;
};

interface CreatePostParams {
  wallet: Wallet | undefined;
  formValues: NewPostFormValues;
  freePostCount: number;
  fee: number;
  parentId?: string;
}

export const createPost = async ({
  wallet,
  formValues,
  freePostCount,
  fee,
  parentId,
}: CreatePostParams) => {
  try {
    if (!wallet?.connected || !wallet.address) {
      return;
    }

    const postCategory = getPostCategory(formValues);
    const client = await socialFeedClient({
      walletAddress: wallet.address,
    });

    let fileURL = "";
    if (formValues.file) {
      const fileData = await nftStorageFile(formValues.file);
      fileURL = fileData.data.image.href;
    }

    await client.createPost(
      {
        category: postCategory,
        identifier: uuidv4(),
        metadata: JSON.stringify({
          title: formValues.title || "",
          message: formValues.message || "",
          fileURL,
        }),
        parentPostIdentifier: parentId,
      },
      defaultSocialFeedFee,
      "",
      freePostCount
        ? undefined
        : [
            {
              denom: "utori",
              amount: String(fee),
            },
          ]
    );
  } catch (err) {
    console.log("initSubmit", err);
  }
};
