import {
  nonSigningSocialFeedClient,
  signingSocialFeedClient,
} from "../../client-creators/socialFeedClient";
import { getNetwork, NetworkKind, parseUserId } from "../../networks";
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
}: NewPostFormValues): PostCategory => {
  let category: PostCategory;
  if (files?.length) {
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
}: GeneratePostMetadataParams): SocialFeedPostMetadata => {
  const m = ZodSocialFeedPostMetadata.parse({
    title,
    message,
    files,
    hashtags,
    mentions,
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
