import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import { Input } from "./Input";
import { RedAlert } from "./RedAlert";
import { BrandText } from "../../../../components/BrandText";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { SpacerColumn } from "../../../../components/spacer";
import {
  blueDefault,
  neutral22,
  neutralA3,
} from "../../../../utils/style/colors";
import { fontMedium16, fontSemibold15 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { Checkbox } from "../../Chat/components/Checkbox";

type Props = {
  gotoVisibleScreen: () => void;
};

export const BeforeShowingSeedPhrase = ({ gotoVisibleScreen }: Props) => {
  const [password, setPassword] = useState("");
  const [revealSeedsConditions, setRevealSeedsConditions] = useState({
    fullControlOverFunds: false,
    neverSharePhrase: false,
  });

  const toggleConditionsPress = (key: keyof typeof revealSeedsConditions) => {
    setRevealSeedsConditions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const onNextPress = () => {
    gotoVisibleScreen();
  };
  const isDisabled =
    !password ||
    !revealSeedsConditions.fullControlOverFunds ||
    !revealSeedsConditions.neverSharePhrase;
  return (
    <View
      style={{
        height: Dimensions.get("window").height - 180,
        marginTop: layout.spacing_x4,
        paddingHorizontal: layout.spacing_x2,
        position: "relative",
        justifyContent: "space-between",
      }}
    >
      <View>
        <RedAlert
          title="Approach with caution!"
          description={`You’re about to reveal your seed phrase. \nPlease carefully review the checklist below.`}
        />
        <SpacerColumn size={1.5} />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={{ paddingBottom: 70 }}>
        <View
          style={{
            flexDirection: "row",
            gap: layout.spacing_x1_5,
            alignItems: "center",
            padding: layout.spacing_x1_5,
            borderRadius: layout.borderRadius,
            backgroundColor: neutral22,
            marginBottom: layout.spacing_x2_5,
          }}
        >
          <Checkbox
            isChecked={revealSeedsConditions.fullControlOverFunds}
            onPress={() => toggleConditionsPress("fullControlOverFunds")}
          />
          <BrandText style={[fontMedium16, { color: neutralA3, flex: 1 }]}>
            Anyone with the phrase will have full control over my funds.
          </BrandText>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: layout.spacing_x1_5,
            alignItems: "center",
            padding: layout.spacing_x1_5,
            borderRadius: layout.borderRadius,
            backgroundColor: neutral22,
          }}
        >
          <Checkbox
            isChecked={revealSeedsConditions.neverSharePhrase}
            onPress={() => toggleConditionsPress("neverSharePhrase")}
          />
          <BrandText style={[fontMedium16, { color: neutralA3, flex: 1 }]}>
            I will never share my seed phrase with anyone.
          </BrandText>
        </View>
      </View>

      <CustomPressable
        onPress={onNextPress}
        style={{
          backgroundColor: blueDefault,
          paddingVertical: layout.spacing_x1_5,
          borderRadius: 100,
          position: "absolute",
          bottom: 0,
          left: layout.spacing_x2,
          right: layout.spacing_x2,
          zIndex: 99,
          opacity: isDisabled ? 0.7 : 1,
        }}
        disabled={isDisabled}
      >
        <BrandText style={[fontSemibold15, { textAlign: "center" }]}>
          Next
        </BrandText>
      </CustomPressable>
    </View>
  );
};
