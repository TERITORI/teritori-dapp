import React, { useImperativeHandle, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { CommentTextInput, MiniCommentInputHandle } from "./CommentTextInput";
import { SelectAudioVideo } from "./SelectAudioVideo";
import { SelectPicture } from "./SelectPicture";
import { SimpleCommentInput } from "./SimpleCommentInput";
import priceSVG from "../../../../../assets/icons/price.svg";
import { CustomButton } from "../Button/CustomButton";
import MiniToast from "../MiniToast";

import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { SVG } from "@/components/SVG";
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
import { FeedPostingStepId, feedPostingStep } from "@/utils/feed/posting";
import { generatePostMetadata, getPostCategory } from "@/utils/feed/queries";
import { generateIpfsKey } from "@/utils/ipfs";
import {
  SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT,
  hashtagMatch,
  mentionMatch,
} from "@/utils/social-feed";
import { neutral77, secondaryColor } from "@/utils/style/colors";
import { fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { replaceBetweenString } from "@/utils/text";
import { NewPostFormValues, ReplyToType } from "@/utils/types/feed";
import { RemoteFileData } from "@/utils/types/files";

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

export interface MiniCommentInputInputHandle {
  resetForm: () => void;
  setValue: (text: string) => void;
  focusInput: () => void;
  blurInput: () => void;
}
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
    const selectedNetwork = useSelectedNetworkInfo();
    const selectedNetworkId = selectedNetwork?.id || "teritori";
    const selectedWallet = useSelectedWallet();
    const userId = getUserId(selectedNetworkId, selectedWallet?.address);
    const inputRef = useRef<MiniCommentInputHandle>(null);
    const [toastErrors, setToastErrors] = useState<{
      title: string;
      message: string;
    } | null>(null);
    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const [isProgressBarShown, setIsProgressBarShown] = useState(false);
    const [showFullCommentInput, setShowFullCommentInput] = useState(false);

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
      if (inputRef?.current?.setValue) {
        inputRef?.current?.setValue(text);
      }
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

    const focusInput = () => inputRef?.current?.focusInput();
    const blurInput = () => inputRef?.current?.blurInput();

    useImperativeHandle(forwardRef, () => ({
      resetForm: reset,
      focusInput,
      blurInput,
      setValue: handleTextChange,
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

    const enableShowFullCommentInput = () => {
      setShowFullCommentInput(true);
      setTimeout(() => {
        inputRef?.current?.focusInput();
      }, 0);
    };

    const disableShowFullCommentInput = () => {
      setShowFullCommentInput(false);
    };

    if (!showFullCommentInput) {
      return (
        <SimpleCommentInput
          value={formValues.message}
          onFocus={enableShowFullCommentInput}
        />
      );
    }

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

        <CommentTextInput
          formValues={formValues}
          setSelection={setSelection}
          setValue={setValue}
          ref={inputRef}
          onBlur={disableShowFullCommentInput}
        />
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
            <SelectAudioVideo
              type="audio"
              files={formValues.files}
              onSelectFile={(selectedFiles) => {
                setValue("files", selectedFiles);
              }}
            />
            <SelectAudioVideo
              type="video"
              files={formValues.files}
              onSelectFile={(selectedFiles) => {
                setValue("files", selectedFiles);
              }}
            />
            <SelectPicture
              files={formValues.files}
              onSelectFile={(data) => {
                setValue("files", data);
              }}
            />
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
