import { useFocusEffect } from "@react-navigation/native";
import { SelectionState } from "draft-js";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
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
import { SpacerColumn } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useOpenGraph } from "../../hooks/feed/useOpenGraph";
import { useUpdateAvailableFreePost } from "../../hooks/feed/useUpdateAvailableFreePost";
import { useUpdatePostFee } from "../../hooks/feed/useUpdatePostFee";
import { useBalances } from "../../hooks/useBalances";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId, NetworkKind } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { FEED_POST_SUPPORTED_MIME_TYPES } from "../../utils/mime";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { URL_REGEX } from "../../utils/regex";
import { generateIpfsKey } from "../../utils/social-feed";
import { neutral00, neutral11 } from "../../utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "../../utils/style/fonts";
import { layout, NEWS_FEED_MAX_WIDTH } from "../../utils/style/layout";
import { pluralOrNot, replaceBetweenString } from "../../utils/text";

export const FeedNewArticleScreen: ScreenFC<"FeedNewArticle"> = ({
  route: { params },
}) => {
  // variables
  const { postFee, updatePostFee } = useUpdatePostFee();
  const { freePostCount, updateAvailableFreePost } =
    useUpdateAvailableFreePost();

  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const oldUrlMatch = useRef<string>();

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
  const { mutate, data } = useOpenGraph();
  const formValues = watch();

  // hooks
  useFocusEffect(
    useCallback(() => {
      updateAvailableFreePost(selectedNetworkId, PostCategory.Article, wallet);
      updatePostFee(selectedNetworkId, PostCategory.Article, wallet);
    }, [wallet?.address])
  );

  const initSubmit = async () => {
    const toriBalance = balances.find((bal) => bal.denom === "utori");
    if (postFee > Number(toriBalance?.amount) && !freePostCount) {
      return setNotEnoughFundModal(true);
    }
    const currentFiles = formValues.files?.filter(
      (file) => file.isCoverImage || formValues.message.includes(file.url)
    );
    const additionalMention = params?.additionalMention
      ? `\n${params?.additionalMention}`
      : "";
    const additionalHashtag = params?.additionalHashtag
      ? `\n${params?.additionalHashtag}`
      : "";

    const pinataJWTKey = await generateIpfsKey(selectedNetworkId, userId);

    await createPost({
      networkId: selectedNetworkId,
      wallet,
      freePostCount,
      category: PostCategory.Article,
      fee: postFee,
      formValues: {
        ...formValues,
        files: currentFiles,
        message: formValues.message + additionalMention + additionalHashtag,
      },
      openGraph: data,
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

  const handleOnChange = (html: string) => {
    const currentUrlMatches = [...html.matchAll(new RegExp(URL_REGEX, "gi"))];

    if (currentUrlMatches?.length) {
      const lastUrl = currentUrlMatches.pop();
      const url = lastUrl && lastUrl[0].split("<")[0];

      if (url && url !== oldUrlMatch.current) {
        oldUrlMatch.current = url;

        mutate({
          url,
        });
      }
    }
  };

  //FIXME: This doesn't add the emoji to the RichText
  const onEmojiSelected = (selection: SelectionState, emoji: string | null) => {
    if (emoji) {
      let copiedValue = `${formValues.message}`;
      copiedValue = replaceBetweenString(
        copiedValue,
        selection.getStartOffset(),
        selection.getEndOffset(),
        emoji
      );
      setValue("message", copiedValue);
    }
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
      {/*TODO: We can now remove that*/}
      {/*{isNFTKeyModal && (*/}
      {/*  <NFTKeyModal*/}
      {/*    onClose={(key?: string) => {*/}
      {/*      if (key) {*/}
      {/*        setValue("nftStorageApiToken", key);*/}
      {/*        initSubmit(key);*/}
      {/*      }*/}
      {/*      setIsNFTKeyModal(false);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*)}*/}
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
            justifyContent: "space-between",
            height: 48,
            backgroundColor: neutral11,
          }}
        >
          <BrandText style={fontSemibold13}>
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
          mimeTypes={FEED_POST_SUPPORTED_MIME_TYPES}
        />

        <TextInputCustom<NewPostFormValues>
          rules={{ required: true }}
          height={52}
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
              onChange={(html) => {
                onChange(html);
                handleOnChange(html);
              }}
              onBlur={onBlur}
              onImageUpload={(files) =>
                setValue("files", [...(formValues.files || []), ...files])
              }
              onAudioUpload={(files) => setValue("files", [files?.[0]])}
              onVideoUpload={(files) => setValue("files", [files?.[0]])}
              onEmojiSelected={onEmojiSelected}
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
              openGraph={data}
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
        {/*TODO: ok to remove that since PublishButton is disabled if !formValues.message ? */}
        {/*{errors?.message?.type === "required" && (*/}
        {/*  <ErrorText>Message is required</ErrorText>*/}
        {/*)}*/}
      </View>
    </ScreenContainer>
  );
};
