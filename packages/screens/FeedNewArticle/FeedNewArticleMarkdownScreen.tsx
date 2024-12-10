import pluralize from "pluralize";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";

import useSelectedWallet from "../../hooks/useSelectedWallet";

import penSVG from "@/assets/icons/pen.svg";
import priceSVG from "@/assets/icons/price.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { WalletStatusBox } from "@/components/WalletStatusBox";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { Label, TextInputCustom } from "@/components/inputs/TextInputCustom";
import { FileUploader } from "@/components/inputs/fileUploader";
import { FeedPostingProgressBar } from "@/components/loaders/FeedPostingProgressBar";
import { PublishValues } from "@/components/socialFeed/RichText/RichText.type";
import { SocialArticleCard } from "@/components/socialFeed/SocialCard/cards/SocialArticleCard";
import { MapModal } from "@/components/socialFeed/modals/MapModal/MapModal";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useWalletControl } from "@/context/WalletControlProvider";
import { useFeedPosting } from "@/hooks/feed/useFeedPosting";
import { useIpfs } from "@/hooks/useIpfs";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature } from "@/networks";
import { ArticleContentEditor } from "@/screens/FeedNewArticle/components/ArticleContentEditor/ArticleContentEditor";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { feedPostingStep, FeedPostingStepId } from "@/utils/feed/posting";
import { generateArticleMetadata } from "@/utils/feed/queries";
import { generateIpfsKey } from "@/utils/ipfs";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import {
  neutral00,
  neutral11,
  neutral33,
  neutral77,
  neutralFF,
  secondaryColor,
} from "@/utils/style/colors";
import { fontSemibold13, fontSemibold20 } from "@/utils/style/fonts";
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "@/utils/style/layout";
import {
  CustomLatLngExpression,
  NewArticleFormValues,
  PostCategory,
  SocialFeedArticleMetadata,
} from "@/utils/types/feed";
import { RemoteFileData } from "@/utils/types/files";

//TODO: In mobile : Make ActionsContainer accessible (floating button ?)

export const FeedNewArticleMarkdownScreen: ScreenFC<
  "FeedNewArticleMarkdown"
> = () => {
  const { width } = useMaxResolution();
  const { width: windowWidth } = useWindowDimensions();
  const isSmallScreen = windowWidth < RESPONSIVE_BREAKPOINT_S;
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
      setToast({
        mode: "normal",
        type: "success",
        title: "Post submitted successfully.",
        message: "",
      });
      navigateBack();
      newArticleForm.reset();
    }, 1000);
  });
  const forceNetworkFeature = NetworkFeature.SocialFeed;
  const { showNotEnoughFundsModal, showConnectWalletModal } =
    useWalletControl();
  const isLoading = isUploadLoading || isProcessing;
  const { setToast } = useFeedbacks();
  const navigation = useAppNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isThumbnailButtonHovered, setThumbnailButtonHovered] = useState(false);
  const [location, setLocation] = useState<CustomLatLngExpression>();
  const [isMapShown, setIsMapShown] = useState(false);
  const cardStyle = isSmallScreen && {
    borderRadius: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  };
  const newArticleForm = useForm<NewArticleFormValues>({
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
  const formValues = newArticleForm.watch();
  const previewMetadata: SocialFeedArticleMetadata = {
    title: formValues.title,
    shortDescription: formValues.shortDescription || "",
    thumbnailImage: formValues.thumbnailImage,
    message: "",
    hashtags: [],
    mentions: [],
  };

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
        setToast({
          mode: "normal",
          type: "error",
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
      setToast({
        mode: "normal",
        type: "error",
        title: "Something went wrong.",
        message: err instanceof Error ? err.message : `${err}`,
      });
    }
  };

  //TODO: Keep short post formValues when returning to short post
  const navigateBack = () => navigation.navigate("Feed");

  //TODO: Not handled for now
  // const { mutate: openGraphMutate, data: openGraphData } = useOpenGraph();

  // // OpenGraph URL preview
  // useEffect(() => {
  //   addedUrls.forEach(url => {
  //     openGraphMutate({
  //       url,
  //     });
  //
  //   })
  // }, [addedUrls])

  // Scroll to bottom when the loading bar appears
  useEffect(() => {
    if (step.id !== "UNDEFINED" && isLoading)
      scrollViewRef.current?.scrollToEnd();
  }, [step, isLoading]);

  return (
    <ScreenContainer
      forceNetworkFeatures={[forceNetworkFeature]}
      responsive
      mobileTitle="NEW ARTICLE"
      fullWidth
      headerChildren={<BrandText style={fontSemibold20}>New Article</BrandText>}
      onBackPress={navigateBack}
      footerChildren
      noMargin
      noScroll
    >
      <ScrollView
        ref={scrollViewRef}
        style={{
          paddingTop: isMobile ? layout.spacing_x2 : layout.contentSpacing,
          paddingBottom: layout.spacing_x2,
        }}
        contentContainerStyle={{
          width: "100%",
          maxWidth: screenContentMaxWidth,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            alignSelf: "center",
            width,
          }}
        >
          <WalletStatusBox />
          <SpacerColumn size={3} />

          <TertiaryBox
            style={{
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
                ? `You have ${freePostCount} free ${pluralize(
                    "Article",
                    freePostCount,
                  )} left`
                : `The cost for this Article is ${prettyPublishingFee}`}
            </BrandText>
          </TertiaryBox>

          <TextInputCustom<NewArticleFormValues>
            noBrokenCorners
            rules={{ required: true }}
            height={48}
            label="Preview title"
            placeHolder="Type title here"
            name="title"
            control={newArticleForm.control}
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
            label="Preview subtitle"
            placeHolder="Type short description here"
            name="shortDescription"
            control={newArticleForm.control}
            variant="labelOutside"
            containerStyle={{ marginBottom: layout.spacing_x3 }}
            boxMainContainerStyle={{
              backgroundColor: neutral00,
              borderRadius: 12,
            }}
          />

          <Label>Article preview</Label>
          <SpacerColumn size={1.5} />
        </View>

        <View
          style={{
            width: isSmallScreen ? windowWidth : width,
            maxWidth: screenContentMaxWidth,
            alignSelf: "center",
          }}
        >
          <View>
            <FileUploader
              label="Thumbnail image"
              onUpload={(files) =>
                newArticleForm.setValue("thumbnailImage", {
                  isThumbnailImage: true,
                  ...files[0],
                })
              }
              mimeTypes={IMAGE_MIME_TYPES}
            >
              {({ onPress }) => (
                <CustomPressable
                  onHoverIn={() => setThumbnailButtonHovered(true)}
                  onHoverOut={() => setThumbnailButtonHovered(false)}
                  onPress={onPress}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    zIndex: 1,
                    backgroundColor: neutral00,
                    borderColor: isThumbnailButtonHovered
                      ? neutralFF
                      : neutral33,
                    borderWidth: 1,
                    borderRadius: 999,
                    height: 36,
                    width: 36,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SVG
                    source={penSVG}
                    width={24}
                    height={24}
                    color={neutralFF}
                  />
                </CustomPressable>
              )}
            </FileUploader>

            <SocialArticleCard
              style={cardStyle}
              disabled
              post={{
                category: PostCategory.MarkdownArticle,
                isDeleted: false,
                identifier: "",
                metadata: JSON.stringify(previewMetadata),
                parentPostIdentifier: "",
                subPostLength: 0,
                authorId: userId || "",
                createdAt: Date.parse("2024-06-17") / 1000,
                reactions: [],
                tipAmount: 0,
                premiumLevel: 0,
                id: "",
                localIdentifier: "",
                networkId: selectedNetworkId,
              }}
            />
          </View>
        </View>
        <SpacerColumn size={3} />

        <FormProvider {...newArticleForm}>
          <ArticleContentEditor width={width} />
        </FormProvider>

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
