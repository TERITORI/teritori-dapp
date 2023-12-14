import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import priceSVG from "../../../assets/icons/price.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletStatusBox } from "../../components/WalletStatusBox";
import { LegacyTertiaryBox } from "../../components/boxes/LegacyTertiaryBox";
import { FileUploader } from "../../components/fileUploader";
import {
  Label,
  TextInputCustom,
} from "../../components/inputs/TextInputCustom";
import {
  NewArticleFormValues,
  PostCategory,
} from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { RichText } from "../../components/socialFeed/RichText";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useFeedPostFee } from "../../hooks/feed/useFeedPostFee";
import { useFreePostsCount } from "../../hooks/feed/useFreePostsCount";
import { useMakeArticle } from "../../hooks/feed/useMakeArticle";
import { useIsMobile } from "../../hooks/useIsMobile";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkFeature } from "../../networks";
import { IMAGE_MIME_TYPES } from "../../utils/mime";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import {
  ARTICLE_COVER_IMAGE_MAX_HEIGHT,
  ARTICLE_COVER_IMAGE_RATIO,
  ARTICLE_MAX_WIDTH,
  ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT,
  ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
} from "../../utils/social-feed";
import {
  neutral00,
  neutral11,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { pluralOrNot } from "../../utils/text";

//TODO: In mobile : Make ActionsContainer accessible (floating button ?)

export const FeedNewArticleScreen: ScreenFC<"FeedNewArticle"> = () => {
  const isMobile = useIsMobile();
  const wallet = useSelectedWallet();
  const userId = wallet?.userId;
  const { freePostCount } = useFreePostsCount(userId, PostCategory.Article);
  const { prettyPostFee } = useFeedPostFee(userId, PostCategory.Article);
  const { makeArticle, isProcessing, isLoading } = useMakeArticle({
    userId,
    onSuccess: () => {
      setToastSuccess({ title: "Post submitted successfully.", message: "" });
      navigateBack();
      reset();
    },
  });
  const { setToastSuccess } = useFeedbacks();
  const navigation = useAppNavigation();

  const {
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewArticleFormValues>({
    defaultValues: {
      title: "",
      message: "",
      files: [],
      gifs: [],
      hashtags: [],
      mentions: [],
      thumbnailImage: undefined,
      shortDescription: "",
    },
    mode: "onBlur",
  });
  //TODO: Not handled for now
  // const { mutate: openGraphMutate, data: openGraphData } = useOpenGraph();

  const formValues = watch();

  //TODO: Keep short post formValues when returning to short post
  const navigateBack = () => navigation.navigate("Feed");

  // // OpenGraph URL preview
  // useEffect(() => {
  //   addedUrls.forEach(url => {
  //     openGraphMutate({
  //       url,
  //     });
  //
  //   })
  // }, [addedUrls])

  return (
    <ScreenContainer
      forceNetworkFeatures={[NetworkFeature.SocialFeed]}
      responsive
      mobileTitle="NEW ARTICLE"
      maxWidth={ARTICLE_MAX_WIDTH}
      headerChildren={<BrandText style={fontSemibold20}>New Article</BrandText>}
      onBackPress={navigateBack}
      footerChildren
    >
      <View
        style={{
          marginTop: isMobile ? layout.spacing_x2 : layout.contentSpacing,
        }}
      >
        <WalletStatusBox />
        <SpacerColumn size={3} />

        <LegacyTertiaryBox
          fullWidth
          mainContainerStyle={{
            paddingVertical: layout.spacing_x1,
            paddingHorizontal: layout.spacing_x1_5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: 48,
            backgroundColor: neutral11,
          }}
        >
          <SVG
            source={priceSVG}
            height={24}
            width={24}
            color={secondaryColor}
          />
          <BrandText
            style={[
              fontSemibold13,
              { color: neutral77, marginLeft: layout.spacing_x1 },
            ]}
          >
            {freePostCount
              ? `You have ${freePostCount} free ${pluralOrNot(
                  "Article",
                  freePostCount,
                )} left`
              : `The cost for this Article is ${prettyPostFee}`}
          </BrandText>
        </LegacyTertiaryBox>

        <FileUploader
          label="Thumbnail image"
          style={{
            marginTop: layout.spacing_x3,
          }}
          fileImageStyle={{
            objectFit: "cover",
            height: ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT,
            maxWidth: ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
          }}
          onUpload={(files) => setValue("thumbnailImage", files[0])}
          mimeTypes={IMAGE_MIME_TYPES}
        />

        <FileUploader
          label="Cover image"
          style={{
            marginTop: layout.spacing_x3,
            width: "100%",
          }}
          fileImageStyle={{
            objectFit: "cover",
            height: "100%",
            width: "100%",
            maxHeight: ARTICLE_COVER_IMAGE_MAX_HEIGHT,
            aspectRatio: ARTICLE_COVER_IMAGE_RATIO,
          }}
          onUpload={(files) => setValue("coverImage", files[0])}
          mimeTypes={IMAGE_MIME_TYPES}
        />

        <TextInputCustom<NewArticleFormValues>
          noBrokenCorners
          rules={{ required: true }}
          height={48}
          label="Title"
          placeHolder="Type title here"
          name="title"
          control={control}
          variant="labelOutside"
          containerStyle={{ marginVertical: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />

        <TextInputCustom<NewArticleFormValues>
          noBrokenCorners
          rules={{ required: true }}
          multiline
          label="Short description"
          placeHolder="Type short description here"
          name="shortDescription"
          control={control}
          variant="labelOutside"
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />

        <View>
          <Label>Article content</Label>
          <SpacerColumn size={1} />
          <Controller
            name="message"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur } }) => (
              <RichText
                onChange={onChange}
                onBlur={onBlur}
                initialValue={formValues.message}
                loading={isProcessing || isLoading}
                publishDisabled={
                  errors?.message?.type === "required" ||
                  !formValues.message ||
                  !formValues.title ||
                  !formValues.shortDescription ||
                  !wallet
                }
                onPublish={(richTextPublishValues) =>
                  makeArticle({ formValues, richTextPublishValues })
                }
                authorId={userId || ""}
                postId=""
              />
            )}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
