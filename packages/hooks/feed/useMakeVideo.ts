import { useState } from "react";
import { useSelector } from "react-redux";

import { useCanPay } from "./useCanPay";
import { useFeedPostFee } from "./useFeedPostFee";
import { useFeedPosting } from "./useFeedPosting";
import { useFreePostsCount } from "./useFreePostsCount";
import { Coin } from "../../api/teritori-chain/cosmos/base/v1beta1/coin";
import {
  PostCategory,
  SocialFeedVideoMetadata,
} from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useWalletControl } from "../../context/WalletControlProvider";
import { getStakingCurrency, NetworkFeature } from "../../networks";
import { selectNFTStorageAPI } from "../../store/slices/settings";
import { generateIpfsKey, uploadFilesToPinata } from "../../utils/ipfs";
import { LocalFileData } from "../../utils/types/files";
import { useSelectedNetworkId } from "../useSelectedNetwork";
import useSelectedWallet from "../useSelectedWallet";

interface MakeVideoParams {
  title: string;
  description: string;
  localVideoFile: LocalFileData;
  localThumbnailImageFile?: LocalFileData;
}

interface UseMakeVideoParams {
  userId: string | undefined;
  onSuccess?: () => void;
}

export const useMakeVideo = ({ userId, onSuccess }: UseMakeVideoParams) => {
  const networkId = useSelectedNetworkId();
  const postCategory = PostCategory.Video;
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

  const makeVideo = async ({
    title,
    description,
    localVideoFile,
    localThumbnailImageFile,
  }: MakeVideoParams) => {
    const action = "Publish a Video";
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
      const pinataJWTKey =
        userIPFSKey || (await generateIpfsKey(networkId || "", userId));
      if (!pinataJWTKey) {
        console.error("upload file err : No Pinata JWT");
        setToastError({
          title: "File upload failed",
          message: "No Pinata JWT",
        });
        return;
      }

      const uploadedFiles = await uploadFilesToPinata({
        pinataJWTKey,
        files: [
          {
            ...localVideoFile,
            thumbnailFileData: localThumbnailImageFile,
          },
        ],
      });
      if (!uploadedFiles.find((file) => file.url)) {
        console.error("upload file err : Fail to pin to IPFS");
        setToastError({
          title: "File upload failed",
          message: "Fail to pin to IPFS, please try to Publish again",
        });
        return;
      }

      const video: SocialFeedVideoMetadata = {
        title,
        description,
        videoFile: uploadedFiles[0],
      };

      // we need this hack until the createdAt field is properly provided by the contract
      const videoWithCreationDate = {
        ...video,
        createdAt: new Date(),
      };

      await processFeedPosting(JSON.stringify(videoWithCreationDate));
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
    makeVideo,
    isProcessing,
    isLoading,
  };
};
