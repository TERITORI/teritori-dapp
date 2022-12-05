import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ErrorText } from "../../components/ErrorText";
import {
  NewPostFormValues,
  PostCategory,
} from "../../components/NewsFeed/NewsFeed.type";
import {
  getAvailableFreePost,
  getPostCategory,
  getPostFee,
  createPost,
} from "../../components/NewsFeed/NewsFeedQueries";
import { NotEnoughFundModal } from "../../components/NewsFeed/NotEnoughFundModal";
import { RichText } from "../../components/RichText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletStatusBox } from "../../components/WalletStatusBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { FileUploader } from "../../components/fileUploader";
import {
  Label,
  TextInputCustom,
} from "../../components/inputs/TextInputCustom";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useBalances } from "../../hooks/useBalances";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { FEED_POST_SUPPORTED_MIME_TYPES } from "../../utils/mime";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral00 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { AddMoreButton } from "./AddMoreButton";

export const FeedNewPostScreen: ScreenFC<"FeedNewPost"> = () => {
  const [postFee, setPostFee] = useState(0);
  const [freePostCount, setFreePostCount] = useState(0);
  const [postCategory, setPostCategory] = useState<PostCategory>(
    PostCategory.Normal
  );

  const [isAddMore, setAddMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setToastSuccess } = useFeedbacks();
  const navigation = useAppNavigation();
  const wallet = useSelectedWallet();
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
      title: "",
      message: "",
    },
    mode: "onBlur",
  });
  const formValues = watch();

  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);

  const updateAvailableFreePost = async () => {
    const freePost = await getAvailableFreePost({ wallet });
    setFreePostCount(freePost || 0);
  };

  const updatePostFee = async () => {
    const fee = await getPostFee({ wallet, postCategory });
    setPostFee(fee);
  };

  const updatePostCategory = () => {
    setPostCategory(getPostCategory(formValues));
  };

  useFocusEffect(
    React.useCallback(() => {
      if (wallet?.connected && wallet?.address) {
        updateAvailableFreePost();
        updatePostFee();
      }
    }, [wallet?.address])
  );

  useEffect(() => {
    updatePostCategory();
  }, [formValues]);

  const initSubmit = async () => {
    const toriBalance = balances.find((bal) => bal.denom === "utori");
    if (postFee > Number(toriBalance?.amount) && !freePostCount) {
      return setNotEnoughFundModal(true);
    }

    await createPost({
      wallet,
      freePostCount,
      fee: postFee,
      formValues,
    });
  };

  const navigateBack = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Feed");

  const onSubmit = async () => {
    setLoading(true);
    await initSubmit();
    reset();
    setToastSuccess({ title: "Post submitted successfully.", message: "" });
    setLoading(false);
    navigateBack();
  };

  return (
    <ScreenContainer
      responsive
      maxWidth={592}
      headerChildren={<BrandText style={fontSemibold20}>New Post</BrandText>}
      onBackPress={navigateBack}
      fixedFooterChildren={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingVertical: layout.padding_x2_5,
          }}
        >
          <AddMoreButton onPress={() => setAddMore(true)} />
          <PrimaryButton
            disabled={loading}
            loader={loading}
            text={`Publish ${
              postFee > 0 && !freePostCount ? `${postFee} TORI` : ""
            }`}
            size="M"
            style={{ marginLeft: layout.padding_x3 }}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      }
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
        <FileUploader
          label="Cover image"
          style={{
            marginTop: layout.padding_x3,
          }}
          onUpload={(files) => setValue("file", files?.[0])}
          mimeTypes={FEED_POST_SUPPORTED_MIME_TYPES}
        />
        <TextInputCustom<NewPostFormValues>
          label="Give it a title to make long post"
          placeHolder="Type title here"
          name="title"
          control={control}
          variant="labelOutside"
          containerStyle={{ marginVertical: layout.padding_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
          }}
        />
        <Label isRequired>Message</Label>
        {/**@ts-ignore  error:TS2589: Type instantiation is excessively deep and possibly infinite. */}
        <Controller
          name="message"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur } }) => (
            <RichText
              staticToolbar={isAddMore}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors?.message?.type === "required" && (
          <ErrorText>Message is required</ErrorText>
        )}
      </View>
    </ScreenContainer>
  );
};
