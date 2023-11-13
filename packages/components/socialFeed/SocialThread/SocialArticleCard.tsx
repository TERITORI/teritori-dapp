import React, {FC, useEffect, useMemo, useState} from "react";
import {Post} from "../../../api/feed/v1/feed";
import {StyleProp, View, ViewStyle} from "react-native";
import {OnPressReplyType} from "../../../screens/FeedPostView/FeedPostViewScreen";
import {CustomPressable} from "../../buttons/CustomPressable";
import {neutral00, neutral33, withAlpha} from "../../../utils/style/colors";
import {layout} from "../../../utils/style/layout";
import {OptimizedImage} from "../../OptimizedImage";
import {SocialFeedMetadata} from "../NewsFeed/NewsFeed.type";
import {
  useTeritoriSocialFeedReactPostMutation
} from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import {getUpdatedReactions} from "../../../utils/social-feed";
import {signingSocialFeedClient} from "../../../client-creators/socialFeedClient";
import {useSelectedNetworkInfo} from "../../../hooks/useSelectedNetwork";
import {SpacerColumn, SpacerRow} from "../../spacer";
import {BrandText} from "../../BrandText";
import {EditorState} from "draft-js";
import {getTruncatedArticleHTML, isArticleHTMLNeedsTruncate} from "../RichText/RichText.web";
import defaultCoverImage from "../../../../assets/default-images/default-user-profile-banner.png"


const ARTICLE_CARD_LARGE_HEIGHT = 200
export const SocialArticleCard: FC<{
  post: Post;
  style?: StyleProp<ViewStyle>;
  isPostConsultation?: boolean;
  fadeInDelay?: number;
  onPressReply?: OnPressReplyType;
  isGovernance?: boolean;
  refetchFeed?: () => Promise<any>;
  isSmall?: boolean;
}> = ({
                                             post,
                                             style,
isPostConsultation,
fadeInDelay,
onPressReply,
isGovernance,
refetchFeed,
                                           }) => {
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const [localPost, setLocalPost] = useState<Post>(post);
  const [viewWidth, setViewWidth] = useState(0);

  // TODO: Hook useCosmosReactions ?
  const { mutate: postMutate, isLoading: isPostMutationLoading } =
    useTeritoriSocialFeedReactPostMutation({
      onSuccess(_data, variables) {
        const reactions = getUpdatedReactions(
          post.reactions,
          variables.msg.icon,
        );

        setLocalPost({ ...localPost, reactions });
      },
    });
  const cosmosReaction = async (emoji: string, walletAddress: string) => {
    const client = await signingSocialFeedClient({
      networkId: selectedNetworkInfo?.id || "",
      walletAddress,
    });

    postMutate({
      client,
      msg: {
        icon: emoji,
        identifier: localPost.identifier,
        up: true,
      },
    });
  };
  const [previewMessage, setPreviewMessage] = useState("")
  const metadata: SocialFeedMetadata = JSON.parse(localPost.metadata);
  const coverImage = metadata.files?.find(file => file.isCoverImage)

  console.log('isArticleHTMLNeedsTruncate(metadata.message, isPreview)', isArticleHTMLNeedsTruncate(metadata.message, true))


  // // Truncate the article html
  // useEffect(() => {
  //   if (isArticleHTMLNeedsTruncate(metadata.message, true)) {
  //     const {truncatedHtml} = getTruncatedArticleHTML(metadata.message)
  //     setPreviewMessage(truncatedHtml)
  //   }
  // }, [metadata.message]);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);









  // TODO: Use start of the first <p> as shortDescription
  // TODO: use zod to validate ArticleMetadata
  // TODO: Add shortDescription in ArticleMetadata
  // TODO: Add field shortDescription in NewArticleScreen





  console.log('localPostlocalPostlocalPost', localPost)
  console.log('metadatametadatametadatametadata', metadata)
  console.log('previewMessagepreviewMessagepreviewMessage', previewMessage)

  return (
    <View
      onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
      style={{
        borderWidth: 1,
        borderColor: neutral33,
        borderRadius: 12,
        backgroundColor: neutral00,
        width: "100%",
        height: ARTICLE_CARD_LARGE_HEIGHT,

        flexDirection: "row",
        justifyContent: "space-between"
    }}>
      <View style={{
        paddingVertical: layout.spacing_x2,
        paddingHorizontal: layout.spacing_x2_5,
        flex: 1
      }}>
        <BrandText>{metadata.title}</BrandText>

        {/*TODO: Can't use truncated HTML here, it's visually broken*/}
        {/*<SpacerColumn size={1}/>*/}
        {/*<BrandText>{previewMessage}</BrandText>*/}
      </View>


      <OptimizedImage
        width={viewWidth/3}
        height={ARTICLE_CARD_LARGE_HEIGHT}
        sourceURI={coverImage?.url}
        fallbackURI={defaultCoverImage}
        style={{
          width: viewWidth/3,
          height: ARTICLE_CARD_LARGE_HEIGHT,
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
      />
    </View>
  )
}
