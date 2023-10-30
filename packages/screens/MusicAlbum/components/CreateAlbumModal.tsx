import { coin } from "@cosmjs/amino";
import React, { Fragment, useState } from "react";
import {
  Image,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { DraxList, DraxProvider } from "react-native-drax";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import Add from "../../../../assets/icons/music-player/add-primary.svg";
import DefaultAlbumImage from "../../../../assets/icons/music-player/album.png";
import Img from "../../../../assets/icons/music-player/img.svg";
import List from "../../../../assets/icons/music-player/list.svg";
import TrashCircle from "../../../../assets/icons/music-player/trash-circle.svg";
import { signingSocialFeedClient } from "../../../client-creators/socialFeedClient";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { FileUploader } from "../../../components/fileUploader";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import ModalBase from "../../../components/modals/ModalBase";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useUpdatePostFee } from "../../../hooks/feed/useUpdatePostFee";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { selectNFTStorageAPI } from "../../../store/slices/settings";
import {
  generateIpfsKey,
  ipfsURLToHTTPURL,
  uploadFilesToPinata,
  uploadFileToIPFS,
} from "../../../utils/ipfs";
import { AUDIO_MIME_TYPES, IMAGE_MIME_TYPES } from "../../../utils/mime";
import {
  neutral17,
  neutral30,
  neutral33,
  neutral77,
  primaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/files";
import {
  AlbumInfo,
  AlbumMetadataInfo,
  Media,
} from "../../../utils/types/mediaPlayer";

interface UploadAlbumModalProps {
  onClose: () => void;
  isVisible: boolean;
}

const UPLOAD_ALBUM_MODAL_WIDTH = 564;

export const CreateAlbumModal: React.FC<UploadAlbumModalProps> = ({
  onClose,
  isVisible,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedNetworkId = useSelectedNetworkId();
  const wallet = useSelectedWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const userIPFSKey = useSelector(selectNFTStorageAPI);
  const [albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    id: "",
    name: "",
    description: "",
    image: "",
    createdBy: "",
    audios: [],
  });
  const [audios, setAudios] = useState<Media[]>([]);
  const { postFee } = useUpdatePostFee(
    selectedNetworkId,
    PostCategory.MusicAlbum
  );

  const onItemRemove = (index: number) => {
    const newAudios = audios.slice();
    newAudios.splice(index, 1);
    setAudios(newAudios);
  };

  const onUploadAlbumImage = async (files: LocalFileData[]) => {
    setIsUploading(true);
    const uploadedFile = await uploadFileToIPFS({
      userKey: userIPFSKey,
      file: files[0],
      networkId: selectedNetworkId,
      userId,
    });
    if (!uploadedFile?.url) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    setAlbumInfo({ ...albumInfo, image: uploadedFile.url });
    setIsUploading(false);
  };

  const onUploadAudioFiles = async (files: LocalFileData[]) => {
    setIsUploading(true);
    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetworkId, userId));
    if (!pinataJWTKey) {
      console.error("upload file err : No Pinata JWT");
      setToastError({
        title: "File upload failed",
        message: "No Pinata JWT",
      });
      return;
    }
    const uploadedFiles = await uploadFilesToPinata({
      files,
      pinataJWTKey,
    });
    if (!uploadedFiles.find((file) => file.url)) {
      console.error("upload file err : Fail to pin to IPFS");
      setToastError({
        title: "File upload failed",
        message: "Fail to pin to IPFS, please try to Publish again",
      });
      return;
    }
    const audiosToAdd = uploadedFiles.map((remoteFileData) => {
      // For each tracks of this album, some Media props depends on this AlbumInfo props
      return {
        duration: remoteFileData.audioMetadata?.duration, //ms,
        imageUrl: albumInfo.image,
        name: remoteFileData.fileName,
        fileUrl: remoteFileData.url,
        createdBy: albumInfo.createdBy,
        albumId: albumInfo.id,
      };
    });

    setAudios((audios) => {
      const filteredAudiosToAdd = audiosToAdd.filter(
        (media) => !audios.find((m) => m.fileUrl === media.fileUrl)
      );
      return [...audios, ...filteredAudiosToAdd];
    });
    setIsUploading(false);
  };

  const handleAlbumNameTextChange = (text: string) => {
    setAlbumInfo({ ...albumInfo, name: text.trim() });
  };

  const handleAlbumDescriptionTextChange = (text: string) => {
    setAlbumInfo({ ...albumInfo, description: text.trim() });
  };

  const onPressUpload = async () => {
    setIsLoading(true);

    if (!wallet?.connected || !wallet.address) {
      return;
    }
    const client = await signingSocialFeedClient({
      networkId: selectedNetworkId,
      walletAddress: wallet.address,
    });
    const metadata: AlbumMetadataInfo = {
      title: albumInfo.name,
      description: albumInfo.description,
      image: albumInfo.image,
      audios: audios.map((a) => {
        return {
          duration: a?.duration || 0,
          ipfs: a.fileUrl,
          name: a.name,
        };
      }),
    };

    try {
      const res = await client.createPost(
        {
          category: PostCategory.MusicAlbum,
          identifier: uuidv4(),
          metadata: JSON.stringify(metadata),
          parentPostIdentifier: undefined,
        },
        "auto",
        undefined,
        [coin(postFee, "utori")] // FIXME: don't hardcode denom
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
    setIsLoading(false);
    onClose();
  };

  return (
    <ModalBase
      label="Upload album"
      visible={isVisible}
      onClose={onClose}
      width={UPLOAD_ALBUM_MODAL_WIDTH}
    >
      <View style={inputBoxStyle}>
        <View
          style={[imgBoxStyle, (isUploading || isLoading) && { opacity: 0.5 }]}
        >
          <Image
            source={
              albumInfo.image === ""
                ? DefaultAlbumImage
                : ipfsURLToHTTPURL(albumInfo.image)
            }
            style={imgStyle}
          />
          <View style={uploadImgStyle}>
            <FileUploader
              onUpload={onUploadAlbumImage}
              style={uploadButtonStyle}
              mimeTypes={IMAGE_MIME_TYPES}
              maxUpload={1}
              setIsLoading={setIsLoading}
            >
              {({ onPress }) => (
                <TouchableOpacity
                  style={uploadButtonStyle}
                  onPress={onPress}
                  disabled={isUploading || isLoading}
                >
                  <SVG source={Img} width={16} height={16} />
                  <SpacerRow size={1} />
                  <BrandText style={fontSemibold14}>upload image</BrandText>
                </TouchableOpacity>
              )}
            </FileUploader>
          </View>
        </View>
        <View style={textBoxStyle}>
          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={handleAlbumNameTextChange}
            label="Album name"
            name="albumName"
          />
          <SpacerColumn size={2.5} />

          <TextInputCustom
            rules={{ required: true }}
            noBrokenCorners
            variant="labelOutside"
            onChangeText={handleAlbumDescriptionTextChange}
            label="Album Description"
            name="albumDescription"
          />
        </View>
      </View>
      {!!audios.length && <SpacerColumn size={2.5} />}
      <DraxProvider>
        <DraxList
          data={audios}
          onItemReorder={({ fromIndex, toIndex }) => {
            const newAudios = audios.slice();
            newAudios.splice(toIndex, 0, newAudios.splice(fromIndex, 1)[0]);
            setAudios(newAudios);
          }}
          renderItemContent={({ item, index }) => {
            return (
              <Fragment key={index}>
                <SpacerColumn size={0.5} />
                <View style={unitBoxStyle}>
                  <View style={oneLineStyle}>
                    <TouchableOpacity>
                      <SVG source={List} width={16} height={16} />
                    </TouchableOpacity>
                    <SpacerRow size={1.5} />
                    <BrandText style={fontSemibold14}>{item.name}</BrandText>
                  </View>
                  <View style={oneLineStyle}>
                    <TouchableOpacity onPress={() => onItemRemove(index)}>
                      <SVG source={TrashCircle} width={24} height={24} />
                    </TouchableOpacity>
                  </View>
                </View>
                <SpacerColumn size={0.5} />
              </Fragment>
            );
          }}
          keyExtractor={(item) => item.fileUrl}
        />
      </DraxProvider>

      <FileUploader
        multiple
        onUpload={onUploadAudioFiles}
        style={uploadButtonStyle}
        mimeTypes={AUDIO_MIME_TYPES}
        setIsLoading={setIsLoading}
      >
        {({ onPress }) => (
          <TouchableOpacity
            style={[
              buttonContainerStyle,
              (isUploading || isLoading) && { opacity: 0.5 },
            ]}
            onPress={onPress}
            disabled={isUploading || isLoading}
          >
            <SVG source={Add} width={20} height={20} />
            <SpacerRow size={1} />
            <BrandText style={buttonTextStyle}>Add songs</BrandText>
          </TouchableOpacity>
        )}
      </FileUploader>

      <BrandText
        style={[
          fontSemibold14,
          {
            color: neutral77,
          },
        ]}
      >
        Provide FLAC, WAV or AIFF for highest audio quality.
      </BrandText>
      <SpacerColumn size={2.5} />

      <View style={divideLineStyle} />

      <View style={footerStyle}>
        <BrandText style={footerTextStyle} numberOfLines={2}>
          By uploading, you confirm that your sounds comply with our Terms of
          Use.
        </BrandText>
        <PrimaryButton
          text="Upload"
          disabled={
            albumInfo.name === "" ||
            albumInfo.description === "" ||
            !albumInfo.image ||
            !audios.length ||
            isUploading ||
            isLoading
          }
          size="SM"
          onPress={onPressUpload}
          isLoading={isUploading || isLoading}
        />
      </View>
    </ModalBase>
  );
};

const buttonContainerStyle: ViewStyle = {
  marginTop: layout.spacing_x2_5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  borderRadius: layout.spacing_x1,
  backgroundColor: neutral30,
  marginBottom: layout.spacing_x2,
};
const buttonTextStyle: TextStyle = {
  ...fontSemibold14,

  color: primaryColor,
};
const divideLineStyle: ViewStyle = {
  height: 1,
  width: UPLOAD_ALBUM_MODAL_WIDTH - 2,
  marginLeft: -layout.spacing_x2_5,
  backgroundColor: neutral33,
};
const footerStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: layout.spacing_x2_5,
  paddingVertical: layout.spacing_x2,
};
const footerTextStyle: TextStyle = {
  ...fontSemibold14,

  color: neutral77,
  width: "55%",
};

const unitBoxStyle: ViewStyle = {
  backgroundColor: neutral17,
  paddingHorizontal: layout.spacing_x1_5,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: layout.spacing_x1,
  height: 40,
};
const oneLineStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
};
const inputBoxStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
};
const imgBoxStyle: ViewStyle = {
  position: "relative",
};
const imgStyle: ImageStyle = {
  width: 172,
  height: 172,
  borderRadius: layout.spacing_x1,
};
const textBoxStyle: ViewStyle = {
  width: 332,
};

const uploadImgStyle: ViewStyle = {
  width: "100%",
  position: "absolute",
  left: 0,
  bottom: layout.spacing_x1,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
const uploadButtonStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#2B2B33",
  borderRadius: layout.spacing_x4,
  paddingLeft: layout.spacing_x1,
  paddingRight: layout.spacing_x1_5,
  paddingVertical: layout.spacing_x1,
};
