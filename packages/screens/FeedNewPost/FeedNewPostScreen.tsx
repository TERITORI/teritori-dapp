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

export const FeedNewPostScreen: ScreenFC<"FeedNewPost"> = ({
  route: { params },
}) => {
  const [postFee, setPostFee] = useState(0);
  const [freePostCount, setFreePostCount] = useState(0);
  const [postCategory, setPostCategory] = useState<PostCategory>(
    PostCategory.Normal
  );

  const [isAddMoreVisible, setIsAddMoreVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setToastSuccess, setToastError } = useFeedbacks();
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
      title: params?.title || "",
      message: params?.message || "",
      file: params?.file,
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
    setPostFee(fee || 0);
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
    try {
      await initSubmit();
      setToastSuccess({ title: "Post submitted successfully.", message: "" });
      navigateBack();
      reset();
    } catch (err) {
      setToastError({
        title: "Something went wrong.",
        message: "Couldn't submit your request, please try again later. ",
      });
      console.log("post submit error", err);
    }

    setLoading(false);
  };

  const toggleAddMore = () => setIsAddMoreVisible(!isAddMoreVisible);

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
          <AddMoreButton onPress={toggleAddMore} />
          <PrimaryButton
            disabled={loading}
            loader={loading}
            text={`Publish ${
              postFee > 0 && !freePostCount
                ? `${((postFee || 0) / 1000000).toFixed(4)} TORI`
                : ""
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
        <WalletStatusBox maxAddressLength={50} />
        <FileUploader
          value={formValues.file}
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
              staticToolbar={isAddMoreVisible}
              onChange={onChange}
              onBlur={onBlur}
              initialValue={formValues.message}
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
