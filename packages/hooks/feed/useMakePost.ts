import { useState } from "react";
import { useSelector } from "react-redux";

import { useCanPay } from "./useCanPay";
import { useFeedPostFee } from "./useFeedPostFee";
import { useFeedPosting } from "./useFeedPosting";
import { useFreePostsCount } from "./useFreePostsCount";
import { Coin } from "../../api/teritori-chain/cosmos/base/v1beta1/coin";
import {
  NewPostFormValues,
  PostCategory,
} from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { generatePostMetadata } from "../../components/socialFeed/NewsFeed/NewsFeedQueries";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useWalletControl } from "../../context/WalletControlProvider";
import {
  getStakingCurrency,
  NetworkFeature,
  parseUserId,
} from "../../networks";
import { selectNFTStorageAPI } from "../../store/slices/settings";
import { generateIpfsKey, uploadFilesToPinata } from "../../utils/ipfs";
import { RemoteFileData } from "../../utils/types/files";
import useSelectedWallet from "../useSelectedWallet";

interface MakeSimplePostParams {
  formValues: NewPostFormValues;
  parentPostIdentifier?: string;
}

interface UseMakeSimplePostParams {
  postCategory: PostCategory;
  networkId?: string;
  userId?: string;
  onSuccess?: () => void;
}

export const useMakePost = ({
  postCategory,
  networkId,
  userId,
  onSuccess,
}: UseMakeSimplePostParams) => {
  const [network] = parseUserId(userId);
  if (network) {
    networkId = network.id;
  }
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

  const makeSimplePost = async ({
    formValues,
    parentPostIdentifier,
  }: MakeSimplePostParams) => {
    const action = "Publish a Post";
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
      let remoteFiles: RemoteFileData[] = [];

      if (formValues.files?.length) {
        const pinataJWTKey =
          userIPFSKey || (await generateIpfsKey(networkId || "", userId));
        if (pinataJWTKey) {
          remoteFiles = await uploadFilesToPinata({
            files: formValues.files,
            pinataJWTKey,
          });
        }
      }
      if (formValues.files?.length && !remoteFiles.find((file) => file.url)) {
        console.error("upload file err : Fail to pin to IPFS");
        setToastError({
          title: "File upload failed",
          message: "Fail to pin to IPFS, please try to Publish again",
        });
        return;
      }

      const metadata = generatePostMetadata({
        title: formValues.title || "",
        message: formValues.message,
        files: remoteFiles,
        hashtags: formValues.hashtags,
        mentions: formValues.mentions,
        gifs: formValues?.gifs || [],
      });

      await processFeedPosting(JSON.stringify(metadata), parentPostIdentifier);
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
    makeSimplePost,
    isProcessing,
    isLoading,
  };
};
