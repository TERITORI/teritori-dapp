import { LatLng } from "react-native-leaflet-view";

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
  NewArticleFormValues,
  NewPostFormValues,
  PostCategory,
  SocialFeedArticleMetadata,
  SocialFeedPostMetadata,
  ZodSocialFeedArticleMetadata,
  ZodSocialFeedPostMetadata,
} from "../types/feed";
import { RemoteFileData } from "../types/files";

import { gnoTeritoriNetwork } from "@/networks/gno-teritori";
import { teritoriNetwork } from "@/networks/teritori";

export const convertLegacyPostId = (legacyId: string) => {
  // a "legacy id" has no network prefix, we need to support those to preserve early permalinks
  let [network, localIdentifier] = parseNetworkObjectId(legacyId);
  if (!network) {
    // fallback to teritori or gno network if there is no network prefix in the id
    if (legacyId.includes("-")) {
      // teritori ids are uuids
      network = teritoriNetwork;
      localIdentifier = legacyId;
    } else {
      // gno ids are integers
      network = gnoTeritoriNetwork;
      localIdentifier = legacyId;
    }
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
  let category: PostCategory;
  if (gifs?.length) {
    category = PostCategory.Picture;
  } else if (files?.length) {
    if (files[0].fileType === "image") {
      category = PostCategory.Picture;
    } else if (files[0].fileType === "audio") {
      category = PostCategory.Audio;
    } else {
      category = PostCategory.VideoNote;
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

interface GeneratePostMetadataParams extends Omit<NewPostFormValues, "files"> {
  files: RemoteFileData[];
  premium: boolean;
  location?: LatLng;
}

interface GenerateArticleMetadataParams
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

export const generateArticleMetadata = ({
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
}: GenerateArticleMetadataParams): SocialFeedArticleMetadata => {
  const m = ZodSocialFeedArticleMetadata.parse({
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
  });
  // we need this hack until the createdAt field is properly provided by the contract
  // @ts-expect-error: description todo
  m.createdAt = new Date().toISOString();
  return m;
};
