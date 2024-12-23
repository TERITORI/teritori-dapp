import {
  nonSigningSocialFeedClient,
  signingSocialFeedClient,
} from "../../client-creators/socialFeedClient";
import {
  getNetwork,
  getNetworkObjectId,
  NetworkKind,
  parseNetworkObjectId,
  parseUserId,
} from "../../networks";
import {
  CustomLatLngExpression,
  NewArticleFormValues,
  NewPostFormValues,
  PostCategory,
  SocialFeedArticleMarkdownMetadata,
  SocialFeedPostMetadata,
  ZodSocialFeedArticleMarkdownMetadata,
  ZodSocialFeedPostMetadata,
} from "../types/feed";
import { RemoteFileData } from "../types/files";

import { teritoriNetwork } from "@/networks/teritori";

export const convertLegacyPostId = (legacyId: string) => {
  // a "legacy id" has no network prefix, we need to support those to preserve early permalinks
  let [network, localIdentifier] = parseNetworkObjectId(legacyId);
  if (!network) {
    network = teritoriNetwork;
    localIdentifier = legacyId;
  }
  return getNetworkObjectId(network?.id, localIdentifier);
};

export const getAvailableFreePost = async (userId: string) => {
  const [network, userAddress] = parseUserId(userId);

  if (!userAddress || network?.kind !== NetworkKind.Cosmos) {
    return;
  }

  const client = await signingSocialFeedClient({
    networkId: network.id,
    walletAddress: userAddress,
  });

  const freePostCount = await client.queryAvailableFreePosts({
    wallet: userAddress,
  });

  return Number(freePostCount);
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
    const network = getNetwork(networkId);

    if (network?.kind !== NetworkKind.Cosmos) {
      return;
    }

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
  gifs,
}: NewPostFormValues): PostCategory => {
  if (gifs?.length) return PostCategory.Picture;
  if (files?.length) {
    switch (files[0].fileType) {
      case "image":
        return PostCategory.Picture;
      case "audio":
        return PostCategory.Audio;
      default:
        return PostCategory.VideoNote;
    }
  }
  if (title) return PostCategory.Article;
  if (message.startsWith("/question")) return PostCategory.Question;
  if (message.startsWith("/generate"))
    return PostCategory.BriefForStableDiffusion;
  return PostCategory.Normal;
};

interface GeneratePostMetadataParams extends Omit<NewPostFormValues, "files"> {
  files: RemoteFileData[];
  premium: boolean;
  location?: CustomLatLngExpression;
}

interface GenerateArticleMarkdownMetadataParams
  extends Omit<
    NewArticleFormValues,
    "files" | "thumbnailImage" | "coverImage"
  > {
  files: RemoteFileData[];
  thumbnailImage?: RemoteFileData;
  coverImage?: RemoteFileData;
}

export const generatePostMetadata = ({
  title,
  message,
  files,
  hashtags,
  mentions,
  gifs,
  premium,
  location,
}: GeneratePostMetadataParams): SocialFeedPostMetadata => {
  const m = ZodSocialFeedPostMetadata.parse({
    title,
    message,
    files,
    hashtags,
    mentions,
    location,
    gifs: gifs || [],
    ...(premium ? { premium: 1 } : {}), // save blockchain space by not including premium if it's 0
  });
  // @ts-expect-error: we need this hack until the createdAt field is properly provided by the contract
  m.createdAt = new Date().toISOString();
  return m;
};

export const generateArticleMarkdownMetadata = ({
  title,
  message,
  files,
  hashtags,
  mentions,
  gifs,
  nftStorageApiToken,
  thumbnailImage,
  coverImage,
  shortDescription,
  location,
}: GenerateArticleMarkdownMetadataParams): SocialFeedArticleMarkdownMetadata => {
  const m = ZodSocialFeedArticleMarkdownMetadata.parse({
    title,
    message,
    files,
    hashtags,
    mentions,
    gifs: gifs || [],
    nftStorageApiToken: nftStorageApiToken || "",
    thumbnailImage,
    coverImage,
    shortDescription: shortDescription || "",
    location,
  });
  // we need this hack until the createdAt field is properly provided by the contract
  // @ts-expect-error: description todo
  m.createdAt = new Date().toISOString();
  return m;
};
