import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import editProfileSVG from "@/assets/icons/input-edit.svg";
import profileSVG from "@/assets/icons/input-profile.svg";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import FileUpload from "../components/FileUpload";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import downloadSVG from "@/assets/icons/download-white.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomButton } from "@/components/buttons/CustomButton";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { selectContactInfo, setContactInfo } from "@/store/slices/message";
import { RootStackParamList } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium14, fontSemibold16 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import {
  createSharableLink,
  exportAccount,
  handleRestoreAccount,
} from "@/weshnet/services";

type ProfileDetailScreenProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "MiniProfileDetail"
  >;
};

export default function ProfileDetailScreen({
  navigation,
}: ProfileDetailScreenProps) {
  const contactInfo = useSelector(selectContactInfo);
  const [values, setValues] = useState({
    name: contactInfo.name,
    avatar: contactInfo.avatar,
  });

  const dispatch = useDispatch();
  const { setToast } = useFeedbacks();

  const [isImportAccountLoading, setIsImportAccountLoading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const handleImportAccount = async () => {
    setIsImportAccountLoading(true);
    setToast({
      mode: "mini",
      showAlways: true,
      message: "Account Importing...",
      type: "loading",
      variant: "outline",
    });
    try {
      await handleRestoreAccount();

      setToast({
        mode: "mini",
        message: "Your account has been imported.",
        type: "success",
        variant: "outline",
      });
    } catch {
      setToast({
        mode: "mini",
        message: "Failed to import account. Try again later.",
        type: "error",
        variant: "outline",
      });
    }
    setIsImportAccountLoading(false);
  };

  const handleSave = () => {
    setToast({
      mode: "mini",
      showAlways: true,
      message: "Profile Updating...",
      type: "loading",
      variant: "outline",
    });

    const shareLink = createSharableLink({
      ...contactInfo,
      ...values,
    });
    dispatch(
      setContactInfo({
        shareLink,
        ...values,
      }),
    );
    setToast({
      mode: "mini",
      message: "Profile Updated Successfully.",
      type: "success",
      variant: "outline",
    });

    navigation.replace("MiniChatSetting", {});
  };

  const handleExport = async () => {
    setIsExportLoading(true);
    setToast({
      mode: "mini",
      showAlways: true,
      message: "Account Exporting...",
      type: "loading",
      variant: "outline",
    });
    try {
      await exportAccount();
      setToast({
        mode: "mini",
        message: "Account backup has completed!",
        type: "success",
        variant: "outline",
      });
    } catch (err) {
      console.error("Account backup failed", err);
      setToast({
        mode: "mini",
        message: "Failed to backup account",
        type: "error",
        variant: "outline",
      });
    }
    setIsExportLoading(false);
  };

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
            values.avatar
              ? values.avatar
              : require("@/assets/default-images/profile.png")
          }
        />
        <SpacerColumn size={1.5} />
        <FileUpload
          label="Edit Photo"
          onUpload={(file) =>
            setValues((prev) => ({ ...prev, avatar: file?.uri ?? "" }))
          }
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
            value={values.name}
            onChangeText={(text) =>
              setValues((prev) => ({ ...prev, name: text }))
            }
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

        <View>
          <CustomButton onPress={() => handleSave()} title="Update Profile" />
          <SpacerColumn size={1.5} />

          <View style={{ flexDirection: "row", gap: layout.spacing_x1_5 }}>
            <CustomButton
              onPress={() => handleImportAccount()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
              type="outline"
              isDisabled={isImportAccountLoading}
            >
              <SVG height={16} width={16} source={downloadSVG} color="#fff" />
              <SpacerRow size={1} />
              <BrandText style={[fontSemibold16]}>Import Account</BrandText>
            </CustomButton>
            <CustomButton
              isDisabled={isExportLoading}
              style={{ flex: 1 }}
              onPress={() => handleExport()}
              title="Backup Account"
              type="outline"
            />
          </View>
        </View>
      </View>
    </BlurScreenContainer>
  );
}
