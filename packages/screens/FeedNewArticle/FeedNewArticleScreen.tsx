import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { LatLng } from "react-native-leaflet-view";
import { useSelector } from "react-redux";

import priceSVG from "../../../assets/icons/price.svg";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { WalletStatusBox } from "@/components/WalletStatusBox";
import { LegacyTertiaryBox } from "@/components/boxes/LegacyTertiaryBox";
import { FileUploader } from "@/components/fileUploader";
import { Label, TextInputCustom } from "@/components/inputs/TextInputCustom";
import { FeedPostingProgressBar } from "@/components/loaders/FeedPostingProgressBar";
import { RichText } from "@/components/socialFeed/RichText";
import { PublishValues } from "@/components/socialFeed/RichText/RichText.type";
import { MapModal } from "@/components/socialFeed/modals/MapModal/MapModal";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useWalletControl } from "@/context/WalletControlProvider";
import { useFeedPosting } from "@/hooks/feed/useFeedPosting";
import { useIpfs } from "@/hooks/useIpfs";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature } from "@/networks";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { feedPostingStep, FeedPostingStepId } from "@/utils/feed/posting";
import { generateArticleMetadata } from "@/utils/feed/queries";
import { generateIpfsKey } from "@/utils/ipfs";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import {
  ARTICLE_COVER_IMAGE_MAX_HEIGHT,
  ARTICLE_COVER_IMAGE_RATIO,
  ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT,
  ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
} from "@/utils/social-feed";
import {
  neutral00,
  neutral11,
  neutral77,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "@/utils/style/fonts";
import { layout, screenContentMaxWidth } from "@/utils/style/layout";
import { pluralOrNot } from "@/utils/text";
import { NewArticleFormValues, PostCategory } from "@/utils/types/feed";
import { RemoteFileData } from "@/utils/types/files";

//TODO: In mobile : Make ActionsContainer accessible (floating button ?)

export const FeedNewArticleScreen: ScreenFC<"FeedNewArticle"> = () => {
  const isMobile = useIsMobile();
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const userId = wallet?.userId;
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { uploadFilesToPinata, ipfsUploadProgress } = useIpfs();
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isProgressBarShown, setIsProgressBarShown] = useState(false);
  const postCategory = PostCategory.Article;
  const {
    makePost,
    isProcessing,
    canPayForPost,
    freePostCount,
    prettyPublishingFee,
    publishingFee,
    step,
    setStep,
  } = useFeedPosting(selectedNetworkId, userId, postCategory, () => {
    // Timeout here to let a few time to see the progress bar "100% Done"
    setTimeout(() => {
      setIsUploadLoading(false);
      setIsProgressBarShown(false);
      setToastSuccess({ title: "Post submitted successfully.", message: "" });
      navigateBack();
      reset();
    }, 1000);
  });
  const forceNetworkFeature = NetworkFeature.SocialFeed;
  const { showNotEnoughFundsModal, showConnectWalletModal } =
    useWalletControl();
  const isLoading = isUploadLoading || isProcessing;
  const { setToastSuccess, setToastError } = useFeedbacks();
  const navigation = useAppNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [location, setLocation] = useState<LatLng | undefined>();
  const [isMapShown, setIsMapShown] = useState(false);
  const {
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewArticleFormValues>({
    defaultValues: {
      title: "",
      message: "",
      files: [],
      gifs: [],
      hashtags: [],
      mentions: [],
      thumbnailImage: undefined,
      shortDescription: "",
    },
    mode: "onBlur",
  });
  //TODO: Not handled for now
  // const { mutate: openGraphMutate, data: openGraphData } = useOpenGraph();

  const formValues = watch();

  //TODO: Keep short post formValues when returning to short post
  const navigateBack = () => navigation.navigate("Feed");

  const onPublish = async (values: PublishValues) => {
    const action = "Publish an Article";
    if (!wallet?.address || !wallet.connected) {
      showConnectWalletModal({
        forceNetworkFeature,
        action,
      });
      return;
    }
    if (!canPayForPost) {
      showNotEnoughFundsModal({
        action,
        cost: {
          amount: publishingFee.amount.toString(),
          denom: publishingFee.denom || "",
        },
      });
      return;
    }
    setIsUploadLoading(true);
    setIsProgressBarShown(true);
    try {
      const localFiles = [
        ...(formValues.files || []),
        ...values.images,
        ...values.audios,
        ...values.videos,
      ];
      if (formValues.thumbnailImage) localFiles.push(formValues.thumbnailImage);
      if (formValues.coverImage) localFiles.push(formValues.coverImage);

      let pinataJWTKey = undefined;
      if (localFiles?.length) {
        setStep(feedPostingStep(FeedPostingStepId.GENERATING_KEY));

        pinataJWTKey =
          userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
      }

      // Upload files to IPFS
      let remoteFiles: RemoteFileData[] = [];
      if (pinataJWTKey) {
        setStep(feedPostingStep(FeedPostingStepId.UPLOADING_FILES));

        remoteFiles = await uploadFilesToPinata({
          files: localFiles,
          pinataJWTKey,
        });
      }

      // If the user uploaded files, but they are not pinned to IPFS, it returns files with empty url, so this is an error.
      if (formValues.files?.length && !remoteFiles.find((file) => file.url)) {
        console.error("upload file err : Fail to pin to IPFS");
        setToastError({
          title: "File upload failed",
          message: "Fail to pin to IPFS, please try to Publish again",
        });
        setIsUploadLoading(false);
        return;
      }

      let message = values.html;
      if (remoteFiles.length) {
        localFiles?.map((file, index) => {
          // Audio are not in the HTML for now
          if (remoteFiles[index]?.fileType !== "audio") {
            message = message.replace(file.url, remoteFiles[index].url);
          }
        });
      }

      const metadata = generateArticleMetadata({
        ...formValues,
        thumbnailImage: remoteFiles.find(
          (remoteFile) => remoteFile.isThumbnailImage,
        ),
        coverImage: remoteFiles.find((remoteFile) => remoteFile.isCoverImage),
        gifs: values.gifs,
        files: remoteFiles,
        mentions: values.mentions,
        hashtags: values.hashtags,
        message,
        location,
      });

      await makePost(JSON.stringify(metadata));
    } catch (err) {
      console.error("post submit error", err);
      setIsUploadLoading(false);
      setIsProgressBarShown(false);
      setToastError({
        title: "Something went wrong.",
        message: err instanceof Error ? err.message : `${err}`,
      });
    }
  };

  // Scroll to bottom when the loading bar appears
  useEffect(() => {
    if (step.id !== "UNDEFINED" && isLoading)
      scrollViewRef.current?.scrollToEnd();
  }, [step, isLoading]);

  // // OpenGraph URL preview
  // useEffect(() => {
  //   addedUrls.forEach(url => {
  //     openGraphMutate({
  //       url,
  //     });
  //
  //   })
  // }, [addedUrls])

  return (
    <ScreenContainer
      forceNetworkFeatures={[forceNetworkFeature]}
      responsive
      mobileTitle="NEW ARTICLE"
      fullWidth
      headerChildren={<BrandText style={fontSemibold20}>New Article</BrandText>}
      onBackPress={navigateBack}
      footerChildren
      noScroll
    >
      <ScrollView
        ref={scrollViewRef}
        style={{
          marginTop: isMobile ? layout.spacing_x2 : layout.contentSpacing,
        }}
        contentContainerStyle={{
          width: "100%",
          maxWidth: screenContentMaxWidth,
          alignSelf: "center",
        }}
      >
        <WalletStatusBox />
        <SpacerColumn size={3} />

        <LegacyTertiaryBox
          fullWidth
          mainContainerStyle={{
            paddingVertical: layout.spacing_x1,
            paddingHorizontal: layout.spacing_x1_5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            height: 48,
            backgroundColor: neutral11,
          }}
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
              ? `You have ${freePostCount} free ${pluralOrNot(
                  "Article",
                  freePostCount,
                )} left`
              : `The cost for this Article is ${prettyPublishingFee}`}
          </BrandText>
        </LegacyTertiaryBox>

        <FileUploader
          label="Thumbnail image"
          style={{
            marginTop: layout.spacing_x3,
          }}
          fileImageStyle={{
            objectFit: "cover",
            height: ARTICLE_THUMBNAIL_IMAGE_MAX_HEIGHT,
            maxWidth: ARTICLE_THUMBNAIL_IMAGE_MAX_WIDTH,
          }}
          onUpload={(files) =>
            setValue("thumbnailImage", {
              isThumbnailImage: true,
              ...files[0],
            })
          }
          mimeTypes={IMAGE_MIME_TYPES}
        />

        <FileUploader
          label="Cover image"
          style={{
            marginTop: layout.spacing_x3,
            width: "100%",
          }}
          fileImageStyle={{
            objectFit: "cover",
            height: "100%",
            width: "100%",
            maxHeight: ARTICLE_COVER_IMAGE_MAX_HEIGHT,
            aspectRatio: ARTICLE_COVER_IMAGE_RATIO,
          }}
          onUpload={(files) =>
            setValue("coverImage", {
              isCoverImage: true,
              ...files[0],
            })
          }
          mimeTypes={IMAGE_MIME_TYPES}
        />

        <TextInputCustom<NewArticleFormValues>
          noBrokenCorners
          rules={{ required: true }}
          height={48}
          label="Title"
          placeHolder="Type title here"
          name="title"
          control={control}
          variant="labelOutside"
          containerStyle={{ marginVertical: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />

        <TextInputCustom<NewArticleFormValues>
          noBrokenCorners
          rules={{ required: true }}
          multiline
          label="Short description"
          placeHolder="Type short description here"
          name="shortDescription"
          control={control}
          variant="labelOutside"
          containerStyle={{ marginBottom: layout.spacing_x3 }}
          boxMainContainerStyle={{
            backgroundColor: neutral00,
            borderRadius: 12,
          }}
        />

        <View>
          <Label>Article content</Label>
          <SpacerColumn size={1} />
          <Controller
            name="message"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur } }) => (
              <RichText
                onChange={onChange}
                onBlur={onBlur}
                initialValue={formValues.message}
                loading={isLoading}
                publishDisabled={
                  errors?.message?.type === "required" ||
                  !formValues.message ||
                  !formValues.title ||
                  !formValues.shortDescription ||
                  !wallet
                }
                onPublish={onPublish}
                authorId={userId || ""}
                postId=""
                setIsMapShown={setIsMapShown}
                hasLocation={!!location}
              />
            )}
          />
        </View>

        {step.id !== "UNDEFINED" && isProgressBarShown && (
          <>
            <FeedPostingProgressBar
              step={step}
              ipfsUploadProgress={ipfsUploadProgress}
            />
            <SpacerColumn size={3} />
          </>
        )}
      </ScrollView>

      {isMapShown && (
        <MapModal
          visible
          onClose={() => setIsMapShown(false)}
          setLocation={setLocation}
          location={location}
          postCategory={postCategory}
        />
      )}
    </ScreenContainer>
  );
};
