import React from "react";
import { Image } from "react-native";

import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { ARTICLE_COVER_IMAGE_HEIGHT } from "../../../utils/social-feed";
import { layout } from "../../../utils/style/layout";
import { RemoteFileData } from "../../../utils/types/files";
import { BrandText } from "../../BrandText";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { RichText } from "../RichText";

interface Props {
  metadata: SocialFeedMetadata;
  audioFiles?: RemoteFileData[];
  isPreview?: boolean;
  postId: string;
  authorId: string;
}

export const ArticleRenderer: React.FC<Props> = ({
  metadata,
  audioFiles,
  isPreview,
  postId,
  authorId,
}) => {
  const coverImage = metadata.files?.find((file) => file.isCoverImage);

  return (
    <>
      {!!metadata?.title && (
        <BrandText style={{ marginBottom: layout.spacing_x1 }}>
          {metadata.title}
        </BrandText>
      )}
      {!!coverImage && (
        <Image
          source={{ uri: ipfsURLToHTTPURL(coverImage.url) }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: ARTICLE_COVER_IMAGE_HEIGHT,
            marginBottom: layout.spacing_x1_5,
          }}
        />
      )}

      <RichText
        initialValue={metadata.message}
        isPostConsultation
        isPreview={isPreview}
        audioFiles={audioFiles}
        postId={postId}
        authorId={authorId}
      />
    </>
  );
};
