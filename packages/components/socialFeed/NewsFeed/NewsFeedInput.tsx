import { coin } from "@cosmjs/amino";
import React, { useImperativeHandle, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextInput,
  View,
  ViewStyle,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { v4 as uuidv4 } from "uuid";

import {
  NewPostFormValues,
  PostCategory,
  ReplyToType,
  SocialFeedMetadata,
} from "./NewsFeed.type";
import {
  generatePostMetadata,
  getPostCategory,
  uploadPostFilesToPinata,
} from "./NewsFeedQueries";
import { NotEnoughFundModal } from "./NotEnoughFundModal";
import audioSVG from "../../../../assets/icons/audio.svg";
import cameraSVG from "../../../../assets/icons/camera.svg";
import penSVG from "../../../../assets/icons/pen.svg";
import priceSVG from "../../../../assets/icons/price.svg";
import videoSVG from "../../../../assets/icons/video.svg";
import { signingSocialFeedClient } from "../../../client-creators/socialFeedClient";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useBotPost } from "../../../hooks/feed/useBotPost";
import { useCreatePost } from "../../../hooks/feed/useCreatePost";
import { useUpdateAvailableFreePost } from "../../../hooks/feed/useUpdateAvailableFreePost";
import { useUpdatePostFee } from "../../../hooks/feed/useUpdatePostFee";
import { useBalances } from "../../../hooks/useBalances";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { prettyPrice } from "../../../utils/coins";
import { defaultSocialFeedFee } from "../../../utils/fee";
import {
  AUDIO_MIME_TYPES,
  IMAGE_MIME_TYPES,
  VIDEO_MIME_TYPES,
} from "../../../utils/mime";
import {
  SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT,
  hashtagMatch,
  mentionMatch,
  generateIpfsKey,
  replaceFileInArray,
  removeFileFromArray,
} from "../../../utils/social-feed";
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
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
  SOCIAL_FEED_BREAKPOINT_M,
} from "../../../utils/style/layout";
import { replaceBetweenString } from "../../../utils/text";
import { LocalFileData, RemoteFileData } from "../../../utils/types/feed";
import { BrandText } from "../../BrandText";
import { FilesPreviewsContainer } from "../../FilePreview/FilesPreviewsContainer";
import FlexRow from "../../FlexRow";
import { IconBox } from "../../IconBox";
import { OmniLink } from "../../OmniLink";
import { SVG } from "../../SVG";
import { PrimaryBox } from "../../boxes/PrimaryBox";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../../buttons/SecondaryButtonOutline";
import { FileUploader } from "../../fileUploader";
import { SpacerColumn } from "../../spacer";
import { EmojiSelector } from "../EmojiSelector";
import { GIFSelector } from "../GIFSelector";

interface NewsFeedInputProps {
  type: "comment" | "post";
  parentId?: string;
  style?: ViewStyle;
  onSubmitSuccess?: () => void;
  onSubmitInProgress?: () => void;
  replyTo?: ReplyToType;
  onCloseCreateModal?: () => void;
  // Receive this if the post is created from HashFeedScreen
  additionalHashtag?: string;
  // Receive this if the post is created from UserPublicProfileScreen (If the user doesn't own the UPP)
  additionalMention?: string;
}

export interface NewsFeedInputHandle {
  resetForm: () => void;
  setValue: (text: string) => void;
  focusInput: () => void;
}

const CHARS_LIMIT_WARNING_MULTIPLIER = 0.92;
const MAX_IMAGES = 4;
const BREAKPOINT_S = 559;

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
      additionalHashtag,
      additionalMention,
    },
    forwardRef
  ) => {
    const { width: windowWidth } = useWindowDimensions();
    const { width } = useMaxResolution();
    const isMobile = useIsMobile();
    const [viewWidth, setViewWidth] = useState(0);
    const inputMaxHeight = 400;
    const inputMinHeight = 20;
    const inputHeight = useSharedValue(20);
    const selectedNetworkId = useSelectedNetworkId();
    const { selectedWallet } = useSelectedWallet();
    const userId = getUserId(selectedNetworkId, selectedWallet?.address);
    const inputRef = useRef<TextInput>(null);
    const [isNotEnoughFundModal, setNotEnoughFundModal] = useState(false);
    const { setToastError } = useFeedbacks();
    const [isLoading, setLoading] = useState(false);
    const [selection, setSelection] = useState<{ start: number; end: number }>({
      start: 10,
      end: 10,
    });
    const { mutateAsync: botPostMutate } = useBotPost();
    const { mutateAsync, isLoading: isMutateLoading } = useCreatePost({
      onMutate: () => {
        onSubmitInProgress && onSubmitInProgress();
      },
      onSuccess: () => {
        onPostCreationSuccess();
      },
    });

    const onPostCreationSuccess = () => {
      reset();
      onSubmitSuccess && onSubmitSuccess();
      onCloseCreateModal && onCloseCreateModal();
    };
    const balances = useBalances(
      process.env.TERITORI_NETWORK_ID,
      selectedWallet?.address
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

    const { postFee } = useUpdatePostFee(
      selectedNetworkId,
      getPostCategory(formValues)
    );
    const { freePostCount } = useUpdateAvailableFreePost(
      selectedNetworkId,
      getPostCategory(formValues),
      selectedWallet
    );

    const processSubmit = async () => {
      const toriBalance = balances.find((bal) => bal.denom === "utori");
      if (postFee > Number(toriBalance?.amount) && !freePostCount) {
        return setNotEnoughFundModal(true);
      }

      setLoading(true);
      onSubmitInProgress && onSubmitInProgress();
      try {
        const hasUsername =
          replyTo?.parentId &&
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

        let files: RemoteFileData[] = [];

        if (formValues.files?.length) {
          const pinataJWTKey = await generateIpfsKey(selectedNetworkId, userId);
          if (pinataJWTKey) {
            files = await uploadPostFilesToPinata({
              files: formValues.files,
              pinataJWTKey,
            });
          }
        }
        if (formValues.files?.length && !files.find((file) => file.url)) {
          console.error("upload file err : Fail to pin to IPFS");
          setToastError({
            title: "File upload failed",
            message: "Fail to pin to IPFS, please try to Publish again",
          });
          return;
        }

        const postCategory = getPostCategory(formValues);

        const client = await signingSocialFeedClient({
          networkId: selectedNetworkId,
          walletAddress: selectedWallet?.address || "",
        });

        const metadata: SocialFeedMetadata = generatePostMetadata({
          title: formValues.title || "",
          message: finalMessage,
          files,
          hashtags,
          mentions,
          gifs: formValues?.gifs || [],
        });

        const identifier = uuidv4();

        await mutateAsync({
          client,
          msg: {
            category: postCategory,
            identifier,
            metadata: JSON.stringify(metadata),
            parentPostIdentifier: hasUsername ? replyTo?.parentId : parentId,
          },
          args: {
            fee: defaultSocialFeedFee,
            memo: "",
            funds: [coin(postFee, "utori")],
          },
        });

        if (
          postCategory === PostCategory.Question ||
          postCategory === PostCategory.BriefForStableDiffusion
        ) {
          await botPostMutate(
            {
              identifier,
              category: postCategory,
            },
            {
              onSuccess: onPostCreationSuccess,
            }
          );
        }
      } catch (err) {
        console.error("post submit err", err);
        setToastError({
          title: "Post creation failed",
          message: err.message,
        });
      }
      setLoading(false);
    };

    useImperativeHandle(forwardRef, () => ({
      resetForm: reset,
      setValue: handleTextChange,
      focusInput,
    }));

    const handleTextChange = (text: string) => {
      // Comments are blocked at 2500
      if (type !== "post" && text.length > SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT)
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
      <View
        style={[{ width }, style]}
        onLayout={(e) => setViewWidth(e.nativeEvent.layout.width)}
      >
        {isNotEnoughFundModal && (
          <NotEnoughFundModal
            visible
            onClose={() => setNotEnoughFundModal(false)}
          />
        )}
        <PrimaryBox
          fullWidth
          style={{
            zIndex: 9,
          }}
          mainContainerStyle={{
            backgroundColor: neutral22,
          }}
          noRightBrokenBorder
        >
          <Pressable
            onPress={focusInput}
            style={{
              width: "100%",
              paddingRight: isMobile
                ? layout.padding_x1_5
                : layout.padding_x2_5,
              paddingLeft: isMobile ? layout.padding_x1_5 : layout.padding_x3,
              paddingTop: isMobile ? layout.padding_x1_5 : layout.padding_x3,
              paddingBottom: layout.padding_x1_5,
            }}
          >
            <FlexRow style={{ marginTop: layout.padding_x1 }}>
              <SVG
                height={24}
                width={24}
                source={penSVG}
                color={secondaryColor}
                style={{
                  alignSelf: "flex-end",
                  marginRight: layout.padding_x1_5,
                }}
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
                  } ${
                    windowWidth < RESPONSIVE_BREAKPOINT_S ? "" : "here! _____"
                  }`}
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
                      //@ts-ignore
                      outlineStyle: "none",
                      outlineWidth: 0,
                    },
                  ]}
                />
              </Animated.View>
            </FlexRow>
            {/* Changing this text's color depending on the message length */}
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
                      SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT
                    ? errorColor
                    : primaryColor,
                  marginTop: layout.padding_x0_5,
                  alignSelf: "flex-end",
                },
              ]}
            >
              {formValues?.message?.length}
              <BrandText style={[fontSemibold12, { color: neutral77 }]}>
                /{SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT}
              </BrandText>
            </BrandText>
          </Pressable>

          <FilesPreviewsContainer
            files={formValues.files}
            gifs={formValues.gifs}
            onDelete={(file) => {
              setValue(
                "files",
                removeFileFromArray(
                  formValues?.files || [],
                  file as LocalFileData
                )
              );
            }}
            onDeleteGIF={(url) =>
              setValue(
                "gifs",
                (formValues?.gifs || [])?.filter((gif) => gif !== url)
              )
            }
            onAudioUpdate={(updatedFile) => {
              if (formValues?.files?.length) {
                setValue(
                  "files",
                  replaceFileInArray(formValues?.files, updatedFile)
                );
              }
            }}
          />
        </PrimaryBox>
        <View
          style={{
            backgroundColor: neutral17,
            paddingVertical: isMobile
              ? layout.padding_x1_5
              : layout.padding_x1_5,
            paddingHorizontal: isMobile
              ? layout.padding_x1_5
              : layout.padding_x2_5,
            flexDirection:
              viewWidth < SOCIAL_FEED_BREAKPOINT_M ? "column" : "row",
            alignItems:
              viewWidth < SOCIAL_FEED_BREAKPOINT_M ? "flex-end" : "center",
            justifyContent: "space-between",
            borderRadius: 8,
          }}
        >
          <View
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
              },
              viewWidth < SOCIAL_FEED_BREAKPOINT_M && {
                alignSelf: "flex-start",
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
                { color: neutral77, marginLeft: layout.padding_x1 },
              ]}
            >
              {freePostCount
                ? `You have ${freePostCount} free ${type} left`
                : `The cost for this ${type} is ${prettyPrice(
                    selectedNetworkId,
                    postFee.toString(),
                    "utori"
                  )}`}
            </BrandText>
          </View>
          <View
            style={[
              {
                flexDirection: viewWidth < BREAKPOINT_S ? "column" : "row",
                alignItems: "center",
                flex: 1,
                justifyContent: "flex-end",
              },
              viewWidth < BREAKPOINT_S && { width: "100%" },
            ]}
          >
            {viewWidth < BREAKPOINT_S && <SpacerColumn size={1.5} />}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <EmojiSelector
                onEmojiSelected={onEmojiSelected}
                buttonStyle={{ marginRight: layout.padding_x2_5 }}
              />

              <GIFSelector
                buttonStyle={{ marginRight: layout.padding_x2_5 }}
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

              <FileUploader
                onUpload={(files) => setValue("files", [files?.[0]])}
                mimeTypes={AUDIO_MIME_TYPES}
              >
                {({ onPress }) => (
                  <IconBox
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
                  <IconBox
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
                // multiple
                onUpload={(files) => {
                  // Don't add if already added
                  if (
                    formValues.files?.find(
                      (file) => file.fileName === files[0].fileName
                    )
                  )
                    return;
                  setValue("files", [...(formValues.files || []), ...files]);
                }}
                mimeTypes={IMAGE_MIME_TYPES}
              >
                {({ onPress }) => (
                  <IconBox
                    disabled={
                      (formValues.files?.[0] &&
                        formValues.files[0].fileType !== "image") ||
                      (formValues.files || []).length +
                        (formValues.gifs || [])?.length >=
                        MAX_IMAGES
                    }
                    icon={cameraSVG}
                    onPress={onPress}
                    style={{
                      marginRight:
                        viewWidth < BREAKPOINT_S ? 0 : layout.padding_x2_5,
                    }}
                    iconProps={{
                      height: 18,
                      width: 18,
                    }}
                  />
                )}
              </FileUploader>
            </View>

            {viewWidth < BREAKPOINT_S && <SpacerColumn size={1.5} />}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {type === "post" && (
                <OmniLink to={{ screen: "FeedNewArticle" }}>
                  <SecondaryButtonOutline
                    size="M"
                    color={
                      formValues?.message.length >
                      SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT
                        ? primaryTextColor
                        : primaryColor
                    }
                    borderColor={primaryColor}
                    touchableStyle={{
                      marginRight: layout.padding_x2_5,
                    }}
                    backgroundColor={
                      formValues?.message.length >
                      SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT
                        ? primaryColor
                        : neutral17
                    }
                    text="Create an Article"
                    squaresBackgroundColor={neutral17}
                  />
                </OmniLink>
              )}

              <PrimaryButton
                disabled={
                  (!formValues?.message &&
                    !formValues?.files?.length &&
                    !formValues?.gifs?.length) ||
                  formValues?.message.length >
                    SOCIAL_FEED_ARTICLE_MIN_CHARS_LIMIT ||
                  !selectedWallet
                }
                isLoading={isLoading || isMutateLoading}
                loader
                size="M"
                text={type === "comment" ? "Comment" : "Publish"}
                squaresBackgroundColor={neutral17}
                onPress={handleSubmit(processSubmit)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
);
