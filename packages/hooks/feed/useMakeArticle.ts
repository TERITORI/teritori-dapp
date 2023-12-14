import { useState } from "react";
import { useSelector } from "react-redux";

import { useCanPay } from "./useCanPay";
import { useFeedPostFee } from "./useFeedPostFee";
import { useFeedPosting } from "./useFeedPosting";
import { useFreePostsCount } from "./useFreePostsCount";
import { Coin } from "../../api/teritori-chain/cosmos/base/v1beta1/coin";
import {
  NewArticleFormValues,
  PostCategory,
} from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { generateArticleMetadata } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { RichTextPublishValues } from "../../components/socialFeed/RichText/RichText.type";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useWalletControl } from "../../context/WalletControlProvider";
import { getStakingCurrency, NetworkFeature } from "../../networks";
import { selectNFTStorageAPI } from "../../store/slices/settings";
import {
  generateIpfsKey,
  uploadFilesToPinata,
  web3ToWeb2URI,
} from "../../utils/ipfs";
import { RemoteFileData } from "../../utils/types/files";
import { useSelectedNetworkId } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

interface MakeArticleParams {
  formValues: NewArticleFormValues;
  richTextPublishValues: RichTextPublishValues;
}

interface UseMakeArticleParams {
  userId?: string;
  onSuccess?: () => void;
}

export const useMakeArticle = ({ userId, onSuccess }: UseMakeArticleParams) => {
  const networkId = useSelectedNetworkId();
  const postCategory = PostCategory.Article;
  const { postFee } = useFeedPostFee(networkId, postCategory);
  const feeCurrency = getStakingCurrency(networkId);
  const selectedWallet = useSelectedWallet();
  const { setToastError } = useFeedbacks();
  const { showNotEnoughFundsModal, showConnectWalletModal } =
    useWalletControl();
  const [isLoading, setLoading] = useState(false);
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const { freePostCount } = useFreePostsCount(userId, postCategory);
  const cost: Coin = {
    amount: postFee.toString(),
    denom: feeCurrency?.denom || "",
  };
  const canPay = useCanPay({ userId, cost });
  const forceNetworkFeature = NetworkFeature.SocialFeed;

  const { processFeedPosting, isProcessing } = useFeedPosting({
    networkId,
    userId,
    postCategory,
    onSuccess,
  });

  const makeArticle = async ({
    formValues,
    richTextPublishValues,
  }: MakeArticleParams) => {
    const action = "Publish an Article";
    if (!selectedWallet?.address || !selectedWallet.connected) {
      showConnectWalletModal({
        forceNetworkFeature,
        action,
      });
      return;
    }
    if (!canPay && !freePostCount) {
      showNotEnoughFundsModal({
        action,
        cost,
      });
      return;
    }
    setLoading(true);

    try {
      const localFiles = [
        ...(formValues.files || []),
        ...richTextPublishValues.images,
        ...richTextPublishValues.audios,
        ...richTextPublishValues.videos,
      ];

      let pinataJWTKey = undefined;
      if (
        localFiles?.length ||
        formValues.thumbnailImage ||
        formValues.coverImage
      ) {
        pinataJWTKey =
          userIPFSKey || (await generateIpfsKey(networkId || "", userId));
      }

      // Upload thumbnail to IPFS
      let thumbnailImageRemoteFile: RemoteFileData | undefined;
      if (formValues.thumbnailImage && pinataJWTKey) {
        const remoteFiles = await uploadFilesToPinata({
          files: [formValues.thumbnailImage],
          pinataJWTKey,
        });
        thumbnailImageRemoteFile = remoteFiles[0];
      }
      // Upload cover to IPFS
      let coverImageRemoteFile: RemoteFileData | undefined;
      if (formValues.coverImage && pinataJWTKey) {
        const remoteFiles = await uploadFilesToPinata({
          files: [formValues.coverImage],
          pinataJWTKey,
        });
        coverImageRemoteFile = remoteFiles[0];
      }

      // Upload other files to IPFS
      let remoteFiles: RemoteFileData[] = [];
      if (localFiles?.length && pinataJWTKey) {
        remoteFiles = await uploadFilesToPinata({
          files: localFiles,
          pinataJWTKey,
        });
      }

      // If the user uploaded files, but they are not pinned to IPFS, it returns files with empty url, so this is an error.
      if (
        (localFiles?.length && !remoteFiles.find((file) => file.url)) ||
        (formValues.thumbnailImage && !thumbnailImageRemoteFile) ||
        (formValues.coverImage && !coverImageRemoteFile)
      ) {
        console.error("upload file err : Fail to pin to IPFS");
        setToastError({
          title: "File upload failed",
          message: "Fail to pin to IPFS, please try to Publish again",
        });
        setLoading(false);
        return;
      }

      let message = richTextPublishValues.html;

      if (remoteFiles.length) {
        localFiles?.map((file, index) => {
          // Audio are not in the HTML for now
          if (remoteFiles[index]?.fileType !== "audio") {
            message = message.replace(
              file.url,
              web3ToWeb2URI(remoteFiles[index].url),
            );
          }
        });
      }

      const metadata = generateArticleMetadata({
        ...formValues,
        thumbnailImage: thumbnailImageRemoteFile,
        coverImage: coverImageRemoteFile,
        gifs: richTextPublishValues.gifs,
        files: remoteFiles,
        mentions: richTextPublishValues.mentions,
        hashtags: richTextPublishValues.hashtags,
        message,
      });

      await processFeedPosting(JSON.stringify(metadata));
    } catch (err) {
      console.error("post submit err", err);
      setToastError({
        title: "Post creation failed",
        message: err instanceof Error ? err.message : `${err}`,
      });
    }

    setLoading(false);
  };

  return {
    makeArticle,
    isProcessing,
    isLoading,
  };
};
