import { v4 as uuidv4 } from "uuid";

import { nftStorageFile } from "../../candymachine/nft-storage-upload";
import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { OpenGraphType } from "../../hooks/feed/types";
import { IMAGE_MIME_TYPES, AUDIO_MIME_TYPES } from "../../utils/mime";
import { Wallet } from "./../../context/WalletsProvider/wallet";
import { defaultSocialFeedFee } from "./../../utils/fee";
import {
  PostCategory,
  NewPostFormValues,
  SocialFeedMetadata,
} from "./NewsFeed.type";
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
  files,
}: NewPostFormValues): PostCategory => {
  let category = PostCategory.Normal;
  if (files) {
    if (IMAGE_MIME_TYPES.includes(files?.[0]?.type)) {
      category = PostCategory.Picture;
    } else if (AUDIO_MIME_TYPES.includes(files?.[0]?.type)) {
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
  openGraph?: OpenGraphType;
}

export const createPost = async ({
  wallet,
  formValues,
  freePostCount,
  fee,
  parentId,
  openGraph,
}: CreatePostParams) => {
  if (!wallet?.connected || !wallet.address) {
    return;
  }

  const postCategory = getPostCategory(formValues);
  const client = await socialFeedClient({
    walletAddress: wallet.address,
  });

  const fileURLs: string[] = [];

  if (formValues.files?.[0]) {
    Array.from(formValues.files).forEach(async (file) => {
      const fileData = await nftStorageFile(file);
      fileURLs.push(fileData.data.image.href);
    });
  }

  const metadata: SocialFeedMetadata = {
    title: formValues.title || "",
    message: formValues.message || "",
    fileURLs,
    hashtags: formValues.hashtags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await client.createPost(
    {
      category: postCategory,
      identifier: uuidv4(),
      metadata: JSON.stringify(metadata),
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
};
