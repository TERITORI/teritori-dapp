import React, { FC } from "react";

import { Post } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SmallCarouselAlt } from "@/components/carousels/SmallCarousel/SmallCarouselAlt";
import { MapPostWrapper } from "@/components/socialFeed/Map/MapPosts/MapPostWrapper";
import { GIF_URL_REGEX } from "@/utils/regex";
import { zodTryParseJSON } from "@/utils/sanitize";
import { errorColor } from "@/utils/style/colors";
import { fontSemibold10 } from "@/utils/style/fonts";
import { ZodSocialFeedPostMetadata } from "@/utils/types/feed";

export const PictureMapPost: FC<{
  post: Post;
}> = ({ post }) => {
  const postMetadata = zodTryParseJSON(
    ZodSocialFeedPostMetadata,
    post.metadata,
  );
  const imagesFiles = postMetadata?.files?.filter(
    (file) => file.fileType === "image" || file.fileType === "base64",
  );

  return (
    <MapPostWrapper post={post}>
      {!imagesFiles?.length && !postMetadata?.gifs?.length ? (
        <BrandText style={[fontSemibold10, { color: errorColor }]}>
          No image found
        </BrandText>
      ) : (
        <SmallCarouselAlt
          enabled={false}
          style={{ width: 147 }}
          width={147}
          data={[...(imagesFiles || []), ...(postMetadata?.gifs || [])]}
          height={147}
          // We render images and gifs
          renderItem={({ item }) =>
            !item.url && !GIF_URL_REGEX.test(item) ? (
              <BrandText style={[fontSemibold10, { color: errorColor }]}>
                Image not found
              </BrandText>
            ) : (
              <OptimizedImage
                sourceURI={GIF_URL_REGEX.test(item) ? item : item.url}
                width={147}
                height={147}
                resizeMode="cover"
                style={{
                  height: 147,
                  width: 147,
                  borderRadius: 4,
                  alignSelf: "center",
                }}
              />
            )
          }
        />
      )}
    </MapPostWrapper>
  );
};
