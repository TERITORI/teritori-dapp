import { coin } from "@cosmjs/amino";
import { v4 as uuidv4 } from "uuid";

import {
  PostCategory,
  NewPostFormValues,
  SocialFeedMetadata,
} from "./NewsFeed.type";
import {
  nonSigningSocialFeedClient,
  signingSocialFeedClient,
} from "../../../client-creators/socialFeedClient";
import { Wallet } from "../../../context/WalletsProvider";
import { defaultSocialFeedFee } from "../../../utils/fee";
import { ipfsURLToHTTPURL, uploadFilesToPinata } from "../../../utils/ipfs";
import { RemoteFileData } from "../../../utils/types/files";
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

    const client = await signingSocialFeedClient({
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

interface GetPostFeeParams {
  networkId: string;
  postCategory: PostCategory;
}

export const getPostFee = async ({
  networkId,
  postCategory,
}: GetPostFeeParams) => {
  try {
    const client = await nonSigningSocialFeedClient({
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

export const getPostCategory = ({
  title,
  files,
  message,
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
  } else if (message.startsWith("/question")) {
    category = PostCategory.Question;
  } else if (message.startsWith("/generate")) {
    category = PostCategory.BriefForStableDiffusion;
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
  // openGraph?: OpenGraphType;
  pinataJWTKey?: string;
  identifier?: string;
}

// =============== Used only for Article for now. (Sorry for the mess)
export const createPost = async ({
  networkId,
  wallet,
  formValues,
  freePostCount,
  fee,
  parentId,
  pinataJWTKey,
  category,
  identifier,
}: CreatePostParams) => {
  if (!wallet?.connected || !wallet.address) {
    return;
  }

  const client = await signingSocialFeedClient({
    networkId,
    walletAddress: wallet.address,
  });

  let files: RemoteFileData[] = [];

  if (formValues.files?.length && pinataJWTKey) {
    files = await uploadFilesToPinata({
      files: formValues.files,
      pinataJWTKey,
    });
  }

  // If the user uploaded files but they are not pinned to IPFS, it returns files with empty url, so this is an error.
  if (formValues.files?.length && !files.find((file) => file.url)) {
    return;
  }

  let message = formValues.message || "";

  if (files.length && category === PostCategory.Article) {
    formValues.files?.map((file, index) => {
      // Audio are not in the HTML for now
      if (files[index]?.fileType !== "audio") {
        message = message.replace(file.url, ipfsURLToHTTPURL(files[index].url));
      }
    });
  }

  const metadata = generatePostMetadata({
    title: formValues.title || "",
    message,
    files,
    gifs: formValues.gifs || [],
    hashtags: formValues.hashtags || [],
    mentions: formValues.mentions || [],
  });

  await client.createPost(
    {
      category,
      identifier: identifier || uuidv4(),
      metadata: JSON.stringify(metadata),
      parentPostIdentifier: parentId,
    },
    defaultSocialFeedFee,
    "",
    freePostCount ? undefined : [coin(fee, "utori")]
  );
  return true;
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
