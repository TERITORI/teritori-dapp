import React, { useCallback, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { RangeSlider } from "../../../components/RangeSlider";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import {
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";

export const ConfigureVotingSection = () => {
  // variables
  const [supportValue, setSupportValue] = useState(50);
  const [minApprovalValue, setMinApprovalValue] = useState(15);
  const [days, setDays] = useState<string>("1");
  const [hours, setHours] = useState<string>("0");
  const [minutes, setMinutes] = useState<string>("0");

  // functions
  const onSupportValueChange = (value: number) => {
    setSupportValue(Math.round(value));
  };

  const onMinApprovalValueChange = (value: number) => {
    setMinApprovalValue(Math.round(value));
  };

  // returns
  const DurationInput = useCallback(
    ({
      label,
      value,
      onChangeText,
    }: {
      label: string;
      onChangeText: (value: string) => void;
      value: string;
    }) => (
      <View style={styles.durationInputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[fontSemibold14, { color: secondaryColor, width: "100%" }]}
          defaultValue="0"
        />
        <BrandText style={styles.durationLabel}>{label}</BrandText>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <BrandText>Choose your voting settings below</BrandText>
      <SpacerColumn size={2.5} />
      <RangeSlider
        label="Support %"
        value={supportValue}
        onValueChange={onSupportValueChange}
      />
      <SpacerColumn size={2.5} />
      <RangeSlider
        label="Minimum Approval %"
        value={minApprovalValue}
        onValueChange={onMinApprovalValueChange}
      />
      <SpacerColumn size={2.5} />
      <BrandText style={styles.voteText}>Vote Duration</BrandText>
      <View style={styles.voteInputContainer}>
        <DurationInput label="Days" onChangeText={setDays} value={days} />
        <SpacerRow size={1.5} />
        <DurationInput label="Hours" onChangeText={setHours} value={hours} />
        <SpacerRow size={1.5} />
        <DurationInput
          label="Minutes"
          onChangeText={setMinutes}
          value={minutes}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: layout.contentPadding,
    paddingRight: layout.padding_x2_5,
  },
  voteText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  voteInputContainer: {
    flexDirection: "row",
    width: 550,
    marginTop: layout.padding_x1_5,
  },
  durationInputContainer: {
    padding: layout.padding_x2,
    borderWidth: 1,
    borderColor: neutral33,
    borderRadius: 12,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  durationLabel: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
});
