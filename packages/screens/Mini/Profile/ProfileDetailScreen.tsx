import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";

import editProfileSVG from "../../../../assets/icons/input-edit.svg";
import profileSVG from "../../../../assets/icons/input-profile.svg";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import FileUpload from "../components/FileUpload";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { RootStackParamList } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

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

  const goBackTo = () =>
    navigation.replace("MiniChatSetting", { back: "MiniProfileDetail" });

  return (
    <BlurScreenContainer title="Profile" onGoBack={goBackTo}>
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
