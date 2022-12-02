import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { BrandText } from "../../components/BrandText";
import { NotEnoughFundModal } from "../../components/NewsFeed/NotEnoughFundModal";
import { RichText } from "../../components/RichText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { WalletStatusBox } from "../../components/WalletStatusBox";
import { PrimaryBox } from "../../components/boxes/PrimaryBox";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { FileUploader } from "../../components/fileUploader";
import {
  Label,
  TextInputCustom,
} from "../../components/inputs/TextInputCustom";
import { useBalances } from "../../hooks/useBalances";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { defaultSocialFeedFee } from "../../utils/fee";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral22 } from "../../utils/style/colors";
import {
  fontMedium14,
  fontSemibold13,
  fontSemibold20,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

enum PostCategory {
  Reaction,
  Comment,
  Normal,
  Article,
  Picture,
  Audio,
  Video,
}

type NewPostValueType = {
  title: string;
  message: string;
  file: File;
};

export const FeedNewPostScreen: ScreenFC<"FeedNewPost"> = () => {
  const [postCost, setPostCost] = useState(0);
  const [freePostCount, setFreePostCount] = useState(0);
  const [postCategory, setPostCategory] = useState<PostCategory>(
    PostCategory.Normal
  );
  const navigation = useAppNavigation();
  const wallet = useSelectedWallet();
  const balances = useBalances(
    process.env.TERITORI_NETWORK_ID,
    wallet?.address
  );

  const { control, setValue, handleSubmit, reset, watch } =
    useForm<NewPostValueType>();

  const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);

  const formValues = watch();

  const getAvailableFreePost = async () => {
    try {
      if (!wallet?.connected || !wallet.address) {
        return;
      }

      const client = await socialFeedClient({
        walletAddress: wallet.address,
      });

      const freePostCount = await client.queryAvailableFreePosts({
        wallet: wallet.address,
      });

      setFreePostCount(Number(freePostCount));
    } catch (err) {
      console.log("getAvailableFreePost err", err);
    }
  };

  const getPostFee = async () => {
    try {
      if (!wallet?.connected || !wallet.address) {
        return;
      }
      const client = await socialFeedClient({
        walletAddress: wallet.address,
      });

      const cost = await client.queryFeeByCategory({
        category: postCategory,
      });

      setPostCost(cost);
    } catch (err) {
      console.log("getPostFee err", err);
    }
  };

  function updatePostCategory() {
    if (formValues.title) {
      setPostCategory(PostCategory.Article);
    } else {
      setPostCategory(PostCategory.Normal);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      if (wallet?.connected && wallet?.address) {
        getAvailableFreePost();
        getPostFee();
      }
    }, [wallet?.address])
  );

  useEffect(() => {
    updatePostCategory();
  }, [formValues]);

  async function initSubmit() {
    try {
      if (!wallet?.connected || !wallet.address) {
        return;
      }

      const client = await socialFeedClient({
        walletAddress: wallet.address,
      });

      const freePostCount = await client.queryAvailableFreePosts({
        wallet: wallet.address,
      });
      const cost = await client.queryFeeByCategory({
        category: postCategory,
      });
      const toriBalance = balances.find((bal) => bal.denom === "utori");
      if (cost > Number(toriBalance?.amount) && !freePostCount) {
        return setNotEnoughFundModal(true);
      }

      await client.createPost(
        {
          category: postCategory,
          identifier: uuidv4(),
          metadata: JSON.stringify({
            title: formValues.title || "",
            message: formValues.message || "",
            creator: wallet.address,
          }),
        },
        defaultSocialFeedFee,
        "",
        freePostCount
          ? undefined
          : [
              {
                denom: "utori",
                amount: cost,
              },
            ]
      );
    } catch (err) {
      console.log("initSubmit", err);
    }
  }

  async function onSubmit() {
    await initSubmit();
    reset();
  }

  return (
    <ScreenContainer
      responsive
      maxWidth={592}
      headerChildren={<BrandText style={fontSemibold20}>New Post</BrandText>}
      onBackPress={() => navigation.navigate("Feed")}
      fixedFooterChildren={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingVertical: layout.padding_x2_5,
          }}
        >
          <View style={{ flex: 1 }}>
            <PrimaryBox fullWidth>
              <TouchableOpacity
                style={{
                  padding: layout.padding_x2,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <BrandText style={[fontSemibold13]}>Add more</BrandText>
                <View
                  style={{
                    backgroundColor: neutral22,
                    borderRadius: 4,
                    paddingVertical: layout.padding_x0_25,
                    paddingHorizontal: layout.padding_x0_75,
                  }}
                >
                  <BrandText style={[fontMedium14, {}]}>⌘ + /</BrandText>
                </View>
              </TouchableOpacity>
            </PrimaryBox>
          </View>
          <PrimaryButton
            text={`Publish ${
              postCost > 0 && !freePostCount ? `${postCost} TORI` : ""
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
          onUpload={(file) => setValue("file", file)}
        />
        <TextInputCustom<NewPostValueType>
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
        <RichText onChange={(text) => setValue("message", text)} />
      </View>
    </ScreenContainer>
  );
};
