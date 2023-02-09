import { omit } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { nftStorageFile } from "../../../candymachine/nft-storage-upload";
import { socialFeedClient } from "../../../client-creators/socialFeedClient";
import { Wallet } from "../../../context/WalletsProvider";
import { OpenGraphType } from "../../../hooks/feed/types";
import { defaultSocialFeedFee } from "../../../utils/fee";
import { LocalFileData, RemoteFileData } from "../../../utils/types/feed";
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
  let category: PostCategory;
  if (files?.length) {
    if (files[0].fileType === "image") {
      category = PostCategory.Picture;
    } else if (files[0].fileType === "audio") {
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
  nftStorageApiToken?: string;
}

export const createPost = async ({
  wallet,
  formValues,
  freePostCount,
  fee,
  parentId,
  nftStorageApiToken,
}: CreatePostParams) => {
  if (!wallet?.connected || !wallet.address) {
    return;
  }

  const postCategory = getPostCategory(formValues);
  const client = await socialFeedClient({
    walletAddress: wallet.address,
  });

  let files: RemoteFileData[] = [];

  if (formValues.files?.[0] && nftStorageApiToken) {
    files = await uploadPostFilesToNFTStorage({
      files: formValues.files,
      nftStorageApiToken,
    });
  }

  const metadata = generatePostMetadata({
    title: formValues.title || "",
    message: formValues.message || "",
    files,
    hashtags: formValues.hashtags || [],
  });

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

interface UploadPostFilesToNFTStorageParams {
  files: LocalFileData[];
  nftStorageApiToken: string;
}

export const uploadPostFilesToNFTStorage = async ({
  files,
  nftStorageApiToken,
}: UploadPostFilesToNFTStorageParams): Promise<RemoteFileData[]> => {
  const formattedFiles: RemoteFileData[] = [];
  for (const file of files) {
    const fileData = await nftStorageFile({
      file: file.file,
      nftStorageApiToken,
    });

    if (file.thumbnailFileData) {
      const thumbnailData = await nftStorageFile({
        file: file.thumbnailFileData.file,
        nftStorageApiToken,
      });
      formattedFiles.push({
        ...omit(file, "file"),
        url: fileData.data.image.href,
        thumbnailFileData: {
          ...omit(file.thumbnailFileData, "file"),
          url: thumbnailData.data.image.href,
        },
      });
    } else {
      formattedFiles.push({
        ...omit(file, "file"),
        url: fileData.data.image.href,
      });
    }
  }
  return formattedFiles;
};

interface GeneratePostMetadataParams {
  title: string;
  message: string;
  files: RemoteFileData[];
  hashtags: string[];
  gifs?: string[];
}

export const generatePostMetadata = ({
  title,
  message,
  files,
  hashtags,
  gifs,
}: GeneratePostMetadataParams): SocialFeedMetadata => {
  return {
    title: title || "",
    message: message || "",
    files,
    hashtags: hashtags || [],
    gifs: gifs || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
