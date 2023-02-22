import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextInput,
  View,
  ViewStyle,
  Pressable,
  StyleSheet,
} from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { v4 as uuidv4 } from "uuid";

import audioSVG from "../../../../assets/icons/audio.svg";
import cameraSVG from "../../../../assets/icons/camera.svg";
import penSVG from "../../../../assets/icons/pen.svg";
import priceSVG from "../../../../assets/icons/price.svg";
import videoSVG from "../../../../assets/icons/video.svg";
import { socialFeedClient } from "../../../client-creators/socialFeedClient";
import { useCreatePost } from "../../../hooks/feed/useCreatePost";
import { useBalances } from "../../../hooks/useBalances";
import { useIsMobileView } from "../../../hooks/useIsMobileView";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { ReplyToType } from "../../../screens/FeedPostView/types";
import { defaultSocialFeedFee } from "../../../utils/fee";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "../../../utils/mime";
import { SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT } from "../../../utils/social-feed";
import {
  errorColor,
  neutral17,
  neutral22,
  neutral77,
  primaryColor,
  primaryTextColor,
  secondaryColor,
  yellowDefault,
} from "../../../utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { replaceBetweenString } from "../../../utils/text";
import { RemoteFileData } from "../../../utils/types/feed";
import { BrandText } from "../../BrandText";
import { CircleIconBox } from "../../CircleIconBox";
import { FilePreviewContainer } from "../../FilePreview/UploadedFilePreview/FilePreviewContainer";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../../buttons/SecondaryButtonOutline";
import { FileUploader } from "../../fileUploader";
import { SpacerRow } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { GIFSelector } from "../GIFSelector";
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
  onCloseCreateModal?: () => void;
  onPressCreateArticle?: (formValues: NewPostFormValues) => void;
  hash?: string;
  mentionedUser?: string;
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
    {
      type,
      parentId,
      style,
      onSubmitSuccess,
      replyTo,
      onSubmitInProgress,
      onCloseCreateModal,
      onPressCreateArticle,
      hash,
      mentionedUser,
    },
    forwardRef
  ) => {
    const inputMaxHeight = 400;
    const inputMinHeight = 20;
    const inputHeight = useSharedValue(20);
    const wallet = useSelectedWallet();
    const inputRef = useRef<TextInput>(null);
    const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
    const isMobile = useIsMobileView();
    const [isNFTKeyModal, setIsNFTKeyModal] = useState(false);
    const [postFee, setPostFee] = useState(0);
    const [freePostCount, setFreePostCount] = useState(0);
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
        onCloseCreateModal && onCloseCreateModal();
      },
    });
    const resetForm = () => {
      reset();
      updateAvailableFreePost();
      updatePostFee();
    };

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
      if (!!formValues.files?.length && !formValues.nftStorageApiToken) {
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

        // Adding hashtag or mentioned user
        let finalMessage = formValues.message || "";
        if (mentionedUser) {
          finalMessage += `\n@${mentionedUser}`;
        }
        if (hash) {
          finalMessage += `\n#${hash}`;
        }

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
          message: finalMessage,
          files,
          hashtags: [],
          gifs: formValues?.gifs || [],
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
        console.error("post submit err", err);
      }
      setLoading(false);
    };

    useImperativeHandle(forwardRef, () => ({
      resetForm,
      setValue: handleTextChange,
      focusInput,
    }));

    const handleTextChange = (text: string) => {
      // Comments are blocked at 2500
      if (type !== "post" && text.length > SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT)
        return;
      setValue("message", text);
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
              style={{ alignSelf: "flex-end" }}
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
                  // TODO: onContentSizeChange is not fired when deleting lines. We can only grow the input, but not shrink
                  if (e.nativeEvent.contentSize.height < inputMaxHeight) {
                    inputHeight.value = e.nativeEvent.contentSize.height;
                  }
                }}
                style={[
                  fontSemibold16,
                  {
                    height: formValues.message
                      ? inputHeight.value || inputMinHeight
                      : inputMinHeight,
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
                  color: !formValues?.message
                    ? neutral77
                    : formValues?.message?.length > 2300 &&
                      formValues?.message?.length < 2500
                    ? yellowDefault
                    : formValues?.message?.length >= 2500
                    ? errorColor
                    : primaryColor,
                  position: "absolute",
                  bottom: 12,
                  right: 20,
                },
              ]}
            >
              {formValues?.message?.length}
              <BrandText style={[fontSemibold12, { color: neutral77 }]}>
                /{SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT}
              </BrandText>
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
                setValue(
                  "gifs",
                  formValues.gifs?.filter((file) => file !== fileIndex)
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
              optionsContainer={{ marginLeft: -186, marginTop: -6 }}
              onGIFSelected={(url) =>
                url && setValue("gifs", [...(formValues.gifs || []), url])
              }
              disabled={
                (formValues.files?.[0] &&
                  formValues.files[0].fileType !== "image") ||
                (formValues.files || []).length +
                  (formValues.gifs || [])?.length >=
                  4
              }
            />
            <SpacerRow size={2.5} />

            <EmojiSelector
              onEmojiSelected={onEmojiSelected}
              optionsContainer={{ marginLeft: -80, marginTop: -6 }}
            />
            <SpacerRow size={2.5} />

            <FileUploader
              onUpload={(files) => setValue("files", [files?.[0]])}
              mimeTypes={AUDIO_MIME_TYPES}
            >
              {({ onPress }) => (
                <CircleIconBox
                  icon={audioSVG}
                  onPress={onPress}
                  style={{ marginRight: layout.padding_x2_5 }}
                  disabled={
                    !!formValues.files?.length || !!formValues.gifs?.length
                  }
                />
              )}
            </FileUploader>
            <FileUploader
              onUpload={(files) => setValue("files", [files?.[0]])}
              mimeTypes={VIDEO_MIME_TYPES}
            >
              {({ onPress }) => (
                <CircleIconBox
                  icon={videoSVG}
                  onPress={onPress}
                  style={{ marginRight: layout.padding_x2_5 }}
                  disabled={
                    !!formValues.files?.length || !!formValues.gifs?.length
                  }
                />
              )}
            </FileUploader>
            <FileUploader
              multiple
              onUpload={(files) =>
                setValue("files", [...(formValues.files || []), ...files])
              }
              mimeTypes={IMAGE_MIME_TYPES}
              maxUpload={
                4 -
                (formValues.files?.length || 0) -
                (formValues.gifs?.length || 0)
              }
            >
              {({ onPress }) => (
                <CircleIconBox
                  disabled={
                    (formValues.files?.[0] &&
                      formValues.files[0].fileType !== "image") ||
                    (formValues.files || []).length +
                      (formValues.gifs || [])?.length >=
                      4
                  }
                  icon={cameraSVG}
                  onPress={onPress}
                  style={{ marginRight: layout.padding_x2_5 }}
                  iconProps={{
                    height: 18,
                    width: 18,
                  }}
                />
              )}
            </FileUploader>

            {type === "post" && (
              <SecondaryButtonOutline
                size="M"
                color={
                  formValues?.message.length >
                  SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT
                    ? primaryTextColor
                    : primaryColor
                }
                borderColor={primaryColor}
                touchableStyle={{
                  marginRight: layout.padding_x2_5,
                }}
                backgroundColor={
                  formValues?.message.length >
                  SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT
                    ? primaryColor
                    : neutral17
                }
                text="Create an Article"
                onPress={
                  onPressCreateArticle
                    ? () =>
                        onPressCreateArticle && onPressCreateArticle(formValues)
                    : undefined
                }
                squaresBackgroundColor={neutral17}
              />
            )}

            <PrimaryButton
              disabled={
                (!formValues?.message &&
                  !formValues?.files?.length &&
                  !formValues?.gifs?.length) ||
                formValues?.message.length > SOCIAL_FEED_ARTICLE_MIN_CHAR_LIMIT
              }
              isLoading={isLoading || isMutateLoading}
              size="M"
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
    paddingVertical: layout.padding_x3,
    paddingHorizontal: layout.padding_x2_5,
    flexDirection: "row",
    alignItems: "center",
  },
});
