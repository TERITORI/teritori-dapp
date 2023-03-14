import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletStatusBox } from "../../components/WalletStatusBox";
import { FileUploader } from "../../components/fileUploader";
import {
  Label,
  TextInputCustom,
} from "../../components/inputs/TextInputCustom";
import { NFTKeyModal } from "../../components/socialFeed/NewsFeed/NFTKeyModal";
import {
  NewPostFormValues,
  PostCategory,
} from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import {
  getAvailableFreePost,
  getPostFee,
  createPost,
} from "../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { NotEnoughFundModal } from "../../components/socialFeed/NewsFeed/NotEnoughFundModal";
import { RichText } from "../../components/socialFeed/RichText";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useOpenGraph } from "../../hooks/feed/useOpenGraph";
import { useBalances } from "../../hooks/useBalances";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId, NetworkKind } from "../../networks";
import { FEED_POST_SUPPORTED_MIME_TYPES } from "../../utils/mime";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { URL_REGEX } from "../../utils/regex";
import { generateIpfsKey } from "../../utils/social-feed";
import { neutral00 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout, NEWS_FEED_MAX_WIDTH } from "../../utils/style/layout";

export const FeedNewArticleScreen: ScreenFC<"FeedNewArticle"> = ({
  route: { params },
}) => {
  // variables
  const [postFee, setPostFee] = useState(0);
  const [freePostCount, setFreePostCount] = useState(0);

  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const oldUrlMatch = useRef<string>();
  const [isNFTKeyModal, setIsNFTKeyModal] = useState(false);

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
      if (wallet?.connected && wallet?.address) {
        updateAvailableFreePost();
        updatePostFee();
      }
    }, [wallet?.address])
  );

  // functions
  const updateAvailableFreePost = async () => {
    const freePost = await getAvailableFreePost({
      networkId: selectedNetworkId,
      wallet,
    });
    setFreePostCount(freePost || 0);
  };

  const updatePostFee = async () => {
    const fee = await getPostFee({
      networkId: selectedNetworkId,
      wallet,
      postCategory: PostCategory.Article,
    });
    setPostFee(fee || 0);
  };

  const initSubmit = async (nftStorageApiToken: string) => {
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
    if (!!formValues.files?.length && !formValues.nftStorageApiToken) {
      return setIsNFTKeyModal(true);
    }

    setLoading(true);
    try {
      await initSubmit(formValues.nftStorageApiToken || "");
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
      {isNFTKeyModal && (
        <NFTKeyModal
          onClose={(key?: string) => {
            if (key) {
              setValue("nftStorageApiToken", key);
              initSubmit(key);
            }
            setIsNFTKeyModal(false);
          }}
        />
      )}
      <NotEnoughFundModal
        onClose={() => setNotEnoughFundModal(false)}
        visible={isNotEnoughFundModal}
      />

      <View
        style={{
          marginTop: layout.contentPadding,
        }}
      >
        <WalletStatusBox maxAddressLength={50} />
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
              onImageUpload={(image) =>
                setValue("files", [...(formValues.files || []), image])
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
                text: `Publish ${
                  postFee > 0 && !freePostCount
                    ? `${((postFee || 0) / 1000000).toFixed(4)} TORI`
                    : ""
                }`,
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
