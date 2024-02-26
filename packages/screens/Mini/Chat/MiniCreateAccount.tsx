import { useState } from "react";
import { View } from "react-native";

import profileSVG from "../../../../assets/icons/input-profile.svg";
import { CustomButton } from "../components/Button/CustomButton";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import FileUpload from "../components/FileUpload";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { ScreenFC } from "@/utils/navigation";
import { neutral22 } from "@/utils/style/colors";
import { fontSemibold12 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { setMessageOnboardingComplete } from "@/weshnet/services";

export const MiniCreateAccount: ScreenFC<"MiniChatCreateAccount"> = ({
  navigation,
}) => {
  const [error, setError] = useState("");
  const [accountInfo, setAccountInfo] = useState({
    username: "",
    profileImage: "",
  });

  const handleAccountCreation = async () => {
    if (!accountInfo.profileImage) {
      setError("Please, provide the profile image.");
      return;
    }
    if (!accountInfo.username) {
      setError("Please, provid the username.");
      return;
    }

    await setMessageOnboardingComplete();
    navigation.navigate("MiniChats", {});
  };

  return (
    <BlurScreenContainer title="Create Account">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            padding: layout.spacing_x1_5,
            backgroundColor: neutral22,
            borderRadius: layout.borderRadius,
            alignSelf: "center",
          }}
        />
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
              accountInfo.profileImage
                ? accountInfo.profileImage
                : require("../../../../assets/default-images/profile.png")
            }
          />
          <SpacerColumn size={1.5} />
          <FileUpload
            label="Edit Photo"
            onUpload={(file) =>
              setAccountInfo({ ...accountInfo, profileImage: file?.uri ?? "" })
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
              value={accountInfo.username}
              onChangeText={(text) =>
                setAccountInfo({ ...accountInfo, username: text })
              }
              enableClearButton
              icon={profileSVG}
            />
            {error && (
              <>
                <SpacerColumn size={1} />
                <BrandText style={[fontSemibold12, { color: "red" }]}>
                  {error}
                </BrandText>
              </>
            )}
          </View>
          <View>
            <CustomButton
              title="Create Account"
              onPress={handleAccountCreation}
            />
            <SpacerColumn size={4} />
          </View>
        </View>
      </View>
    </BlurScreenContainer>
  );
};
