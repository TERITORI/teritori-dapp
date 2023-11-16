import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { requirementFormData } from "./GigBasedata";
import DeleteIcon from "../../../../assets/icons/delete.svg";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { TertiaryButton } from "../../buttons/TertiaryButton";
import { CheckBox } from "../../checkbox/CheckBox";
import { GeneralSelect } from "../../select/GeneralSelect";
import { GigInfo, Question } from "../types/fields";

const pageContentWidth = 908;

export const GigCreationRequirement: React.FC<{
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
}> = ({ gigInfo, setGig }) => {
  const inputWidth = 297;

  const [enableAdd, setEnableAdd] = useState<boolean>(false);

  const [inputQuestion, setInputQuestion] = useState<Question>({
    required: false,
    questionForm: requirementFormData[0],
    question: "",
  });

  const deleteQuestion = (index: number) => {
    const target = gigInfo.questions;
    target.splice(index, 1);
    setGig({ ...gigInfo, questions: target });
  };

  const addQuestion = () => {
    if (inputQuestion.question.trim() === "") return;
    const target = gigInfo.questions;
    target.push(inputQuestion);
    setGig({ ...gigInfo, questions: target });
    setInputQuestion({
      question: "",
      questionForm: requirementFormData[0],
      required: false,
    });
    setEnableAdd(false);
  };
  return (
    <View style={styles.pageContent}>
      <BrandText>
        Get all the information you need from buyers to get started
      </BrandText>
      <BrandText style={[styles.text, { marginTop: layout.spacing_x2 }]}>
        Add questions to help buyers provide you with exactly what you need to
        start working on their order.
      </BrandText>
      {!enableAdd &&
        gigInfo.questions.map((item: Question, index: number) => (
          <View style={styles.questionCard} key={`questions-${index}`}>
            <View style={styles.oneLine}>
              <View style={styles.oneLine}>
                <BrandText style={styles.type}>{item.questionForm}</BrandText>
              </View>
              <Pressable onPress={() => deleteQuestion(index)}>
                <SVG source={DeleteIcon} width={16} height={16} />
              </Pressable>
            </View>
            <View style={[styles.oneLine, { marginTop: layout.spacing_x2 }]}>
              <BrandText style={styles.question}>{item.question}</BrandText>
            </View>
          </View>
        ))}
      {enableAdd && (
        <View>
          <View style={[styles.oneLine, { marginTop: layout.spacing_x4 }]}>
            <BrandText style={styles.subTitle}>Add a question</BrandText>
            <View style={styles.oneLine}>
              <CheckBox
                value={inputQuestion.required}
                onValueChange={() =>
                  setInputQuestion({
                    ...inputQuestion,
                    required: !inputQuestion.required,
                  })
                }
              />
              <BrandText
                style={[
                  fontMedium13,
                  { color: neutralA3, marginLeft: layout.spacing_x1 },
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
            value={inputQuestion.question}
            onChangeText={(value) =>
              setInputQuestion({ ...inputQuestion, question: value })
            }
          />

          <BrandText style={styles.subTitle}>Get it in a form of:</BrandText>
          <View style={[styles.oneLine, { zIndex: 1 }]}>
            <GeneralSelect
              width={inputWidth}
              data={requirementFormData}
              value={inputQuestion.questionForm}
              setValue={(value: string) =>
                setInputQuestion({ ...inputQuestion, questionForm: value })
              }
            />
            <View style={[styles.oneLine]}>
              <TertiaryButton
                size="XS"
                text="Cancel"
                style={{ marginRight: layout.spacing_x2 }}
                onPress={() => {
                  setInputQuestion({
                    question: "",
                    questionForm: requirementFormData[0],
                    required: false,
                  });
                  setEnableAdd(false);
                }}
              />
              <PrimaryButton size="XS" text="Add" onPress={addQuestion} />
            </View>
          </View>
        </View>
      )}
      <View
        style={[styles.divideLine, { marginVertical: layout.spacing_x3 }]}
      />
      {!enableAdd && (
        <Pressable
          onPress={() => {
            setEnableAdd(true);
          }}
        >
          <BrandText style={[fontSemibold14, { color: primaryColor }]}>
            + Add Question
          </BrandText>
        </Pressable>
      )}
    </View>
  );
};
// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  pageContent: {
    flexDirection: "column",
    width: pageContentWidth,
  },
  questionCard: {
    marginTop: layout.spacing_x2,
    borderRadius: layout.spacing_x1_5,
    paddingVertical: layout.spacing_x2,
    paddingHorizontal: layout.spacing_x1_5,
    borderWidth: 1,
    borderColor: neutral33,
    backgroundColor: neutral00,
  },
  type: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  question: StyleSheet.flatten([fontSemibold14]),
  text: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  subTitle: StyleSheet.flatten([
    fontSemibold14,
    {
      marginBottom: layout.spacing_x1_5,
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
      padding: layout.spacing_x2,
      borderWidth: 1,
      borderColor: neutral33,
      borderRadius: layout.spacing_x1_5,
      color: secondaryColor,
      marginBottom: layout.spacing_x2,
    },
  ]),
  divideLine: {
    height: 1,
    width: "100%",
    backgroundColor: neutral33,
  },
});
