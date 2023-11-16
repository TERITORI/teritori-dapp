import React from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import emptySVG from "../../../../assets/icons/empty-list.svg";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId } from "../../../networks";
import { ipfsURLToHTTPURL, uploadFileToIPFS } from "../../../utils/ipfs";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import {
  additionalRed,
  neutral33,
  neutral77,
  neutralA3,
} from "../../../utils/style/colors";
import {
  fontSemibold14,
  fontSemibold16,
  fontSemibold20,
  fontSemibold28,
} from "../../../utils/style/fonts";
import { LocalFileData } from "../../../utils/types/files";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { FileUploader } from "../../fileUploader";
import { SellerInfo } from "../types/fields";

export const PersonalInfoPanel: React.FC<{
  seller: SellerInfo;
  setSeller: React.Dispatch<React.SetStateAction<SellerInfo>>;
}> = ({ seller, setSeller }) => {
  const selectedNetworkId = useSelectedNetworkId();
  const selectedWallet = useSelectedWallet();
  const userId = getUserId(selectedNetworkId, selectedWallet?.address);
  const { setToastError } = useFeedbacks();

  const onUserPictureChange = async (file: LocalFileData) => {
    if (file) {
      const uploadedFile = await uploadFileToIPFS(
        file,
        selectedNetworkId,
        userId
      );
      if (!uploadedFile) {
        setToastError({
          title: "File upload failed",
          message: "Fail to pin to IPFS, please try to Publish again",
        });
        return;
      }
      setSeller({ ...seller, avatar: uploadedFile?.url || "" });
    }
  };

  const onProfilePictureChange = async (file: LocalFileData) => {
    if (file) {
      const uploadedFile = await uploadFileToIPFS(
        file,
        selectedNetworkId,
        userId
      );
      if (!uploadedFile) {
        setToastError({
          title: "File upload failed",
          message: "Fail to pin to IPFS, please try to Publish again",
        });
        return;
      }
      setSeller({ ...seller, profilePicture: uploadedFile?.url || "" });
    }
  };

  return (
    <View style={{ flexDirection: "column" }}>
      <View style={{ flexDirection: "column" }}>
        <BrandText style={[fontSemibold28]}>Personal Info</BrandText>
        <BrandText
          style={[fontSemibold16, { color: neutral77, marginTop: 10 }]}
        >
          Tell us a bit about yourself. This information will appear on your
          public profile, so that potential buyers can get to know your better.
        </BrandText>
        <View style={styles.horizontalLine} />
      </View>
      <View style={{ flexDirection: "column" }}>
        <View style={{ flexDirection: "row" }}>
          <BrandText style={[fontSemibold20, { width: 200 }]}>
            Full Name
          </BrandText>
          <View style={{ flexGrow: 1, flexDirection: "row" }}>
            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
                  First Name
                </BrandText>
                <BrandText style={styles.important}>*</BrandText>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Type your first name here"
                value={seller.firstName}
                onChangeText={(text: string) => {
                  setSeller({ ...seller, firstName: text } as SellerInfo);
                }}
              />
            </View>
            <View style={{ flexDirection: "column", marginLeft: 15 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
                  Last Name
                </BrandText>
                <BrandText style={styles.important}>*</BrandText>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Type your last name here"
                value={seller.lastName}
                onChangeText={(text: string) => {
                  setSeller({ ...seller, lastName: text } as SellerInfo);
                }}
              />
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <BrandText style={[fontSemibold20, { width: 200 }]}>
            User Picture
          </BrandText>
          <View style={styles.picture}>
            <FileUploader
              onUpload={(files) => onUserPictureChange(files[0])}
              mimeTypes={IMAGE_MIME_TYPES}
            >
              {({ onPress }) => (
                <TouchableOpacity onPress={onPress}>
                  {!seller.avatar ? (
                    <SVG source={emptySVG} width="100%" height="100%" />
                  ) : (
                    <Image
                      source={{ uri: ipfsURLToHTTPURL(seller.avatar) }}
                      style={styles.picture}
                    />
                  )}
                </TouchableOpacity>
              )}
            </FileUploader>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <BrandText style={[fontSemibold20, { width: 200 }]}>
            Profile Picture
          </BrandText>
          <View style={styles.picture}>
            <FileUploader
              onUpload={(files) => onProfilePictureChange(files[0])}
              mimeTypes={IMAGE_MIME_TYPES}
            >
              {({ onPress }) => (
                <TouchableOpacity onPress={onPress}>
                  {!seller.profilePicture ? (
                    <SVG source={emptySVG} width="100%" height="100%" />
                  ) : (
                    <Image
                      source={{ uri: ipfsURLToHTTPURL(seller.profilePicture) }}
                      style={styles.picture}
                    />
                  )}
                </TouchableOpacity>
              )}
            </FileUploader>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <BrandText style={[fontSemibold20, { width: 200 }]}>
            Description
          </BrandText>
          <TextInput
            style={styles.textMultilineInput}
            placeholder={
              "Share a bit about your work experience, cool projects you've completed, and your area of expertise."
            }
            multiline
            value={seller.description}
            onChangeText={(text: string) => {
              setSeller({ ...seller, description: text } as SellerInfo);
            }}
          />
        </View>
      </View>
    </View>
  );
};
// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  horizontalLine: {
    width: "100%",
    height: 1,
    backgroundColor: neutral33,
    marginTop: 24,
    marginBottom: 24,
  },
  picture: {
    borderRadius: 12,
    borderColor: neutral33,
    borderWidth: 1,
    width: 242,
    height: 242,
  },
  textInput: StyleSheet.flatten([
    fontSemibold14,
    {
      marginTop: 15,
      borderColor: neutral33,
      borderRadius: 12,
      borderWidth: 1,
      width: 296,
      color: neutral77,
      paddingVertical: 16,
      paddingLeft: 16,
      outlineStyle: "none",
    },
  ]),
  textMultilineInput: StyleSheet.flatten([
    fontSemibold14,
    {
      borderColor: neutral33,
      borderRadius: 12,
      borderWidth: 1,
      width: 612,
      height: 144,
      color: neutral77,
      paddingVertical: 16,
      paddingLeft: 16,
      outlineStyle: "none",
    },
  ]),
  important: StyleSheet.flatten([
    fontSemibold14,
    {
      color: additionalRed,
    },
  ]),
});
