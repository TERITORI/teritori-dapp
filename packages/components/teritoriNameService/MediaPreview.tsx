import * as DocumentPicker from "expo-document-picker";
import { DocumentPickerResult } from "expo-document-picker";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ActivityIndicator, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import tnsProfileAvatar from "../../../assets/default-images/default-name-nft.png";
import tnsProfileCover from "../../../assets/default-images/tns-profile-cover.png";
import uploadCloudIcon from "../../../assets/icons/upload-cloud.svg";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Metadata } from "../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { PinataFileProps, useIpfs } from "../../hooks/useIpfs";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { selectNFTStorageAPI } from "../../store/slices/settings";
import { generateIpfsKey } from "../../utils/ipfs";
import {
  neutral00,
  neutral17,
  neutral33,
  secondaryColor,
} from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { OptimizedImage } from "../OptimizedImage";
import { SVG } from "../SVG";
import { TextInputCustom } from "../inputs/TextInputCustom";

export const MediaPreview: React.FC<{
  style: ViewStyle;
  avatarImageUrl: string;
  setAvatarImageUrl: Dispatch<SetStateAction<string>>;
  bannerImageUrl: string;
  setBannerImageUrl: Dispatch<SetStateAction<string>>;
}> = ({
  style,
  avatarImageUrl,
  setAvatarImageUrl,
  bannerImageUrl,
  setBannerImageUrl,
}) => {
  const selectedNetwork = useSelectedNetworkInfo();
  const selectedWallet = useSelectedWallet();
  const { setToastError } = useFeedbacks();
  const { pinataPinFileToIPFS } = useIpfs();
  const userId = selectedWallet?.userId;
  const [isAvatarImageUploadLoading, setAvatarImageUploadLoading] =
    useState(false);
  const [isBannerImageUploadLoading, setBannerImageUploadLoading] =
    useState(false);
  const userIPFSKey = useSelector(selectNFTStorageAPI);

  const upload = async (
    callback: Dispatch<SetStateAction<string>>,
    documentPickerResult: DocumentPickerResult,
  ) => {
    const pinataJWTKey =
      userIPFSKey || (await generateIpfsKey(selectedNetwork?.id || "", userId));
    if (!pinataJWTKey) {
      console.error("upload file err : No Pinata JWT");
      setToastError({
        title: "File upload failed",
        message: "No Pinata JWT",
      });
      return;
    }
    if (documentPickerResult.output) {
      const fileIpfsHash = await pinataPinFileToIPFS({
        pinataJWTKey,
        file: { file: documentPickerResult.output[0] },
      } as PinataFileProps);
      callback(`ipfs://${fileIpfsHash}`);
    }
  };

  const onPressUploadAvatar = async () => {
    const documentPickerResult = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });
    setAvatarImageUploadLoading(true);
    await upload(setAvatarImageUrl, documentPickerResult);
    setAvatarImageUploadLoading(false);
  };

  const onPressUploadBanner = async () => {
    const documentPickerResult = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });
    setBannerImageUploadLoading(true);
    await upload(setBannerImageUrl, documentPickerResult);
    setBannerImageUploadLoading(false);
  };

  return (
    <View
      style={{
        borderRadius: layout.borderRadius,
        borderWidth: 1,
        marginBottom: layout.spacing_x1,
        padding: layout.spacing_x1_5,
        backgroundColor: neutral17,
        width: "100%",
      }}
    >
      <TextInputCustom<Metadata>
        name="image"
        style={style}
        label="Avatar URL"
        noBrokenCorners
        variant="labelOutside"
        placeHolder="https://website.com/avatar.jpg"
        onPressChildren={onPressUploadAvatar}
        value={avatarImageUrl}
        onChangeText={setAvatarImageUrl}
        squaresBackgroundColor={neutral17}
      >
        {isAvatarImageUploadLoading ? (
          <ActivityIndicator size={16} color={secondaryColor} />
        ) : (
          <SVG source={uploadCloudIcon} width={16} height={16} />
        )}
      </TextInputCustom>

      <TextInputCustom<Metadata>
        name="public_profile_header"
        style={style}
        label="Cover Image URL"
        noBrokenCorners
        onPressChildren={onPressUploadBanner}
        variant="labelOutside"
        placeHolder="https://website.com/coverimage.jpg"
        value={bannerImageUrl}
        onChangeText={setBannerImageUrl}
        squaresBackgroundColor={neutral17}
      >
        {isBannerImageUploadLoading ? (
          <ActivityIndicator size={16} color={secondaryColor} />
        ) : (
          <SVG source={uploadCloudIcon} width={16} height={16} />
        )}
      </TextInputCustom>

      <View
        style={{
          marginTop: layout.spacing_x1,
          marginBottom: layout.spacing_x3,
        }}
      >
        <OptimizedImage
          sourceURI={bannerImageUrl || tnsProfileCover}
          width={410}
          height={120}
          style={{
            width: "100%",
            height: 120,
            minHeight: 120,
            borderRadius: layout.borderRadius,
            borderWidth: 1,
            borderColor: neutral33,
          }}
        />
        <OptimizedImage
          sourceURI={avatarImageUrl || tnsProfileAvatar}
          resizeMode="cover"
          width={52}
          height={52}
          style={{
            width: 52,
            minWidth: 52,
            height: 52,
            minHeight: 52,
            position: "absolute",
            bottom: -22,
            left: 32,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: neutral00,
          }}
        />
      </View>
    </View>
  );
};
