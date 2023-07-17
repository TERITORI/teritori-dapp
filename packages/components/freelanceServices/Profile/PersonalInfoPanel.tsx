import React, { createRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

import emptySVG from "../../../../assets/icons/empty-list.svg";
import { SellerInfo } from "../../../screens/FreelanceServices/types/fields";
import { ipfsPinataUrl, uploadFileToIPFS } from "../../../utils/ipfs";
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
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";

export const PersonalInfoPanel: React.FC<{
  seller: SellerInfo;
  setSeller: React.Dispatch<React.SetStateAction<SellerInfo>>;
}> = ({ seller, setSeller }) => {
  const userPictureRef = createRef<HTMLInputElement>();
  const profilePictureRef = createRef<HTMLInputElement>();

  const uploadFile = async (file: File) => {
    const ipfsHash = await uploadFileToIPFS(file);
    return ipfsHash;
  };

  const onUserPictureChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target?.files?.[0];
    if (file) {
      uploadFile(file).then((ipfsHash) => {
        setSeller({ ...seller, avatar: ipfsHash });
      });
    }
  };

  const onProfilePictureChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target?.files?.[0];
    if (file) {
      uploadFile(file).then((ipfsHash) => {
        setSeller({ ...seller, profilePicture: ipfsHash });
      });
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
            <TouchableOpacity
              onPress={() => {
                userPictureRef.current?.click();
              }}
            >
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/png,image/jpg,image/gif"
                onChange={onUserPictureChange}
                ref={userPictureRef}
              />
              {seller.avatar === "" && (
                <SVG source={emptySVG} width="100%" height="100%" />
              )}
              {seller.avatar !== "" && (
                <Image
                  source={{ uri: ipfsPinataUrl(seller.avatar) }}
                  style={styles.picture}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <BrandText style={[fontSemibold20, { width: 200 }]}>
            Profile Picture
          </BrandText>
          <View style={styles.picture}>
            <TouchableOpacity
              onPress={() => {
                profilePictureRef.current?.click();
              }}
            >
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/png,image/jpg,image/gif"
                onChange={onProfilePictureChange}
                ref={profilePictureRef}
              />
              {seller.profilePicture === "" && (
                <SVG source={emptySVG} width="100%" height="100%" />
              )}
              {seller.profilePicture !== "" && (
                <Image
                  source={{ uri: ipfsPinataUrl(seller.profilePicture) }}
                  style={styles.picture}
                />
              )}
            </TouchableOpacity>
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
