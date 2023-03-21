import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View } from "react-native";

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
import {
  createPost,
  getPostCategory,
} from "../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { NotEnoughFundModal } from "../../components/socialFeed/NewsFeed/NotEnoughFundModal";
import { RichText } from "../../components/socialFeed/RichText";
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useUpdateAvailableFreePost } from "../../hooks/feed/useUpdateAvailableFreePost";
import { useUpdatePostFee } from "../../hooks/feed/useUpdatePostFee";
import { useBalances } from "../../hooks/useBalances";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId, NetworkKind } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { IMAGE_MIME_TYPES } from "../../utils/mime";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import {
  generateIpfsKey,
  removeFileFromArray,
  replaceFileInArray,
} from "../../utils/social-feed";
import { neutral00, neutral11, neutral77 } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../utils/style/fonts";
import { layout, NEWS_FEED_MAX_WIDTH } from "../../utils/style/layout";
import { pluralOrNot } from "../../utils/text";

export const FeedNewArticleScreen: ScreenFC<"FeedNewArticle"> = ({
  route: { params },
}) => {
  const { postFee, updatePostFee } = useUpdatePostFee();
  const { freePostCount, updateAvailableFreePost } =
    useUpdateAvailableFreePost();

  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedHashtags, setAddedHashtags] = useState<string[]>([]);
  const [addedMentions, setAddedMentions] = useState<string[]>([]);

  const { setToastSuccess, setToastError } = useFeedbacks();
  const navigation = useAppNavigation();
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const userId = getUserId(selectedNetworkId, wallet?.address);
  const balances = useBalances(
    process.env.TERITORI_NETWORK_ID,
    wallet?.address
  );
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewPostFormValues>({
    defaultValues: {
      title: params?.title || "",
      message: params?.message || "",
      files: params?.files || [],
      hashtags: params?.hashtags || [],
      mentions: params?.mentions || [],
    },
    mode: "onBlur",
  });
  const articleOrigin = useMemo(
    () =>
      params?.additionalMention
        ? `on ${params.additionalMention}`
        : params?.additionalHashtag
        ? `on ${params.additionalHashtag}`
        : "",
    [params?.additionalMention, params?.additionalHashtag]
  );
  //TODO: Not handled for now
  // const { mutate: openGraphMutate, data: openGraphData } = useOpenGraph();

  const formValues = watch();

  useEffect(() => {
    updateAvailableFreePost(
      selectedNetworkId,
      getPostCategory(formValues),
      wallet
    );
    updatePostFee(selectedNetworkId, getPostCategory(formValues));
  }, [
    formValues,
    wallet,
    selectedNetworkId,
    updatePostFee,
    updateAvailableFreePost,
  ]);

  const initSubmit = async () => {
    const toriBalance = balances.find((bal) => bal.denom === "utori");
    if (postFee > Number(toriBalance?.amount) && !freePostCount) {
      return setNotEnoughFundModal(true);
    }
    const additionalMention = params?.additionalMention
      ? `\n@${params?.additionalMention}`
      : "";
    const additionalHashtag = params?.additionalHashtag
      ? `\n#${params?.additionalHashtag}`
      : "";
    let pinataJWTKey = undefined;
    if (formValues.files?.length) {
      pinataJWTKey = await generateIpfsKey(selectedNetworkId, userId);
    }

    await createPost({
      networkId: selectedNetworkId,
      wallet,
      freePostCount,
      category: PostCategory.Article,
      fee: postFee,
      formValues: {
        ...formValues,
        files: formValues.files,
        mentions: [...addedMentions, additionalMention],
        hashtags: [...addedHashtags, additionalHashtag],
        message: formValues.message + additionalMention + additionalHashtag,
      },
      // TODO: We need this in backend, since opengraph card must be added for each written url ?
      // openGraph: undefined,
      pinataJWTKey,
    });
  };

  //TODO: Keep short post formValues when returning to short post
  const navigateBack = () => navigation.navigate("Feed");

  const onSubmit = async () => {
    setLoading(true);
    try {
      await initSubmit();
      setToastSuccess({ title: "Post submitted successfully.", message: "" });
      navigateBack();
      reset();
    } catch (err) {
      setToastError({
        title: "Something went wrong.",
        message: err.message,
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

  const handleOnChange = (
    html: string,
    hashtags?: string[],
    mentions?: string[]
  ) => {
    if (hashtags) setAddedHashtags(hashtags);
    if (mentions) setAddedMentions(mentions);
  };

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Cosmos}
      responsive
      maxWidth={NEWS_FEED_MAX_WIDTH}
      headerChildren={
        <BrandText style={fontSemibold20}>
          New Article {articleOrigin}
        </BrandText>
      }
      onBackPress={navigateBack}
      footerChildren
    >
      <NotEnoughFundModal
        onClose={() => setNotEnoughFundModal(false)}
        visible={isNotEnoughFundModal}
      />

      <View
        style={{
          marginTop: layout.contentPadding,
        }}
      >
        <WalletStatusBox />
        <SpacerColumn size={3} />

        <TertiaryBox
          fullWidth
          mainContainerStyle={{
            paddingVertical: layout.padding_x1,
            paddingHorizontal: layout.padding_x1_5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: 48,
            backgroundColor: neutral11,
          }}
        >
          <SVG source={priceSVG} height={24} width={24} color={neutral77} />
          <BrandText
            style={[
              fontSemibold13,
              { color: neutral77, marginLeft: layout.padding_x1 },
            ]}
          >
            {freePostCount
              ? `You have ${freePostCount} free ${pluralOrNot(
                  "Article",
                  freePostCount
                )} left`
              : `The cost for this Article is ${prettyPrice(
                  selectedNetworkId,
                  postFee.toString(),
                  "utori"
                )}`}
          </BrandText>
        </TertiaryBox>

        <FileUploader
          label="Cover image"
          style={{
            marginTop: layout.padding_x3,
          }}
          onUpload={(files) =>
            setValue("files", [
              ...(formValues.files || []),
              { ...files[0], isCoverImage: true },
            ])
          }
          mimeTypes={IMAGE_MIME_TYPES}
        />

        <TextInputCustom<NewPostFormValues>
          rules={{ required: true }}
          height={48}
          label="Give a title to make an Article"
          placeHolder="Type title here"
          name="title"
          control={control}
          variant="labelOutside"
          containerStyle={{ marginVertical: layout.padding_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
          }}
        />
        <Label isRequired>Article content</Label>
        {/**@ts-ignore  error:TS2589: Type instantiation is excessively deep and possibly infinite. */}
        <Controller
          name="message"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur } }) => (
            <RichText
              onChange={(html, hashtags, mentions) => {
                onChange(html, hashtags, mentions);
                handleOnChange(html, hashtags, mentions);
              }}
              onBlur={onBlur}
              onImageUpload={(file) =>
                setValue("files", [...(formValues.files || []), file])
              }
              onAudioUpload={(file) =>
                setValue("files", [...(formValues.files || []), file])
              }
              onAudioRemove={(file) =>
                setValue(
                  "files",
                  removeFileFromArray(formValues.files || [], file)
                )
              }
              onAudioUpdate={(file) =>
                setValue(
                  "files",
                  replaceFileInArray(formValues.files || [], file)
                )
              }
              onVideoUpload={(file) =>
                setValue("files", [...(formValues.files || []), file])
              }
              onGIFSelected={(url) =>
                url && setValue("gifs", [...(formValues.gifs || []), url])
              }
              isGIFSelectorDisabled={
                (formValues.files?.[0] &&
                  formValues.files[0].fileType !== "image") ||
                (formValues.files || []).length +
                  (formValues.gifs || [])?.length >=
                  4
              }
              isAudioUploadDisabled={
                !!formValues.files?.length || !!formValues.gifs?.length
              }
              isVideoUploadDisabled={
                !!formValues.files?.length || !!formValues.gifs?.length
              }
              initialValue={formValues.message}
              publishButtonProps={{
                disabled:
                  errors?.message?.type === "required" ||
                  !formValues.message ||
                  !formValues.title ||
                  !wallet,
                loading,
                text: "Publish",
                onPress: handleSubmit(onSubmit),
              }}
            />
          )}
        />
      </View>
    </ScreenContainer>
  );
};
