import React from "react";
import { Image } from "react-native";

import { ipfsURLToHTTPURL } from "../../../utils/ipfs";
import { layout } from "../../../utils/style/layout";
import { RemoteFileData } from "../../../utils/types/feed";
import { BrandText } from "../../BrandText";
import { SocialFeedMetadata } from "../NewsFeed/NewsFeed.type";
import { RichText } from "../RichText";

interface Props {
  metadata: SocialFeedMetadata;
  audioFiles?: RemoteFileData[];
}
// TODO: Rework this ! Set a max height for preview
export const ArticlePreview: React.FC<Props> = ({ metadata, audioFiles }) => {
  const coverImage = metadata.files?.find((file) => file.isCoverImage);

  return (
    <>
      {!!metadata?.title && (
        <BrandText style={{ marginBottom: layout.padding_x1 }}>
          {metadata.title}
        </BrandText>
      )}
      {!!coverImage && (
        <Image
          source={{ uri: ipfsURLToHTTPURL(coverImage.url) }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 240,
            marginBottom: layout.padding_x1_5,
          }}
        />
      )}

      <RichText
        initialValue={metadata.message}
        isPostConsultation
        audioFiles={audioFiles}
      />
    </>
  );
};
