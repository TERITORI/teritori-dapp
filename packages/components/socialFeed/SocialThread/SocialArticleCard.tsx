import React, {FC, useEffect, useState} from "react";
import {Post} from "../../../api/feed/v1/feed";
import {StyleProp, View, ViewStyle} from "react-native";
import {OnPressReplyType} from "../../../screens/FeedPostView/FeedPostViewScreen";
import {neutral00, neutral33, neutralA3} from "../../../utils/style/colors";
import {layout} from "../../../utils/style/layout";
import {OptimizedImage} from "../../OptimizedImage";
import {SocialFeedArticleMetadata, SocialFeedMetadata, ZodSocialFeedArticleMetadata} from "../NewsFeed/NewsFeed.type";
import {
  useTeritoriSocialFeedReactPostMutation
} from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.react-query";
import { getUpdatedReactions} from "../../../utils/social-feed";
import {signingSocialFeedClient} from "../../../client-creators/socialFeedClient";
import {useSelectedNetworkInfo} from "../../../hooks/useSelectedNetwork";
import {SpacerColumn} from "../../spacer";
import {BrandText} from "../../BrandText";
import {createStateFromHTML, getTruncatedArticleHTML, isArticleHTMLNeedsTruncate} from "../RichText/RichText.web";
import defaultCoverImage from "../../../../assets/default-images/default-user-profile-banner.png"
import {fontSemibold14, fontSemibold20} from "../../../utils/style/fonts";
import {ipfsURLToHTTPURL} from "../../../utils/ipfs";


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


  // TODO: Remove oldMetadata usage after reroll feed indexer

  const [shortDescription, setShortDescription] = useState("")
  const metadata: SocialFeedArticleMetadata|null = ZodSocialFeedArticleMetadata.safeParse(JSON.parse(localPost.metadata)).success ? ZodSocialFeedArticleMetadata.parse(localPost.metadata) : null
  const oldMetadata: SocialFeedMetadata = JSON.parse(localPost.metadata)
  const coverImage = metadata?.coverImage
    // Old articles doesn't have coverImage, but they have a file coverImage = true
    || oldMetadata?.files?.find(file => file.isCoverImage)

  console.log('ZodSocialFeedArticleMetadata.safeParse(JSON.parse(localPost.metadata))',ZodSocialFeedArticleMetadata.safeParse(JSON.parse(localPost.metadata)))
  console.log('JSON.parse(localPost.metadata)',JSON.parse(localPost.metadata))
  console.log('==== oldMetadata?.files?.find(file => file.isCoverImage)',oldMetadata?.files?.find(file => file.isCoverImage))


  // Truncate the article html
  useEffect(() => {
    if (isArticleHTMLNeedsTruncate((metadata || oldMetadata).message, true)) {
      const {truncatedHtml} = getTruncatedArticleHTML((metadata || oldMetadata).message)
      const contentState = createStateFromHTML(truncatedHtml).getCurrentContent()
      console.log('contentState.getPlainText()contentState.getPlainText()contentState.getPlainText()', contentState.getPlainText())
      setShortDescription(metadata?.shortDescription
        // Old articles doesn't have shortDescription, so we use the start of the html content
        || contentState.getPlainText()
      )
    }
  }, [metadata?.message]);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);









  // OK TODO: Use start of the first <p> as shortDescription
  // OK TODO: use zod to validate ArticleMetadata
  // OK TODO: Add shortDescription in ArticleMetadata
  // TODO: Add field shortDescription in NewArticleScreen
  // TODO: Stick bottom bar on new article page





  console.log('localPostlocalPostlocalPost', localPost)
  console.log('metadatametadatametadatametadata', metadata)
  console.log('previewMessagepreviewMessagepreviewMessage', shortDescription)
  console.log('coverImagecoverImagecoverImage', coverImage)
  console.log('(metadata || oldMetadata).title', (metadata || oldMetadata).title)

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
        <BrandText style={fontSemibold20}>{(metadata || oldMetadata).title.trim().replace("\n", "")}</BrandText>

        <SpacerColumn size={1}/>
        <BrandText style={[fontSemibold14, {color: neutralA3}]} numberOfLines={3}>{shortDescription.trim().replace("\n", "")}</BrandText>
      </View>

      <OptimizedImage
        width={viewWidth/3}
        height={ARTICLE_CARD_LARGE_HEIGHT}
        sourceURI={ipfsURLToHTTPURL(coverImage?.url)}
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
