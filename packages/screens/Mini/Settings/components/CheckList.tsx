import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import { CustomButton } from "./CustomButton";
import { Input } from "./Input";
import { RedAlert } from "./RedAlert";
import { BrandText } from "../../../../components/BrandText";
import { SpacerColumn } from "../../../../components/spacer";
import { neutral22, neutralA3 } from "../../../../utils/style/colors";
import { fontMedium16 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { Checkbox } from "../../Chat/components/Checkbox";

type Props = {
  gotoVisibleScreen: () => void;
  type: "seed-phrase" | "private-key";
};

export const CheckList = ({ gotoVisibleScreen, type }: Props) => {
  const [password, setPassword] = useState("");
  const [revealSeedsConditions, setRevealSeedsConditions] = useState({
    fullControlOverFunds: false,
    neverShare: false,
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
    !revealSeedsConditions.neverShare;
  return (
    <View
      style={{
        height: Dimensions.get("window").height - 150,
        marginTop: layout.spacing_x4,
        paddingHorizontal: layout.spacing_x2,
        position: "relative",
        justifyContent: "space-between",
      }}
    >
      <View>
        <RedAlert
          title="Approach with caution!"
          description={
            type === "seed-phrase"
              ? `You’re about to reveal your seed phrase. \nPlease carefully review the checklist below.`
              : `You’re about to reveal your private key.\nPlease carefully review the checklist below.`
          }
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
            {type === "seed-phrase"
              ? "Anyone with the phrase will have full control over my funds."
              : "Anyone with my private key will have full control over my funds."}
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
            isChecked={revealSeedsConditions.neverShare}
            onPress={() => toggleConditionsPress("neverShare")}
          />
          <BrandText style={[fontMedium16, { color: neutralA3, flex: 1 }]}>
            {type === "seed-phrase"
              ? "I will never share my seed phrase with anyone."
              : "I will never share my private key with anyone."}
          </BrandText>
        </View>
      </View>

      <CustomButton
        title="Next"
        onPress={onNextPress}
        isDisabled={isDisabled}
        style={{
          position: "absolute",
          bottom: 0,
          left: layout.spacing_x2,
          right: layout.spacing_x2,
          zIndex: 99,
        }}
      />
    </View>
  );
};
