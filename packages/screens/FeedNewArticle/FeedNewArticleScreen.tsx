import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { useSelector } from "react-redux";

import priceSVG from "../../../assets/icons/price.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletStatusBox } from "../../components/WalletStatusBox";
import { TertiaryBox } from "../../components/boxes/TertiaryBox";
import { FileUploader } from "../../components/fileUploader";
import {
  Label,
  TextInputCustom,
} from "../../components/inputs/TextInputCustom";
import {
  NewPostFormValues,
  PostCategory,
} from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { createPost } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { NotEnoughFundModal } from "../../components/socialFeed/NewsFeed/NotEnoughFundModal";
import { RichText } from "../../components/socialFeed/RichText";
import { PublishValues } from "../../components/socialFeed/RichText/RichText.type";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useFeedPosting } from "../../hooks/feed/useFeedPosting";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkFeature } from "../../networks";
import { selectNFTStorageAPI } from "../../store/slices/settings";
import { generateIpfsKey } from "../../utils/ipfs";
import { IMAGE_MIME_TYPES } from "../../utils/mime";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { ARTICLE_THUMBNAIL_IMAGE_HEIGHT } from "../../utils/social-feed";
import {
  neutral00,
  neutral11,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../utils/style/fonts";
import { layout, screenContentMaxWidth } from "../../utils/style/layout";
import { pluralOrNot } from "../../utils/text";

//TODO: In mobile : Make ActionsContainer accessible (floating button ?)

export const FeedNewArticleScreen: ScreenFC<"FeedNewArticle"> = () => {
  const isMobile = useIsMobile();
  const selectNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectNetworkInfo?.id || "";
  const wallet = useSelectedWallet();
  const userId = wallet?.userId;
  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { canPayForPost, freePostCount, publishingFee, prettyPublishingFee } =
    useFeedPosting(userId, PostCategory.Article);

  const { setToastSuccess, setToastError } = useFeedbacks();
  const navigation = useAppNavigation();

  const {
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewPostFormValues>({
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

  const initSubmit = async ({
    html,
    hashtags,
    mentions,
    images,
    gifs,
    audios,
    videos,
  }: PublishValues) => {
    if (!canPayForPost) {
      return setNotEnoughFundModal(true);
    }

    const files = [
      ...(formValues.files || []),
      ...images,
      ...audios,
      ...videos,
    ];

    let pinataJWTKey = undefined;
    if (files?.length) {
      pinataJWTKey =
        userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
    }

    // TODO: refactor to use useFeedPosting's makePost
    const result = await createPost({
      networkId: selectedNetworkId,
      wallet,
      freePostCount,
      category: PostCategory.Article,
      fee: publishingFee.amount,
      formValues: {
        ...formValues,
        gifs,
        files,
        mentions,
        hashtags,
        message: html,
      },
      // TODO: We need this in backend, since opengraph card must be added for each written url ?
      // openGraph: undefined,
      pinataJWTKey,
    });
    return result;
  };

  //TODO: Keep short post formValues when returning to short post
  const navigateBack = () => navigation.navigate("Feed");

  const onPublish = async (values: PublishValues) => {
    setLoading(true);
    try {
      const result = await initSubmit(values);
      if (!result) {
        console.error("upload file err : Fail to pin to IPFS");
        setToastError({
          title: "File upload failed",
          message: "Fail to pin to IPFS, please try to Publish again",
        });
      } else {
        setToastSuccess({ title: "Post submitted successfully.", message: "" });
        navigateBack();
        reset();
      }
    } catch (err) {
      setToastError({
        title: "Something went wrong.",
        message: err instanceof Error ? err.message : `${err}`,
      });
      console.error("post submit error", err);
    }

    setLoading(false);
  };

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
      maxWidth={screenContentMaxWidth}
      headerChildren={<BrandText style={fontSemibold20}>New Article</BrandText>}
      onBackPress={navigateBack}
      footerChildren
    >
      <NotEnoughFundModal
        onClose={() => setNotEnoughFundModal(false)}
        visible={isNotEnoughFundModal}
      />

      <View
        style={{
          marginTop: isMobile ? layout.spacing_x2 : layout.contentSpacing,
        }}
      >
        <WalletStatusBox />
        <SpacerColumn size={3} />

        <TertiaryBox
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
              : `The cost for this Article is ${prettyPublishingFee}`}
          </BrandText>
        </TertiaryBox>

        <FileUploader
          label="Thumbnail image"
          fileHeight={ARTICLE_THUMBNAIL_IMAGE_HEIGHT}
          isImageCover
          style={{
            marginTop: layout.spacing_x3,
            width: 364,
          }}
          onUpload={(files) => setValue("thumbnailImage", files[0])}
          mimeTypes={IMAGE_MIME_TYPES}
        />

        <TextInputCustom<NewPostFormValues>
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

        <TextInputCustom<NewPostFormValues>
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
                loading={loading}
                publishDisabled={
                  errors?.message?.type === "required" ||
                  !formValues.message ||
                  !formValues.title ||
                  !formValues.shortDescription ||
                  !formValues.thumbnailImage ||
                  !wallet
                }
                onPublish={onPublish}
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
