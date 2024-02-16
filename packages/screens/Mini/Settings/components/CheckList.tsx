import React, { Fragment, useState } from "react";
import { View } from "react-native";

import { RedAlert } from "./RedAlert";
import { CustomButton } from "../../components/Button/CustomButton";
import Checkbox from "../../components/Checkbox/Checkbox";
import MiniTextInput from "../../components/MiniTextInput";

import { SpacerColumn } from "@/components/spacer";
import { neutral22, neutralA3 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

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

  const checkboxes: {
    key: keyof typeof revealSeedsConditions;
    label: string;
    subLabel: string;
  }[] = [
    {
      key: "fullControlOverFunds",
      label: "Anyone with the phrase will have full control over my funds.",
      subLabel:
        "Anyone with my private key will have full control over my funds.",
    },
    {
      key: "neverShare",
      label: "I will never share my seed phrase with anyone.",
      subLabel: "I will never share my private key with anyone.",
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: layout.spacing_x2,
        position: "relative",
        justifyContent: "space-between",
      }}
    >
      <View>
        <SpacerColumn size={2} />
        <RedAlert
          title="Approach with caution!"
          description={
            type === "seed-phrase"
              ? `You’re about to reveal your seed phrase. \nPlease carefully review the checklist below.`
              : `You’re about to reveal your private key.\nPlease carefully review the checklist below.`
          }
        />
        <SpacerColumn size={1.5} />
        <MiniTextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View>
        {checkboxes.map((item) => {
          return (
            <Fragment key={item.key}>
              <SpacerColumn size={1} />

              <Checkbox
                isChecked={revealSeedsConditions?.[item.key]}
                onPress={(_, value) => {
                  const newValue = value as keyof typeof revealSeedsConditions;
                  toggleConditionsPress(newValue);
                }}
                value={item.key}
                label={type === "seed-phrase" ? item.label : item.subLabel}
                labelStyle={{ color: neutralA3, lineHeight: 22, flex: 1 }}
                type="circle"
                size="md"
                wrapperStyle={{
                  alignItems: "center",
                  borderRadius: layout.borderRadius,
                  backgroundColor: neutral22,
                  paddingVertical: layout.spacing_x1,
                  paddingHorizontal: layout.spacing_x2,
                }}
              />
            </Fragment>
          );
        })}

        <SpacerColumn size={2} />
        <CustomButton
          title="Next"
          onPress={onNextPress}
          isDisabled={isDisabled}
        />
      </View>
    </View>
  );
};
