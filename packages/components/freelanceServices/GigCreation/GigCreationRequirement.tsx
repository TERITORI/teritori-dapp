import React, { useState } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";

import {
  neutral77,
  neutralA3,
  primaryColor,
  neutral33,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TertiaryButton } from "../../buttons/TertiaryButton";
import { CheckBox } from "../../checkbox/CheckBox";
import { GeneralSelect } from "../../select/GeneralSelect";

export const GigCreationRequirement: React.FC = () => {
  const pageContentWidth = 908;
  const inputWidth = 297;

  const textFormData: string[] = [
    "Free Text",
    "Text Form 1",
    "Text Form 2",
    "Text Form 3",
  ];

  const [required, setRequired] = useState<boolean>(false);
  const [textForm, setTextForm] = useState<string>("Free Text");

  const styles = StyleSheet.create({
    pageContent: {
      flexDirection: "column",
      width: pageContentWidth,
    },
    text: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutralA3,
      },
    ]),
    subTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        marginBottom: layout.padding_x1_5,
      },
    ]),
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    questionInput: StyleSheet.flatten([
      fontSemibold14,
      {
        padding: layout.padding_x2,
        borderWidth: 1,
        borderColor: neutral33,
        borderRadius: layout.padding_x1_5,
        color: secondaryColor,
        marginBottom: layout.padding_x2,
      },
    ]),
    divideLine: {
      height: 1,
      width: "100%",
      backgroundColor: neutral33,
    },
  });

  return (
    <View style={styles.pageContent}>
      <BrandText>
        Get all the information you need from buyers to get started
      </BrandText>
      <BrandText style={[styles.text, { marginTop: layout.padding_x2 }]}>
        Add questions to help buyers provide you with exactly what you need to
        start working on their order.
      </BrandText>

      <View style={[styles.oneLine, { marginTop: layout.padding_x4 }]}>
        <BrandText style={styles.subTitle}>Add a question</BrandText>
        <View style={styles.oneLine}>
          <CheckBox
            value={required}
            onValueChange={() => setRequired((value) => !value)}
          />
          <BrandText
            style={[
              fontMedium13,
              { color: neutralA3, marginLeft: layout.padding_x1 },
            ]}
          >
            Required
          </BrandText>
        </View>
      </View>

      <TextInput
        placeholder="Request necessary details such as dimensions, brand guidelines, and more."
        placeholderTextColor={neutral77}
        style={[styles.questionInput, { outlineStyle: "none" } as any]}
        multiline
        numberOfLines={5}
      />

      <BrandText style={styles.subTitle}>Get it in a form of:</BrandText>
      <View style={[styles.oneLine, { zIndex: 1 }]}>
        <GeneralSelect
          width={inputWidth}
          data={textFormData}
          value={textForm}
          setValue={setTextForm}
        />
        <View style={[styles.oneLine]}>
          <TertiaryButton
            size="XS"
            text="Cancel"
            style={{ marginRight: layout.padding_x2 }}
          />
          <PrimaryButton size="XS" text="Add" />
        </View>
      </View>

      <View
        style={[styles.divideLine, { marginVertical: layout.padding_x3 }]}
      />
      <Pressable>
        <BrandText style={[fontSemibold14, { color: primaryColor }]}>
          + Add Question
        </BrandText>
      </Pressable>
    </View>
  );
};
