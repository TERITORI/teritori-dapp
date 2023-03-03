import { omit } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { nftStorageFile } from "../../../candymachine/nft-storage-upload";
import { socialFeedClient } from "../../../client-creators/socialFeedClient";
import { Wallet } from "../../../context/WalletsProvider";
import { OpenGraphType } from "../../../hooks/feed/types";
import { defaultSocialFeedFee } from "../../../utils/fee";
import { LocalFileData, RemoteFileData } from "../../../utils/types/feed";
import { ipfsURLToHTTPURL } from "./../../../utils/ipfs";
import {
  PostCategory,
  NewPostFormValues,
  SocialFeedMetadata,
} from "./NewsFeed.type";
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

    const client = await socialFeedClient({
      networkId,
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
  networkId: string;
  wallet?: Wallet;
  postCategory: PostCategory;
}

export const getPostFee = async ({
  networkId,
  wallet,
  postCategory,
}: GetPostFeeParams) => {
  try {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await socialFeedClient({
      networkId,
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
  networkId: string;
  wallet: Wallet | undefined;
  formValues: NewPostFormValues;
  freePostCount: number;
  fee: number;
  category: PostCategory;
  parentId?: string;
  openGraph?: OpenGraphType;
  nftStorageApiToken?: string;
}

export const createPost = async ({
  networkId,
  wallet,
  formValues,
  freePostCount,
  fee,
  parentId,
  nftStorageApiToken,
  category,
}: CreatePostParams) => {
  if (!wallet?.connected || !wallet.address) {
    return;
  }

  const client = await socialFeedClient({
    networkId,
    walletAddress: wallet.address,
  });

  let files: RemoteFileData[] = [];

  if (formValues.files?.[0] && nftStorageApiToken) {
    files = await uploadPostFilesToNFTStorage({
      files: formValues.files,
      nftStorageApiToken,
    });
  }

  let message = formValues.message || "";

  if (category === PostCategory.Article) {
    formValues.files?.map((file, index) => {
      message = message.replace(file.url, ipfsURLToHTTPURL(files[index].url));
    });
  }

  const metadata = generatePostMetadata({
    title: formValues.title || "",
    message,
    files,
    hashtags: formValues.hashtags || [],
    mentions: formValues.mentions || [],
  });

  await client.createPost(
    {
      category,
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
  mentions: string[];
  gifs?: string[];
}

export const generatePostMetadata = ({
  title,
  message,
  files,
  hashtags,
  mentions,
  gifs,
}: GeneratePostMetadataParams): SocialFeedMetadata => {
  return {
    title: title || "",
    message: message || "",
    files,
    hashtags: hashtags || [],
    mentions: mentions || [],
    gifs: gifs || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
