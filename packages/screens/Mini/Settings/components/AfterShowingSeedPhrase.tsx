import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import { Input } from "./Input";
import { RedAlert } from "./RedAlert";
import { BrandText } from "../../../../components/BrandText";
import { SpacerColumn } from "../../../../components/spacer";
import { neutral22, neutralA3 } from "../../../../utils/style/colors";
import { fontMedium16 } from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { Checkbox } from "../../Chat/components/Checkbox";

type Props = object;

export const AfterShowingSeedPhrase = ({}: Props) => {
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
    </View>
  );
};
