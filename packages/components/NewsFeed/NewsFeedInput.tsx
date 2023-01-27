import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextInput,
  View,
  ViewStyle,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { v4 as uuidv4 } from "uuid";

import audioSVG from "../../../assets/icons/audio.svg";
import cameraSVG from "../../../assets/icons/camera.svg";
import penSVG from "../../../assets/icons/pen.svg";
import priceSVG from "../../../assets/icons/price.svg";
import videoSVG from "../../../assets/icons/video.svg";
import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { useCreatePost } from "../../hooks/feed/useCreatePost";
import { useBalances } from "../../hooks/useBalances";
import { useIsMobileView } from "../../hooks/useIsMobileView";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ReplyToType } from "../../screens/FeedPostView/types";
import { defaultSocialFeedFee } from "../../utils/fee";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "../../utils/mime";
import { useAppNavigation } from "../../utils/navigation";
import { SOCIAL_FEED_MAX_CHAR_LIMIT } from "../../utils/social-feed";
import {
  neutral17,
  neutral22,
  neutral33,
  neutral77,
  secondaryColor,
} from "../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
} from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { replaceBetweenString } from "../../utils/text";
import { RemoteFileData } from "../../utils/types/feed";
import { BrandText } from "../BrandText";
import { EmojiSelector } from "../EmojiSelector";
import { FilePreviewContainer } from "../FilePreview/UploadedFilePreview/FilePreviewContainer";
import { GIFSelector } from "../GIFSelector";
import { SVG } from "../SVG";
import { TertiaryBox } from "../boxes/TertiaryBox";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { FileUploader } from "../fileUploader";
import { SpacerRow } from "../spacer";
import { NFTKeyModal } from "./NFTKeyModal";
import { NewPostFormValues, SocialFeedMetadata } from "./NewsFeed.type";
import {
  generatePostMetadata,
  getAvailableFreePost,
  getPostCategory,
  getPostFee,
  uploadPostFilesToNFTStorage,
} from "./NewsFeedQueries";
import { NotEnoughFundModal } from "./NotEnoughFundModal";

interface NewsFeedInputProps {
  type: "comment" | "post";
  parentId?: string;
  style?: ViewStyle;
  onSubmitSuccess?: () => void;
  onSubmitInProgress?: () => void;
  replyTo?: ReplyToType;
}

export interface NewsFeedInputHandle {
  resetForm: () => void;
  setValue: (text: string) => void;
  focusInput: () => void;
}

export const NewsFeedInput = React.forwardRef<
  NewsFeedInputHandle,
  NewsFeedInputProps
>(
  (
    { type, parentId, style, onSubmitSuccess, replyTo, onSubmitInProgress },
    forwardRef
  ) => {
    const inputHeight = useSharedValue(20);
    const { height } = useWindowDimensions();
    const wallet = useSelectedWallet();
    const inputRef = useRef<TextInput>(null);
    const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
    const isMobile = useIsMobileView();
    const [isNFTKeyModal, setIsNFTKeyModal] = useState(false);
    const [postFee, setPostFee] = useState(0);
    const [freePostCount, setFreePostCount] = useState(0);
    const navigation = useAppNavigation();
    const [isLoading, setLoading] = useState(false);
    const [selection, setSelection] = useState<{ start: number; end: number }>({
      start: 10,
      end: 10,
    });
    const { mutate, isLoading: isMutateLoading } = useCreatePost({
      onMutate: () => {
        onSubmitInProgress && onSubmitInProgress();
      },
      onSuccess: () => {
        resetForm();
        onSubmitSuccess && onSubmitSuccess();
      },
    });

    const balances = useBalances(
      process.env.TERITORI_NETWORK_ID,
      wallet?.address
    );

    const { setValue, handleSubmit, reset, watch } = useForm<NewPostFormValues>(
      {
        defaultValues: {
          nftStorageApiToken: "",
          title: "",
          message: "",
          files: [],
          gifs: [],
        },
      }
    );
    const formValues = watch();

    const updateAvailableFreePost = async () => {
      const freePost = await getAvailableFreePost({ wallet });
      setFreePostCount(freePost || 0);
    };

    const updatePostFee = async () => {
      const fee = await getPostFee({
        wallet,
        postCategory: getPostCategory(formValues),
      });
      setPostFee(fee || 0);
    };

    useEffect(() => {
      if (wallet?.connected && wallet?.address) {
        updateAvailableFreePost();
        updatePostFee();
      }
    }, [wallet?.address]);

    useEffect(() => {
      updatePostFee();
    }, [formValues]);

    const onSubmit = async () => {
      if (formValues.files && !formValues.nftStorageApiToken) {
        return setIsNFTKeyModal(true);
      }
      processSubmit();
    };

    const processSubmit = async (
      nftStorageApiToken = formValues.nftStorageApiToken
    ) => {
      const toriBalance = balances.find((bal) => bal.denom === "utori");
      if (postFee > Number(toriBalance?.amount) && !freePostCount) {
        return setNotEnoughFundModal(true);
      }

      setLoading(true);
      try {
        const hasUsername =
          replyTo?.parentId &&
          formValues.message.includes(`@${replyTo.username}`);

        let files: RemoteFileData[] = [];

        if (formValues.files?.length && nftStorageApiToken) {
          files = await uploadPostFilesToNFTStorage({
            files: formValues.files,
            nftStorageApiToken,
          });
        }

        const postCategory = getPostCategory(formValues);

        const client = await socialFeedClient({
          walletAddress: wallet?.address || "",
        });

        const metadata: SocialFeedMetadata = generatePostMetadata({
          title: formValues.title || "",
          message: formValues.message || "",
          files,
          hashtags: [],
        });

        await mutate({
          client,
          msg: {
            category: postCategory,
            identifier: uuidv4(),
            metadata: JSON.stringify(metadata),
            parentPostIdentifier: hasUsername ? replyTo?.parentId : parentId,
          },
          args: {
            fee: defaultSocialFeedFee,
            memo: "",
            funds: [],
          },
        });
      } catch (err) {
        console.log("post submit err", err);
      }

      setLoading(false);
    };

    const resetForm = () => {
      reset();
      updateAvailableFreePost();
      updatePostFee();
    };

    useImperativeHandle(forwardRef, () => ({
      resetForm,
      setValue: handleTextChange,
      focusInput,
    }));

    const handleTextChange = (text: string) => {
      setValue("message", text);

      if (text.length > 2500 && type === "post") {
        redirectToNewPost();
      }
    };

    const redirectToNewPost = () => {
      reset();
      navigation.navigate("FeedNewPost", formValues);
    };

    const onEmojiSelected = (emoji: string | null) => {
      if (emoji) {
        let copiedValue = `${formValues.message}`;
        copiedValue = replaceBetweenString(
          copiedValue,
          selection.start,
          selection.end,
          emoji
        );
        setValue("message", copiedValue);
      }
    };

    const focusInput = () => inputRef.current?.focus();

    return (
      <View style={style}>
        {isNotEnoughFundModal && (
          <NotEnoughFundModal
            visible
            onClose={() => setNotEnoughFundModal(false)}
          />
        )}
        {isNFTKeyModal && (
          <NFTKeyModal
            onClose={(key?: string) => {
              if (key) {
                setValue("nftStorageApiToken", key);
                processSubmit(key);
              }
              setIsNFTKeyModal(false);
            }}
          />
        )}
        <TertiaryBox
          fullWidth
          style={{
            zIndex: 9,
          }}
          mainContainerStyle={{
            backgroundColor: neutral22,
          }}
          noRightBrokenBorder
        >
          <Pressable onPress={focusInput} style={styles.insideContainer}>
            <SVG
              height={24}
              width={24}
              source={penSVG}
              color={secondaryColor}
            />
            <Animated.View style={{ flex: 1, height: "auto" }}>
              <TextInput
                ref={inputRef}
                value={formValues.message}
                onSelectionChange={(event) =>
                  setSelection(event.nativeEvent.selection)
                }
                placeholder={`Hey yo! ${
                  type === "post" ? "Post something" : "Write your comment"
                } here! _____`}
                placeholderTextColor={neutral77}
                onChangeText={handleTextChange}
                multiline
                onContentSizeChange={(e) => {
                  if (e.nativeEvent.contentSize.height < height * 0.2) {
                    inputHeight.value = e.nativeEvent.contentSize.height;
                  }
                }}
                style={[
                  fontSemibold16,
                  {
                    height: inputHeight.value || 40,
                    width: "100%",
                    color: secondaryColor,
                    marginLeft: layout.padding_x1_5,

                    //@ts-ignore
                    outlineStyle: "none",
                    outlineWidth: 0,
                  },
                ]}
              />
            </Animated.View>
            <BrandText
              style={[
                fontSemibold12,
                {
                  color: neutral77,
                  position: "absolute",
                  bottom: 12,
                  right: 20,
                },
              ]}
            >
              {formValues?.message?.length}/{SOCIAL_FEED_MAX_CHAR_LIMIT}
            </BrandText>
          </Pressable>
          <FilePreviewContainer
            files={formValues.files}
            gifs={formValues.gifs}
            onDelete={(fileIndex) => {
              if (typeof fileIndex === "number") {
                setValue(
                  "files",
                  formValues.files?.filter((_, index) => index !== fileIndex)
                );
              } else if (typeof fileIndex === "string") {
                setValue(
                  "files",
                  formValues.files?.filter((file) => file.url !== fileIndex)
                );
              } else {
                setValue("files", []);
              }
            }}
            onDeleteGIF={(fileIndex) => {
              setValue(
                "gifs",
                (formValues?.gifs || [])?.filter(
                  (_, index) => index !== fileIndex
                )
              );
            }}
            onUploadThumbnail={(file) => {
              if (formValues?.files?.[0]) {
                setValue("files", [
                  {
                    ...formValues?.files?.[0],
                    thumbnailFileData: file,
                  },
                ]);
              }
            }}
          />
        </TertiaryBox>
        <View
          style={{
            backgroundColor: neutral17,
            paddingTop: layout.padding_x4,
            paddingBottom: layout.padding_x1_5,
            marginTop: -layout.padding_x2_5,
            paddingHorizontal: layout.padding_x2_5,
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
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
                ? `You have ${freePostCount} free ${type} left`
                : `The cost for this ${type} is ${(
                    (postFee || 0) / 1000000
                  ).toFixed(4)} Tori`}
            </BrandText>
          </View>
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <GIFSelector
              onGIFSelected={(url) =>
                url && setValue("gifs", [...(formValues.gifs || []), url])
              }
            />
            <SpacerRow size={2.5} />

            <EmojiSelector
              onEmojiSelected={onEmojiSelected}
              optionsContainer={{ marginLeft: -80 }}
            />
            <SpacerRow size={2.5} />

            <FileUploader
              onUpload={(files) => setValue("files", [files?.[0]])}
              mimeTypes={AUDIO_MIME_TYPES}
            >
              {({ onPress }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 24,
                    backgroundColor: neutral33,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: layout.padding_x2_5,
                  }}
                  onPress={onPress}
                >
                  <SVG source={audioSVG} width={20} height={20} />
                </TouchableOpacity>
              )}
            </FileUploader>
            <FileUploader
              onUpload={(files) => setValue("files", [files?.[0]])}
              mimeTypes={VIDEO_MIME_TYPES}
            >
              {({ onPress }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 24,
                    backgroundColor: neutral33,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: layout.padding_x2_5,
                  }}
                  onPress={onPress}
                >
                  <SVG source={videoSVG} width={20} height={20} />
                </TouchableOpacity>
              )}
            </FileUploader>
            <FileUploader
              multiple
              onUpload={(files) =>
                setValue("files", [...(formValues.files || []), ...files])
              }
              mimeTypes={IMAGE_MIME_TYPES}
            >
              {({ onPress }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: 24,
                    backgroundColor: neutral33,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: isMobile ? 0 : layout.padding_x2_5,
                  }}
                  onPress={onPress}
                >
                  <SVG source={cameraSVG} width={16} height={16} />
                </TouchableOpacity>
              )}
            </FileUploader>
            <PrimaryButton
              disabled={!formValues?.message}
              isLoading={isLoading || isMutateLoading}
              size="M"
              width={110}
              text={type === "comment" ? "Comment" : "Publish"}
              squaresBackgroundColor={neutral17}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  insideContainer: {
    width: "100%",
    paddingVertical: layout.padding_x4,
    paddingHorizontal: layout.padding_x2_5,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
