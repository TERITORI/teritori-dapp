import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Step1Component } from "./Step1Component";
import { Step2Component } from "./Step2Component";
import { signingMusicPlayerClient } from "../../../client-creators/musicplayerClient";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { defaultSocialFeedFee } from "../../../utils/fee";
import { LocalFileData } from "../../../utils/types/files";
import {
  AlbumInfo,
  AlbumMetadataInfo,
  Media,
} from "../../../utils/types/mediaPlayer";
import ModalBase from "../../modals/ModalBase";

interface UploadAlbumModalProps {
  onClose: () => void;
  isVisible: boolean;
}
export const UPLOAD_ALBUM_MODAL_WIDTH = 564;

export const UploadAlbumModal: React.FC<UploadAlbumModalProps> = ({
  onClose,
  isVisible,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();
  const [step, setStep] = useState<number>(0);
  const [uploadFiles, setUploadFiles] = useState<LocalFileData[]>([]);
  const [albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    name: "",
    description: "",
    image: "",
    createdBy: "",
    audios: [],
  });
  const uploadAlbum = async () => {
    if (!albumInfo) return;
    if (!albumInfo.name) return;
    if (!albumInfo.description) return;
    if (uploadFiles.length === 0) return;

    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingMusicPlayerClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    const audios: Media[] = uploadFiles.map((uploadFile) => ({
      name: uploadFile.fileName,
      fileUrl: uploadFile.url,
      duration: uploadFile.audioMetadata?.duration,
      createdBy: albumInfo.createdBy,
      imageUrl: albumInfo.image,
    }));

    const metadata: AlbumMetadataInfo = {
      title: albumInfo.name,
      description: albumInfo.description,
      image: albumInfo.image,
      audios: audios.map((a) => {
        return {
          duration: (a?.duration || 0) * 1000,
          ipfs: a.fileUrl,
          name: a.name,
        };
      }),
    };

    try {
      const res = await client.createMusicAlbum(
        {
          metadata: JSON.stringify(metadata),
          identifier: uuidv4(),
        },
        defaultSocialFeedFee,
        ""
      );

      if (res.transactionHash) {
        setToastSuccess({
          title: "Uploaded album successfully",
          message: `tx_hash: ${res.transactionHash}`,
        });
      }
    } catch (err) {
      setToastError({
        title: "Failed to upload album",
        message: `Error: ${err}`,
      });
    }
    setStep(0);
    onClose();
  };

  return (
    <ModalBase
      label="Upload album"
      visible={isVisible}
      onClose={() => {
        setStep(0);
        onClose();
      }}
      width={UPLOAD_ALBUM_MODAL_WIDTH}
    >
      {step === 0 && (
        <Step1Component setStep={setStep} setUploadFiles={setUploadFiles} />
      )}
      {step === 1 && (
        <Step2Component
          uploadFiles={uploadFiles}
          setUploadFiles={setUploadFiles}
          albumInfo={albumInfo}
          setAlbumInfo={setAlbumInfo}
          uploadAlbum={uploadAlbum}
        />
      )}
    </ModalBase>
  );
};
