import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useImperativeHandle, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput, View, ViewStyle } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { useSelector } from "react-redux";

import { CustomButton } from "./Button/CustomButton";
import MiniToast from "./MiniToast";
import cameraSVG from "../../../../assets/icons/camera-white.svg";
import micSVG from "../../../../assets/icons/mic-white.svg";
import penSVG from "../../../../assets/icons/pen.svg";
import priceSVG from "../../../../assets/icons/price.svg";
import videoSVG from "../../../../assets/icons/video.svg";

import { BrandText } from "@/components/BrandText";
import { FilesPreviewsContainer } from "@/components/FilePreview/FilesPreviewsContainer";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { FeedPostingProgressBar } from "@/components/loaders/FeedPostingProgressBar";
import { EmojiSelector } from "@/components/socialFeed/EmojiSelector";
import { GIFSelector } from "@/components/socialFeed/GIFSelector";
import { SpacerColumn } from "@/components/spacer";
import { useWalletControl } from "@/context/WalletControlProvider";
import { useFeedPosting } from "@/hooks/feed/useFeedPosting";
import { useIpfs } from "@/hooks/useIpfs";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { NetworkFeature, getUserId } from "@/networks";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { getAudioData } from "@/utils/audio";
import { FeedPostingStepId, feedPostingStep } from "@/utils/feed/posting";
import { generatePostMetadata, getPostCategory } from "@/utils/feed/queries";
import { generateIpfsKey } from "@/utils/ipfs";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "@/utils/mime";
import {
  SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT,
  hashtagMatch,
  mentionMatch,
  removeFileFromArray,
  replaceFileInArray,
} from "@/utils/social-feed";
import {
  errorColor,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
  yellowDefault,
} from "@/utils/style/colors";
import {
  fontSemibold12,
  fontSemibold13,
  fontSemibold16,
} from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { replaceBetweenString } from "@/utils/text";
import { NewPostFormValues, ReplyToType } from "@/utils/types/feed";
import { LocalFileData, RemoteFileData } from "@/utils/types/files";
import { getVideoData } from "@/utils/video";

interface MiniCommentInputProps {
  parentId?: string;
  style?: ViewStyle;
  onSubmitSuccess?: () => void;
  onSubmitInProgress?: () => void;
  replyTo?: ReplyToType;
  // Receive this if the post is created from HashFeedScreen
  additionalHashtag?: string;
  // Receive this if the post is created from UserPublicProfileScreen (If the user doesn't own the UPP)
  additionalMention?: string;
}

interface MiniCommentInputInputHandle {
  resetForm: () => void;
  setValue: (text: string) => void;
  focusInput: () => void;
}
const CHARS_LIMIT_WARNING_MULTIPLIER = 0.92;
const MAX_IMAGES = 4;

export const MiniCommentInput = React.forwardRef<
  MiniCommentInputInputHandle,
  MiniCommentInputProps
>(
  (
    {
      parentId,
      replyTo,
      style,
      onSubmitSuccess,
      onSubmitInProgress,
      additionalHashtag,
      additionalMention,
    },
    forwardRef,
  ) => {
    const inputMaxHeight = 400;
    const inputMinHeight = 30;
    const inputHeight = useSharedValue(30);
    const selectedNetwork = useSelectedNetworkInfo();
    const selectedNetworkId = selectedNetwork?.id || "teritori";
    const selectedWallet = useSelectedWallet();
    const userId = getUserId(selectedNetworkId, selectedWallet?.address);
    const inputRef = useRef<TextInput>(null);
    const [toastErrors, setToastErrors] = useState<{
      title: string;
      message: string;
    } | null>(null);
    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const [isProgressBarShown, setIsProgressBarShown] = useState(false);

    const { showNotEnoughFundsModal, showConnectWalletModal } =
      useWalletControl();
    const { setValue, handleSubmit, reset, watch } = useForm<NewPostFormValues>(
      {
        defaultValues: {
          title: "",
          message: "",
          files: [],
          gifs: [],
        },
      },
    );
    const formValues = watch();
    const postCategory = getPostCategory(formValues);
    const onPostCreationSuccess = () => {
      // Timeout here to let a few time to see the progress bar "100% Done"
      setTimeout(() => {
        reset();
        onSubmitSuccess?.();
        setIsUploadLoading(false);
        setIsProgressBarShown(false);
      }, 1000);
    };
    const {
      makePost,
      canPayForPost,
      isProcessing,
      prettyPublishingFee,
      freePostCount,
      publishingFee,
      setStep,
      step,
    } = useFeedPosting(
      selectedNetwork?.id,
      userId,
      postCategory,
      onPostCreationSuccess,
    );
    const isLoading = isUploadLoading || isProcessing;
    const { uploadFilesToPinata, ipfsUploadProgress } = useIpfs();
    const userIPFSKey = useSelector(selectNFTStorageAPI);

    const [selection, setSelection] = useState<{ start: number; end: number }>({
      start: 10,
      end: 10,
    });
    const handleTextChange = (text: string) => {
      // Comments are blocked at 2500
      if (text.length > SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT) return;
      setValue("message", text);
    };
    const onEmojiSelected = (emoji: string | null) => {
      if (emoji) {
        let copiedValue = `${formValues.message}`;
        copiedValue = replaceBetweenString(
          copiedValue,
          selection.start,
          selection.end,
          emoji,
        );
        setValue("message", copiedValue);
      }
    };

    const focusInput = () => inputRef.current?.focus();

    useImperativeHandle(forwardRef, () => ({
      resetForm: reset,
      setValue: handleTextChange,
      focusInput,
    }));

    const processSubmit = async () => {
      const action = "Comment";
      if (!selectedWallet?.address || !selectedWallet.connected) {
        showConnectWalletModal({
          forceNetworkFeature: NetworkFeature.SocialFeed,
          action,
        });
        return;
      }
      if (!canPayForPost) {
        showNotEnoughFundsModal({
          action,
          cost: {
            amount: publishingFee.toString(),
            denom: publishingFee.denom || "",
          },
        });
        return;
      }
      setIsUploadLoading(true);
      setIsProgressBarShown(true);
      onSubmitInProgress && onSubmitInProgress();
      try {
        const isReplyToValid =
          replyTo &&
          replyTo.parentId &&
          formValues.message.includes(`@${replyTo.username}`);

        // ---- Adding hashtag texts or mentioned texts to the metadata
        const mentions: string[] = [];
        mentionMatch(formValues.message)?.map((item) => {
          //TODO: Check NS token id before sending mentioned text ?

          mentions.push(item);
        });

        const hashtags: string[] = [];
        hashtagMatch(formValues.message)?.map((item) => {
          hashtags.push(item);
        });

        // ---- Adding hashtag or mentioned user at the end of the message and to the metadata
        let finalMessage = formValues.message || "";
        if (additionalMention) {
          finalMessage += `\n@${additionalMention}`;
          mentions.push(`@${additionalMention}`);
        }
        if (additionalHashtag) {
          finalMessage += `\n#${additionalHashtag}`;
          hashtags.push(`#${additionalHashtag}`);
        }

        let remoteFiles: RemoteFileData[] = [];

        if (formValues.files?.length) {
          setStep(feedPostingStep(FeedPostingStepId.GENERATING_KEY));

          const pinataJWTKey =
            userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));

          if (pinataJWTKey) {
            setStep(feedPostingStep(FeedPostingStepId.UPLOADING_FILES));

            remoteFiles = await uploadFilesToPinata({
              files: formValues.files,
              pinataJWTKey,
              mode: "mini",
            });
          }
        }
        if (formValues.files?.length && !remoteFiles.find((file) => file.url)) {
          console.error("upload file err : Fail to pin to IPFS");
          setToastErrors({
            title: "File upload failed",
            message: "Fail to pin to IPFS, please try to Publish again",
          });
          setIsUploadLoading(false);
          return;
        }

        const metadata = generatePostMetadata({
          premium: false,
          title: formValues.title || "",
          message: finalMessage,
          files: remoteFiles,
          gifs: formValues?.gifs || [],
          hashtags: [],
          mentions: [],
        });

        await makePost(
          JSON.stringify(metadata),
          isReplyToValid ? replyTo.parentId : parentId,
        );
      } catch (err) {
        console.error("post submit err", err);
        setIsUploadLoading(false);
        setIsProgressBarShown(false);
        setToastErrors({
          title: "Post creation failed",
          message: err instanceof Error ? err.message : `${err}`,
        });
        setTimeout(() => {
          setToastErrors(null);
        }, 3000);
      }
    };

    const onCameraPress = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          selectionLimit: 1,
        });

        if (
          result.assets &&
          result.assets.length > 0 &&
          result.assets[0].mimeType &&
          IMAGE_MIME_TYPES.includes(
            result?.assets?.[0]?.mimeType?.toLowerCase(),
          )
        ) {
          const choseFile = result.assets[0];

          if (
            formValues.files?.find(
              (file) => file.fileName === choseFile.fileName,
            )
          )
            return;

          const imagePath = choseFile?.uri;
          const imageMime = `${choseFile.mimeType}`;
          if (imagePath) {
            const fileName = `${choseFile.fileName}`;

            setValue("files", [
              ...(formValues.files || []),
              {
                file: new File([], ""),
                fileName,
                fileType: "image",
                mimeType: imageMime,
                size: choseFile.fileSize || 0,
                url: choseFile?.uri || "",
              },
            ]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const onChooseFilePress = async (fileType: "audio" | "video") => {
      try {
        const acceptableMimeTypes =
          fileType === "audio" ? AUDIO_MIME_TYPES : VIDEO_MIME_TYPES;
        const result = await DocumentPicker.getDocumentAsync({
          multiple: false,
          type: acceptableMimeTypes,
        });

        if (
          result.assets &&
          result.assets.length > 0 &&
          result.assets[0].mimeType &&
          acceptableMimeTypes.includes(result?.assets?.[0]?.mimeType)
        ) {
          const choseFile = result.assets[0];

          if (
            formValues.files?.find((file) => file.fileName === choseFile.name)
          )
            return;
          const filePath = choseFile?.uri;
          const mimeType = `${choseFile.mimeType}`;
          if (filePath) {
            const fileName = `${choseFile.name}`;
            const file = new File([], "");

            const metaData: Pick<
              LocalFileData,
              "videoMetadata" | "audioMetadata"
            > = {
              videoMetadata: undefined,
              audioMetadata: undefined,
            };
            if (fileType === "video") {
              metaData.videoMetadata = await getVideoData(file);
            }
            if (fileType === "audio") {
              metaData.audioMetadata = await getAudioData(file);
            }

            setValue("files", [
              {
                file,
                fileName,
                fileType,
                mimeType,
                size: choseFile?.size || 0,
                url: choseFile?.uri || "",
                ...metaData,
              },
            ]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <View style={{ width: "100%", ...style }}>
        {toastErrors && toastErrors.message && (
          <MiniToast
            type="error"
            message={toastErrors.message}
            style={{
              width: "100%",
              marginLeft: 0,
              marginBottom: layout.spacing_x0_75,
            }}
          />
        )}
        <View
          style={{
            borderRadius: layout.borderRadius,
            borderWidth: 1,
            borderColor: neutralA3,
            paddingHorizontal: layout.spacing_x1,
            paddingVertical: layout.spacing_x0_75,
          }}
        >
          <CustomPressable onPress={focusInput}>
            <FlexRow style={{ marginTop: layout.spacing_x1 }}>
              <SVG
                height={24}
                width={24}
                source={penSVG}
                color={secondaryColor}
                style={{
                  alignSelf: "flex-end",
                  marginRight: layout.spacing_x1_5,
                }}
              />
              <Animated.View style={{ flex: 1, height: "auto" }}>
                <TextInput
                  ref={inputRef}
                  value={formValues.message}
                  onSelectionChange={(event) =>
                    setSelection(event.nativeEvent.selection)
                  }
                  placeholder="Hey yo! Write your comment"
                  placeholderTextColor={neutral77}
                  onChangeText={handleTextChange}
                  multiline
                  onContentSizeChange={(e) => {
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
                    },
                  ]}
                />
              </Animated.View>
            </FlexRow>
          </CustomPressable>

          <BrandText
            style={[
              fontSemibold12,
              {
                color: !formValues?.message
                  ? neutral77
                  : formValues?.message?.length >
                        SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT *
                          CHARS_LIMIT_WARNING_MULTIPLIER &&
                      formValues?.message?.length <
                        SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT
                    ? yellowDefault
                    : formValues?.message?.length >=
                        SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT - 10
                      ? errorColor
                      : primaryColor,
                marginTop: layout.spacing_x0_5,
                alignSelf: "flex-end",
              },
            ]}
          >
            {formValues?.message?.length}
            <BrandText style={[fontSemibold12, { color: neutral77 }]}>
              /{SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT}
            </BrandText>
          </BrandText>
          {formValues.files && formValues.files.length > 0 ? (
            <>
              <SpacerColumn size={3} />
              <FilesPreviewsContainer
                files={formValues.files}
                gifs={formValues.gifs}
                onDelete={(file) => {
                  setValue(
                    "files",
                    removeFileFromArray(
                      formValues?.files || [],
                      file as LocalFileData,
                    ),
                  );
                }}
                onDeleteGIF={(url) => {
                  setValue(
                    "gifs",
                    (formValues?.gifs || [])?.filter((gif) => gif !== url),
                  );
                  const gifFile = formValues?.files?.find((x) => x.url === url);
                  if (gifFile) {
                    setValue(
                      "files",
                      removeFileFromArray(
                        formValues?.files || [],
                        gifFile as LocalFileData,
                      ),
                    );
                  }
                }}
                onAudioUpdate={(updatedFile) => {
                  if (formValues?.files?.length) {
                    setValue(
                      "files",
                      replaceFileInArray(formValues?.files, updatedFile),
                    );
                  }
                }}
              />
            </>
          ) : null}
        </View>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
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
              ? `You have ${freePostCount} free comment left`
              : `The cost for this comment is ${prettyPublishingFee}`}
          </BrandText>
        </View>
        {step.id !== "UNDEFINED" && isProgressBarShown && (
          <>
            <SpacerColumn size={1.5} />
            <FeedPostingProgressBar
              step={step}
              ipfsUploadProgress={ipfsUploadProgress}
            />
            <SpacerColumn size={1} />
          </>
        )}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: layout.spacing_x1,
            gap: layout.spacing_x2,
            paddingHorizontal: layout.spacing_x0_5,
          }}
        >
          <FlexRow style={{ gap: layout.spacing_x1_5, flex: 1 }}>
            <EmojiSelector onEmojiSelected={onEmojiSelected} />

            <GIFSelector
              onGIFSelected={(url) => {
                // Don't add if already added
                if (formValues.gifs?.find((gif) => gif === url)) return;
                url && setValue("gifs", [...(formValues.gifs || []), url]);
              }}
              disabled={
                (formValues.files?.[0] &&
                  formValues.files[0].fileType !== "image") ||
                (formValues.files || []).length +
                  (formValues.gifs || [])?.length >=
                  MAX_IMAGES
              }
            />
            <CustomPressable
              onPress={() => onChooseFilePress("audio")}
              disabled={
                Array.isArray(formValues?.files) &&
                formValues?.files?.length > 0
              }
            >
              <SVG
                source={micSVG}
                height={24}
                width={24}
                style={{
                  opacity:
                    Array.isArray(formValues?.files) &&
                    formValues?.files?.length > 0
                      ? 0.7
                      : 1,
                }}
              />
            </CustomPressable>
            <CustomPressable
              onPress={() => onChooseFilePress("video")}
              disabled={
                Array.isArray(formValues?.files) &&
                formValues?.files?.length > 0
              }
            >
              <SVG
                source={videoSVG}
                height={24}
                width={24}
                style={{
                  opacity:
                    Array.isArray(formValues?.files) &&
                    formValues?.files?.length > 0
                      ? 0.7
                      : 1,
                }}
              />
            </CustomPressable>
            <CustomPressable
              onPress={onCameraPress}
              disabled={
                Array.isArray(formValues?.files) &&
                formValues?.files?.length > 0
              }
            >
              <SVG
                source={cameraSVG}
                height={24}
                width={24}
                style={{
                  opacity:
                    Array.isArray(formValues?.files) &&
                    formValues?.files?.length > 0
                      ? 0.7
                      : 1,
                }}
              />
            </CustomPressable>
          </FlexRow>
          <CustomButton
            onPress={handleSubmit(processSubmit)}
            title="Comment"
            type="primary"
            size="small"
            width={100}
            isDisabled={
              (!formValues?.message && !formValues?.gifs?.length) ||
              formValues?.message.length >
                SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT ||
              !selectedWallet ||
              isLoading
            }
          />
        </View>
      </View>
    );
  },
);
