import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import DeleteIcon from "../../../../assets/icons/delete.svg";
import DropIcon from "../../../../assets/icons/drop.svg";
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
import { Faq, GigInfo } from "../types/fields";

const pageContentWidth = 908;

export const GigCreationDescription: React.FC<{
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
}> = ({ gigInfo, setGig }) => {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [enableAdd, setEnableAdd] = useState<boolean>(false);
  const [dropDown, setDropDown] = useState<boolean[]>([]);

  const addFAQData = () => {
    if (!question || !answer) return;
    const targetData = gigInfo.faq;
    targetData.push({ question, answer });
    setGig({ ...gigInfo, faq: targetData });
    // setUpdatePageState((value) => !value);
    setAnswer("");
    setQuestion("");
  };

  const addFAQInput = () => {
    if (!question || !answer) setEnableAdd(true);
    addFAQData();
    setEnableAdd(true);
  };

  const dropDownFAQ = (index: number) => {
    if (gigInfo.faq.length === 0) return;

    const targetData = dropDown;
    targetData[index] = !targetData[index];
    setDropDown([...targetData]);
  };

  const deleteFAQ = (index: number) => {
    if (gigInfo.faq.length === 0) return;

    const targetData = gigInfo.faq;
    targetData.splice(index, 1);
    setGig({ ...gigInfo, faq: targetData });
  };

  return (
    <View style={styles.pageContent}>
      <BrandText>Description</BrandText>
      <BrandText style={[styles.text, { marginTop: layout.spacing_x2 }]}>
        Briefly Describe Your Gig
      </BrandText>
      <TextInput
        placeholder="Type here"
        placeholderTextColor={neutral77}
        style={[styles.descriptionInput, { outlineStyle: "none" } as any]}
        multiline
        numberOfLines={5}
        value={gigInfo.description}
        onChangeText={(value) => setGig({ ...gigInfo, description: value })}
      />

      <BrandText>Frequently Asked Questions</BrandText>
      <BrandText style={styles.subTitle}>
        Add Questions & Answers for Your Buyers.
      </BrandText>

      {gigInfo.faq.length === 0 && (
        <View style={{ flexDirection: "column", marginTop: layout.spacing_x2 }}>
          <TextInput
            placeholder="Type question"
            placeholderTextColor={neutral77}
            style={[styles.questionInput, { outlineStyle: "none" } as any]}
            value={question}
            onChangeText={(value) => setQuestion(value)}
          />
          <View style={styles.divideLine} />
          <TextInput
            placeholder="Type answer"
            placeholderTextColor={neutral77}
            style={[styles.answerInput, { outlineStyle: "none" } as any]}
            value={answer}
            onChangeText={(value) => setAnswer(value)}
          />
          <View style={styles.addFAQButtonGroup}>
            <TertiaryButton
              text="Cancel"
              size="XS"
              textColor={primaryColor}
              onPress={() => {
                setQuestion("");
                setAnswer("");
              }}
            />
            <PrimaryButton text="Add" size="XS" onPress={() => addFAQData()} />
          </View>
        </View>
      )}

      {gigInfo.faq.map((item: Faq, index: number) => (
        <View style={styles.faqCard} key={index}>
          <View style={styles.oneLine}>
            <View style={styles.oneLine}>
              <Pressable onPress={() => dropDownFAQ(index)}>
                <SVG source={DropIcon} width={16} height={16} />
              </Pressable>
              <BrandText
                style={[fontSemibold14, { marginLeft: layout.spacing_x1 }]}
              >
                Question {index + 1}
              </BrandText>
            </View>
            <Pressable onPress={() => deleteFAQ(index)}>
              <SVG source={DeleteIcon} width={16} height={16} />
            </Pressable>
          </View>

          {dropDown[index] && (
            <View style={styles.faqDetailContainer}>
              <BrandText style={styles.faqDetailText}>
                Question : {item.question}
              </BrandText>
              <BrandText style={styles.faqDetailText}>
                Answer : {item.answer}
              </BrandText>
            </View>
          )}
        </View>
      ))}

      <View
        style={[styles.divideLine, { marginVertical: layout.spacing_x2 }]}
      />
      <Pressable onPress={() => addFAQInput()}>
        <BrandText style={[fontSemibold14, { color: primaryColor }]}>
          + Add FAQ
        </BrandText>
      </Pressable>

      {gigInfo.faq.length > 0 && enableAdd && (
        <View style={{ flexDirection: "column", marginTop: layout.spacing_x2 }}>
          <TextInput
            placeholder="Type question"
            placeholderTextColor={neutral77}
            style={[styles.questionInput, { outlineStyle: "none" } as any]}
            value={question}
            onChangeText={(value) => setQuestion(value)}
          />
          <View style={styles.divideLine} />
          <TextInput
            placeholder="Type answer"
            placeholderTextColor={neutral77}
            style={[styles.answerInput, { outlineStyle: "none" } as any]}
            value={answer}
            onChangeText={(value) => setAnswer(value)}
          />
          <View style={styles.addFAQButtonGroup}>
            <TertiaryButton
              text="Cancel"
              size="XS"
              textColor={primaryColor}
              onPress={() => {
                setQuestion("");
                setAnswer("");
              }}
            />
            <PrimaryButton text="Add" size="XS" onPress={() => addFAQData()} />
          </View>
        </View>
      )}
    </View>
  );
};

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
      marginTop: layout.spacing_x3,
    },
  ]),
  descriptionInput: StyleSheet.flatten([
    fontSemibold14,
    {
      padding: layout.spacing_x2,
      borderWidth: 1,
      borderColor: neutral33,
      borderRadius: layout.spacing_x1_5,
      color: secondaryColor,
      marginTop: layout.spacing_x1_5,
      marginBottom: layout.spacing_x4,
    },
  ]),
  questionInput: StyleSheet.flatten([
    fontSemibold14,
    {
      padding: layout.spacing_x2,
      borderWidth: 1,
      borderColor: neutral33,
      color: secondaryColor,
      borderTopLeftRadius: layout.spacing_x1_5,
      borderTopRightRadius: layout.spacing_x1_5,
      borderBottomWidth: 0,
    },
  ]),
  divideLine: {
    height: 1,
    width: "100%",
    backgroundColor: neutral33,
  },
  answerInput: StyleSheet.flatten([
    fontSemibold14,
    {
      padding: layout.spacing_x2,
      borderWidth: 1,
      borderColor: neutral33,
      color: secondaryColor,
      borderBottomLeftRadius: layout.spacing_x1_5,
      borderBottomRightRadius: layout.spacing_x1_5,
      borderTopWidth: 0,
    },
  ]),
  addFAQButtonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: layout.spacing_x2,
    marginTop: layout.spacing_x1_5,
  },
  faqCard: {
    marginTop: layout.spacing_x2,
    borderRadius: layout.spacing_x1_5,
    paddingVertical: layout.spacing_x2,
    paddingHorizontal: layout.spacing_x1_5,
    borderWidth: 1,
    borderColor: neutral33,
    backgroundColor: neutral00,
  },
  oneLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqDetailContainer: {
    flexDirection: "column",
    gap: layout.spacing_x0_5,
    width: "100%",
    marginTop: layout.spacing_x2,
  },
  faqDetailText: StyleSheet.flatten([fontMedium13]),
});
