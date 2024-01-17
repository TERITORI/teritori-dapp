import React from "react";
import { useWindowDimensions, View } from "react-native";

import { BrandText } from "../../../../components/BrandText";
import { neutral77 } from "../../../../utils/style/colors";
import { fontMedium16, fontSemibold30 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/CustomButton";

type Props = {
  onComplete: () => void;
};
export const AllSet = ({ onComplete }: Props) => {
  const { width: windowWidth } = useWindowDimensions();
  const onPressStart = () => {
    onComplete();
  };
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: 80,
          flex: 1,
          paddingHorizontal: layout.spacing_x0_5,
        }}
      >
        <BrandText
          style={[
            fontSemibold30,
            {
              lineHeight: 36,
              marginBottom: layout.spacing_x1_5,
            },
          ]}
        >
          You're All Set!
        </BrandText>
        <BrandText
          style={[
            fontMedium16,
            {
              color: neutral77,
              lineHeight: 22,
            },
          ]}
        >
          Your Ledger account has been successfully added to Teritori. Now you
          can start exploring the app.
        </BrandText>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 30,
          left: 10,
          right: 10,
        }}
      >
        <CustomButton
          title="Start"
          onPress={onPressStart}
          width={windowWidth - 20}
          style={{}}
        />
      </View>
    </View>
  );
};
