import React from "react";
import { View } from "react-native";

import faceIdSVG from "@/assets/icons/faceid.svg";
import ToggleButton from "../../../components/buttons/ToggleButton";
import ListView from "../components/ListView";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const FaceIdLoginScreen: ScreenFC<"MiniFaceLogin"> = ({ navigation }) => {
  const goBack = () => navigation.replace("MiniSettings");
  return (
    <BlurScreenContainer title="Log in with FaceID" onGoBack={goBack}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <SpacerColumn size={1} />
        <ListView
          options={{
            leftIconEnabled: true,
            leftIconOptions: { icon: faceIdSVG, iconSize: 24 },
            label: "Log in with a FaceID",
            iconEnabled: false,
            rightLabel: (
              <ToggleButton onValueChange={(value) => console.log(value)} />
            ),
          }}
        />
        <BrandText style={[fontMedium13, { color: neutral77 }]}>
          Enable this feature if you want to log in using FaceID.
        </BrandText>
      </View>
    </BlurScreenContainer>
  );
};

export default FaceIdLoginScreen;
