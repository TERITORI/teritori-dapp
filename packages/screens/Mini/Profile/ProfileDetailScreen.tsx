import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";

import closeSVG from "../../../../assets/icons/close.svg";
import editProfileSVG from "../../../../assets/icons/input-edit.svg";
import profileSVG from "../../../../assets/icons/input-profile.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../components/spacer";
import { RootStackParamList } from "../../../utils/navigation";
import { neutral77 } from "../../../utils/style/colors";
import { fontMedium14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import MiniHeader from "../Notifications/components/MiniHeader";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import FileUpload from "../components/FileUpload";
import MiniTextInput from "../components/MiniTextInput";

type ProfileDetailScreenProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "MiniProfileDetail"
  >;
};

export default function ProfileDetailScreen({
  navigation,
}: ProfileDetailScreenProps) {
  const [username, setUsername] = useState("John Doe");
  const [profileImage, setProfileImage] = useState("");

  const onClose = () =>
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.replace("MiniTabs");

  return (
    <BlurScreenContainer
      background="transparent"
      customHeader={
        <MiniHeader
          navigation={navigation}
          backEnabled
          title="Profile"
          headerStyle={{ backgroundColor: "transparent" }}
          right={
            <CustomPressable onPress={onClose}>
              <SVG source={closeSVG} width={24} height={24} />
            </CustomPressable>
          }
        />
      }
    >
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SpacerColumn size={1} />
        <CircularImgOrIcon
          enableFullIcon
          style={{ alignItems: "center", justifyContent: "center" }}
          icon={
            profileImage
              ? profileImage
              : require("../../../../assets/default-images/profile.png")
          }
        />
        <SpacerColumn size={1.5} />
        <FileUpload
          label="Edit Photo"
          onUpload={(file) => setProfileImage(file?.uri ?? "")}
        />
      </View>
      <View
        style={{
          justifyContent: "space-between",
          backgroundColor: "rgba(0,0,0,0.8)",
          height: "70%",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View>
          <SpacerColumn size={4} />
          <MiniTextInput
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
            enableClearButton
            icon={profileSVG}
          />

          <SpacerColumn size={1} />
          <MiniTextInput placeholder="About" icon={editProfileSVG} />

          <SpacerColumn size={1.5} />
          <BrandText style={[fontMedium14, { color: neutral77 }]}>
            Your profile is end-to-end encrypted. Your profile and changes to it
            will be visible to your contacts and when you start or accept new
            chats. <BrandText style={[fontMedium14]}>Learn more</BrandText>
          </BrandText>
        </View>
      </View>
    </BlurScreenContainer>
  );
}
