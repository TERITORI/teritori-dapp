import { fromJson } from "@bufbuild/protobuf";

import {
  generateArticleMarkdownMetadata,
  generatePostMetadata,
} from "./feed/queries";
import { PostCategory, PostsList } from "./types/feed";
import { FileType, RemoteFileData } from "./types/files";

import { Post, Reaction } from "@/api/feed/v1/feed";
import {
  PostView,
  PostViewJson,
  PostViewSchema,
} from "@/api/feeds/v1/feeds_pb";
import { getNetworkObjectId, getUserId } from "@/networks";
import { gnoZenaoNetwork } from "@/networks/gno-zenao";

export const postViewsFromJson = (raw: unknown) => {
  const list = raw as unknown[];
  return list.map((elem) => fromJson(PostViewSchema, elem as PostViewJson));
};

const categoryFromPostView = ({ post }: PostView): PostCategory => {
  switch (post!.post.case) {
    case "article":
      return PostCategory.Article;
    case "audio":
      return PostCategory.Audio;
    case "image":
      return PostCategory.Picture;
    case "link":
      if (post!.tags.includes("poll")) return PostCategory.Poll;
      return PostCategory.Normal;
    case "standard":
      return PostCategory.Normal;
    case "video":
      return PostCategory.VideoNote;
    default:
      return PostCategory.Normal;
  }
};

const reactionsFromPostView = ({ reactions }: PostView): Reaction[] =>
  reactions.map(({ icon, count, userHasVoted }) => ({
    icon,
    count,
    ownState: userHasVoted,
  }));

const guessMimeTypeFromExtension = (ext: string): string => {
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "mp4":
      return "video/mp4";
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    default:
      return "application/octet-stream"; // fallback
  }
};

const guessFileTypeFromMime = (mimeType: string): FileType => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "file"; // fallback
};

const ipfsFileInsertionRegex = /!\[([^\]]+)\]\((ipfs:\/\/[^)]+)\)/g;
const extractIpfsFiles = (content: string): RemoteFileData[] => {
  const matches = [...content.matchAll(ipfsFileInsertionRegex)];

  return matches.map((match, i) => {
    const fileNameFromMarkdown = match[1]; // e.g., Zenao-InsideEventDesc-Long-TMP.png
    const url = match[2];

    const ext = fileNameFromMarkdown.split(".").pop()?.toLowerCase() || "";
    const mimeType = guessMimeTypeFromExtension(ext);
    const fileType = guessFileTypeFromMime(mimeType);

    return {
      fileName: fileNameFromMarkdown || `File${i + 1}`,
      mimeType,
      size: 0, // We don't know it
      url,
      fileType,
    };
  });
};

const cleanMdContent = (content: string): string => {
  // Remove IPFS file insertion from markdown
  return content.replace(ipfsFileInsertionRegex, "").trim();
};

const metadataFromPostView = (postView: PostView): string => {
  const post = postView.post!;
  let metadata = {};
  switch (post.post.case) {
    case "article":
      metadata = generateArticleMarkdownMetadata({
        title: post.post.value.title,
        message: post.post.value.content,
        thumbnailImage: {
          fileName: "Image", // We don't know it
          mimeType: "image/jpeg", // We don't know it
          size: 0, // We don't know it
          url: post.post.value.previewImageUri,
          fileType: "image",
          isThumbnailImage: true,
        },
        shortDescription: post.post.value.previewText,
        location: post.loc,
        files: [],
        hashtags: [],
        mentions: [],
      });
      break;
    case "standard":
      metadata = generatePostMetadata({
        title: "",
        message: cleanMdContent(post.post.value.content),
        location: post.loc,
        files: extractIpfsFiles(post.post.value.content),
        hashtags: [],
        mentions: [],
        premium: false,
      });
      break;
    case "video":
      metadata = generatePostMetadata({
        title: post.post.value.title,
        message: cleanMdContent(post.post.value.description),
        location: post.loc,
        files: [
          {
            fileName: "Video", // We don't know it
            mimeType: "video/mp4", // We don't know it
            size: 0, // We don't know it
            url: post.post.value.videoUri,
            fileType: "video",
            thumbnailFileData: {
              fileName: "Image", // We don't know it
              mimeType: "image/jpeg", // We don't know it
              size: 0, // We don't know it
              url: post.post.value.thumbnailImageUri,
              fileType: "image",
            },
          },
        ],
        hashtags: [],
        mentions: [],
        premium: false,
      });
      break;
    case "audio":
      metadata = generatePostMetadata({
        title: post.post.value.title,
        message: cleanMdContent(post.post.value.description),
        location: post.loc,
        files: [
          {
            fileName: "Audo", // We don't know it
            mimeType: "audio/mpeg", // We don't know it
            size: 0, // We don't know it
            url: post.post.value.imageUri,
            fileType: "audio",
          },
        ],
        hashtags: [],
        mentions: [],
        premium: false,
      });
      break;
    case "image":
      metadata = generatePostMetadata({
        title: post.post.value.title,
        message: cleanMdContent(post.post.value.description),
        location: post.loc,
        files: [
          {
            fileName: "Image", // We don't know it
            mimeType: "image/jpeg", // We don't know it
            size: 0, // We don't know it
            url: post.post.value.imageUri,
            fileType: "image",
          },
        ],
        hashtags: [],
        mentions: [],
        premium: false,
      });
      break;
    // TODO:
    //
    // case "link":
    // return generatePollMetadata({
    // ......
    // });
    // break;
    default:
      metadata = generatePostMetadata({
        title: "",
        message: "WARNING: UNKNOWN ZENAO POST CASE",
        location: post.loc,
        files: [],
        hashtags: [],
        mentions: [],
        premium: false,
      });
  }
  return JSON.stringify(metadata);
};

export const postViewToPost = (postView: PostView): Post => {
  const localIdentifier = postView.post!.localPostId.toString();
  return {
    category: categoryFromPostView(postView),
    isDeleted: false,
    identifier: localIdentifier,
    metadata: metadataFromPostView(postView),
    parentPostIdentifier: "",
    subPostLength: Number(postView.childrenCount),
    authorId: getUserId(gnoZenaoNetwork.id, postView.post?.author),
    createdAt: Number(postView.post?.createdAt),
    reactions: reactionsFromPostView(postView),
    tipAmount: 0, // Not handled yet in zenao
    premiumLevel: 0,
    id: getNetworkObjectId(gnoZenaoNetwork.id, localIdentifier),
    localIdentifier,
    networkId: gnoZenaoNetwork.id,
  };
};

export const postViewsToPostsList = (postViews: PostView[]): PostsList => {
  const list: Post[] = postViews
    .filter((postView) => !!postView.post)
    .map((postView) => postViewToPost(postView));

  const postsList = {
    list,
    totalCount: postViews.length,
  };
  return postsList;
};
