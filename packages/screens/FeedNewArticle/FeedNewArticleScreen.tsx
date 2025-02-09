import pluralize from "pluralize";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { useSelector } from "react-redux";

import useSelectedWallet from "../../hooks/useSelectedWallet";

import penSVG from "@/assets/icons/pen.svg";
import priceSVG from "@/assets/icons/price.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { DAOSelector } from "@/components/dao/DAOSelector";
import { Label, TextInputCustom } from "@/components/inputs/TextInputCustom";
import { FileUploader } from "@/components/inputs/fileUploader";
import { FeedPostingProgressBar } from "@/components/loaders/FeedPostingProgressBar";
import { SocialArticleMarkdownCard } from "@/components/socialFeed/SocialCard/cards/SocialArticleMarkdownCard";
import { MapModal } from "@/components/socialFeed/modals/MapModal/MapModal";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useWalletControl } from "@/context/WalletControlProvider";
import { useFeedPosting } from "@/hooks/feed/useFeedPosting";
import { useIpfs } from "@/hooks/useIpfs";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { NetworkFeature } from "@/networks";
import { ArticleContentEditor } from "@/screens/FeedNewArticle/components/ArticleContentEditor/ArticleContentEditor";
import { NewArticleLocationButton } from "@/screens/FeedNewArticle/components/NewArticleLocationButton";
import { selectNFTStorageAPI } from "@/store/slices/settings";
import { feedPostingStep, FeedPostingStepId } from "@/utils/feed/posting";
import { generateArticleMarkdownMetadata } from "@/utils/feed/queries";
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
import { fontSemibold13 } from "@/utils/style/fonts";
import {
  layout,
  RESPONSIVE_BREAKPOINT_S,
  screenContentMaxWidth,
} from "@/utils/style/layout";
import {
  CustomLatLngExpression,
  NewArticleFormValues,
  PostCategory,
  SocialFeedArticleMarkdownMetadata,
} from "@/utils/types/feed";

export const FeedNewArticleScreen: ScreenFC<"FeedNewArticle"> = () => {
  const { width } = useMaxResolution();
  const { width: windowWidth } = useWindowDimensions();
  const isSmallScreen = windowWidth < RESPONSIVE_BREAKPOINT_S;
  const isMobile = useIsMobile();
  const wallet = useSelectedWallet();
  const selectedNetworkId = useSelectedNetworkId();
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const [selectedDaoId, setSelectedDAOId] = useState<string>();
  const userId = selectedDaoId || wallet?.userId;
  const { uploadFilesToPinata, ipfsUploadProgress } = useIpfs();
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isProgressBarShown, setIsProgressBarShown] = useState(false);
  const [isMapShown, setIsMapShown] = useState(false);
  const postCategory = PostCategory.ArticleMarkdown;
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
  const cardStyle = isSmallScreen && {
    borderRadius: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  };
  const newArticleForm = useForm<NewArticleFormValues>({
    defaultValues: {
      title: "",
      message: "",
      thumbnailImage: undefined,
      shortDescription: "",
    },
    mode: "onBlur",
  });

  const formValues = newArticleForm.watch();
  const previewMetadata: SocialFeedArticleMarkdownMetadata = {
    title: formValues.title,
    shortDescription: formValues.shortDescription || "",
    thumbnailImage: formValues.thumbnailImage,
    message: "",
    hashtags: [],
    mentions: [],
  };

  const navigateBack = () => navigation.navigate("Feed");

  const onPublish = async () => {
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
      // Upload thumbnail to IPFS
      const pinataJWTKey =
        userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
      if (!pinataJWTKey) {
        console.error("upload file err : No Pinata JWT");
        setToast({
          title: "File upload failed",
          message: "No Pinata JWT",
          type: "error",
          mode: "normal",
        });
        setIsUploadLoading(false);
        return;
      }
      setStep(feedPostingStep(FeedPostingStepId.UPLOADING_FILES));

      const remoteThumbnail = formValues.thumbnailImage
        ? (
            await uploadFilesToPinata({
              files: [formValues.thumbnailImage],
              pinataJWTKey,
            })
          )[0]
        : undefined;

      const metadata = generateArticleMarkdownMetadata({
        ...formValues,
        thumbnailImage: remoteThumbnail,
        gifs: [],
        files: [],
        mentions: [],
        hashtags: [],
        message: formValues.message,
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

  // Reset DAOSelector when the user selects another wallet
  const [daoSelectorKey, setDaoSelectorKey] = useState(0);
  useEffect(() => {
    setSelectedDAOId(undefined);
    setDaoSelectorKey((key) => key + 1);
  }, [wallet]);

  return (
    <ScreenContainer
      forceNetworkFeatures={[forceNetworkFeature]}
      responsive
      mobileTitle="NEW ARTICLE"
      fullWidth
      headerChildren={<ScreenTitle>New Article</ScreenTitle>}
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
          <DAOSelector
            onSelect={setSelectedDAOId}
            userId={wallet?.userId}
            style={{ width: "100%" }}
            key={daoSelectorKey}
          />
          <SpacerColumn size={3} />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TertiaryBox
              style={{
                paddingVertical: layout.spacing_x1,
                paddingHorizontal: layout.spacing_x1_5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                height: 48,
                backgroundColor: neutral11,
                flex: 1,
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

            <SpacerRow size={2} />
            <NewArticleLocationButton
              setIsMapShown={setIsMapShown}
              location={location}
            />

            <SpacerRow size={2} />
            <PrimaryButton
              text={selectedDaoId ? "Propose" : "Publish"}
              width={120}
              disabled={
                !formValues.title ||
                !formValues.shortDescription ||
                !formValues.message ||
                isLoading
              }
              onPress={newArticleForm.handleSubmit(onPublish)}
              loader
              isLoading={isLoading}
            />
          </View>

          {step.id !== "UNDEFINED" && isProgressBarShown && (
            <>
              <SpacerColumn size={3} />
              <FeedPostingProgressBar
                step={step}
                ipfsUploadProgress={ipfsUploadProgress}
              />
            </>
          )}

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

            <SocialArticleMarkdownCard
              style={cardStyle}
              disabled
              post={{
                category: PostCategory.ArticleMarkdown,
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
