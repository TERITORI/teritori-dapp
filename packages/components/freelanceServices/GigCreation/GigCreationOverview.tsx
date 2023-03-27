import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";

import RemoveIcon from "../../../../assets/icons/remove.svg";
import {
  neutral00,
  neutral22,
  neutral33,
  neutral55,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { CheckBox } from "../../checkbox/CheckBox";
import { GeneralSelect } from "../../select/GeneralSelect";

export const GigCreationOverview: React.FC = () => {
  const pageContentWidth = 908;
  const rightBoxWidth = 612;
  const gapWidth = 20;
  const leftBoxWidth = 250;

  const categoryData = [
    "Digital Marketing",
    "Graphics & Design",
    "Writing & Translation",
    "Programming & Tech",
    "Music & Audio",
  ];
  const subcategoryData = [
    "Digital Marketing",
    "Graphics & Design",
    "Writing & Translation",
    "Programming & Tech",
    "Music & Audio",
  ];
  const detailData = [
    "E-commerce",
    "Educational",
    "Product pages",
    "Business promotion",
    "Stocks",
    "Marketing pages",
    "Blog",
    "Social networking",
    "Online magazines",
    "Portfolio",
    "News",
    "Other",
  ];
  const initDetailCheckData = [Array(12).fill(false), Array(12).fill(false)];
  const initTagData = ["Landing Page", "Product Design"];

  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubcategory] = useState<string>("");
  const [tab, setTab] = useState<string>("left");
  const [detailCheckData, setDetailCheckData] =
    useState<boolean[][]>(initDetailCheckData);
  const [tagData, setTagData] = useState<string[]>(initTagData);
  const [addTag, setAddTag] = useState<string>("");
  const [clickNumber, setClickNumber] = useState<number>(0);

  const styles = StyleSheet.create({
    oneLineBig: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: pageContentWidth,
      marginBottom: layout.padding_x4,
    },
    oneLineSmall: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginVertical: layout.padding_x1_5,
    },
    leftBox: {
      width: leftBoxWidth,
    },
    subTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral77,
        marginTop: layout.padding_x1_5,
      },
    ]),
    rightBox: {
      width: rightBoxWidth,
      flexDirection: "column",
      gap: layout.padding_x2_5,
    },
    selectBox: {
      width: "100%",
      flexDirection: "row",
      gap: layout.padding_x2_5,
      zIndex: 1,
    },
    fullTextInput: StyleSheet.flatten([
      fontSemibold14,
      {
        height: 66,
        color: secondaryColor,
        width: rightBoxWidth,
        backgroundColor: neutral00,
        borderWidth: 1,
        borderColor: neutral33,
        padding: layout.padding_x2,
        borderRadius: layout.padding_x1_5,
      },
    ]),
    detailInfo: {
      width: "100%",
      flexDirection: "column",
    },
    selectedTabTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral00,
      },
    ]),
    selectedTabBox: {
      backgroundColor: primaryColor,
      borderWidth: 1,
      borderColor: primaryColor,
      paddingVertical: layout.padding_x0_5,
    },
    unselectedTabBox: {
      backgroundColor: neutral00,
      borderWidth: 1,
      borderColor: neutral33,
      paddingVertical: layout.padding_x0_5,
    },
    leftTab: {
      paddingLeft: layout.padding_x2,
      paddingRight: layout.padding_x1_5,
      borderTopLeftRadius: layout.padding_x1_5,
      borderBottomLeftRadius: layout.padding_x1_5,
    },
    rightTab: {
      paddingRight: layout.padding_x2,
      paddingLeft: layout.padding_x1_5,
      borderTopEndRadius: layout.padding_x1_5,
      borderBottomEndRadius: layout.padding_x1_5,
    },
    unselectedTabTitle: StyleSheet.flatten([
      fontSemibold14,
      {
        color: secondaryColor,
      },
    ]),
    checkBoxGroup: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      borderWidth: 1,
      borderTopColor: neutral22,
      borderBottomColor: neutral22,
      paddingTop: layout.padding_x1_5,
    },
    singleCheckBox: {
      marginBottom: layout.padding_x1_5,
      flexDirection: "row",
      alignItems: "center",
      width: `${100 / 3}%`,
      gap: layout.padding_x1,
    },
    checkedText: StyleSheet.flatten([
      fontMedium13,
      {
        color: secondaryColor,
      },
    ]),
    uncheckedText: StyleSheet.flatten([
      fontMedium13,
      {
        color: neutralA3,
      },
    ]),
    tagGroup: {
      flexDirection: "row",
      width: rightBoxWidth,
      alignItems: "flex-start",
      gap: layout.padding_x1_5,
    },
    tagCard: {
      padding: layout.padding_x2,
      backgroundColor: neutral33,
      borderRadius: layout.padding_x1_5,
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x1,
    },
    addTag: {
      padding: layout.padding_x2,
      borderColor: neutral33,
      borderWidth: 1,
      borderRadius: layout.padding_x1_5,
    },
    textInput: StyleSheet.flatten([
      fontSemibold14,
      {
        color: secondaryColor,
        backgroundColor: neutral00,
        borderColor: neutral33,
        padding: layout.padding_x2,
        width: 123,
        borderWidth: 1,
        borderRadius: layout.padding_x1_5,
      },
    ]),
  });

  const updateDetailCheckData = (smallIndex: number) => {
    const bigIndex = tab === "left" ? 0 : 1;
    const targetData = detailCheckData;

    if (targetData[bigIndex][smallIndex])
      targetData[bigIndex][smallIndex] = false;
    else {
      if (getCheckedNumbers() >= 3) return;
      targetData[bigIndex][smallIndex] = true;
    }

    setDetailCheckData(targetData);
    setClickNumber((value) => value + 1);
  };

  const getCheckedNumbers = (): number => {
    if (tab === "left")
      return detailCheckData[0].filter((item) => item === true).length;
    else return detailCheckData[1].filter((item) => item === true).length;
  };

  const removeTag = (index: number) => {
    const targetData = tagData;

    targetData.splice(index, 1);
    setTagData(targetData);
    setClickNumber((value) => value + 1);
  };

  useEffect(() => {}, [clickNumber]);

  return (
    <View style={{ flexDirection: "column" }}>
      <View style={styles.oneLineBig}>
        <View style={styles.leftBox}>
          <BrandText>Gig title</BrandText>
          <BrandText style={styles.subTitle}>
            As your Gig storefront, your title is the most important place to
            include keywords that buyers would likely use to search for a
            service like yours.
          </BrandText>
        </View>
        <TextInput
          style={[styles.fullTextInput, { outlineStyle: "none" } as any]}
          multiline
          placeholder="I will do something I’m really good at"
          placeholderTextColor={neutral55}
        />
      </View>
      <View style={styles.oneLineBig}>
        <View style={styles.leftBox}>
          <BrandText>Category</BrandText>
          <BrandText style={styles.subTitle}>
            Choose the category and sub-category most suitable for your Gig.
          </BrandText>
        </View>
        <View style={styles.rightBox}>
          <View style={styles.selectBox}>
            <GeneralSelect
              width={(rightBoxWidth - gapWidth) / 2}
              data={categoryData}
              value={category}
              setValue={setCategory}
              initValue="Select a category"
            />
            <GeneralSelect
              width={(rightBoxWidth - gapWidth) / 2}
              data={subcategoryData}
              value={subCategory}
              setValue={setSubcategory}
              initValue="select a subcategory"
            />
          </View>
          <View style={styles.detailInfo}>
            <View style={styles.oneLineSmall}>
              <View style={{ flexDirection: "row" }}>
                <BrandText style={[fontSemibold14]} />
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                  {getCheckedNumbers()}/3
                </BrandText>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Pressable onPress={() => setTab("left")}>
                  <View
                    style={[
                      tab === "left"
                        ? styles.selectedTabBox
                        : styles.unselectedTabBox,
                      styles.leftTab,
                    ]}
                  >
                    <BrandText
                      style={
                        tab === "left"
                          ? styles.selectedTabTitle
                          : styles.unselectedTabTitle
                      }
                    >
                      Website type
                    </BrandText>
                  </View>
                </Pressable>
                <Pressable onPress={() => setTab("right")}>
                  <View
                    style={[
                      tab === "right"
                        ? styles.selectedTabBox
                        : styles.unselectedTabBox,
                      styles.rightTab,
                    ]}
                  >
                    <BrandText
                      style={
                        tab === "right"
                          ? styles.selectedTabTitle
                          : styles.unselectedTabTitle
                      }
                    >
                      Platform & Tool
                    </BrandText>
                  </View>
                </Pressable>
              </View>
            </View>
            <View style={styles.checkBoxGroup}>
              {detailData.map((item: string, index: number) => (
                <View style={styles.singleCheckBox} key={index}>
                  <CheckBox
                    value={
                      tab === "left"
                        ? detailCheckData[0][index]
                        : detailCheckData[1][index]
                    }
                    onValueChange={() => updateDetailCheckData(index)}
                  />
                  <BrandText style={styles.checkedText}>{item}</BrandText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.oneLineBig}>
        <View style={styles.leftBox}>
          <BrandText>Positive keywords</BrandText>
          <BrandText style={styles.subTitle}>
            Enter search terms your feel your buyers will use when looking for
            your service. 5 tags maximum.
          </BrandText>
        </View>
        <View style={styles.tagGroup}>
          {tagData.map((item: string, index: number) => (
            <View style={styles.tagCard} key={index}>
              <BrandText style={[fontSemibold14]}>{item}</BrandText>
              <Pressable onPress={() => removeTag(index)}>
                <SVG
                  source={RemoveIcon}
                  width={layout.padding_x2}
                  height={layout.padding_x2}
                />
              </Pressable>
            </View>
          ))}

          <TextInput
            style={[styles.textInput, { outlineStyle: "none" } as any]}
            placeholder="Type tag here"
            placeholderTextColor={neutral77}
            value={addTag}
            onChangeText={(value) => setAddTag(value)}
            onSubmitEditing={() => {
              setTagData([...tagData, addTag]);
              setAddTag("");
            }}
          />
        </View>
      </View>
    </View>
  );
};
