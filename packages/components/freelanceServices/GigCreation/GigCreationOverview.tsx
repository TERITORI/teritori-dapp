import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import {
  categoryData,
  detailDataPlatformTool,
  detailDataWebsiteType,
  subcategoryData,
} from "./GigBasedata";
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
import { GigInfo } from "../types/fields";

const pageContentWidth = 908;
const rightBoxWidth = 612;
const leftBoxWidth = 250;
const gapWidth = 20;

export const GigCreationOverview: React.FC<{
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
}> = ({ gigInfo, setGig }) => {
  const [tab, setTab] = useState<string>("left");

  const [addTag, setAddTag] = useState<string>("");

  const updateWebsiteTypeCheckData = (item: string) => {
    const websiteTypeData = gigInfo.websiteType;
    const index = websiteTypeData.indexOf(item);
    if (index >= 0) {
      websiteTypeData.splice(index, 1);
    } else {
      if (getCheckedNumbers() >= 3) return;
      websiteTypeData.push(item);
    }
    setGig({ ...gigInfo, websiteType: websiteTypeData });
  };

  const updatePlatformToolCheckData = (item: string) => {
    const platformToolData = gigInfo.platformToolType;
    const index = platformToolData.indexOf(item);
    if (index >= 0) {
      platformToolData.splice(index, 1);
    } else {
      if (getCheckedNumbers() >= 3) return;
      platformToolData.push(item);
    }
    setGig({ ...gigInfo, platformToolType: platformToolData });
  };

  const getCheckedNumbers = (): number => {
    if (tab === "left") {
      return gigInfo.websiteType.length;
    } else {
      return gigInfo.platformToolType.length;
    }
  };

  const removeTag = (index: number) => {
    const targetData = gigInfo.positiveKeywords;

    targetData.splice(index, 1);
    setGig({ ...gigInfo, positiveKeywords: targetData });
  };

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
          value={gigInfo.title}
          onChangeText={(text: string) => {
            setGig({ ...gigInfo, title: text } as GigInfo);
          }}
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
              value={gigInfo.category}
              setValue={(category: string) => {
                setGig({ ...gigInfo, category });
              }}
              initValue="Select a category"
            />
            <GeneralSelect
              width={(rightBoxWidth - gapWidth) / 2}
              data={subcategoryData}
              value={gigInfo.subCategory}
              setValue={(subCategory: string) => {
                setGig({ ...gigInfo, subCategory });
              }}
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
              {tab === "left" &&
                detailDataWebsiteType.map((item: string, index: number) => (
                  <View style={styles.singleCheckBox} key={index}>
                    <CheckBox
                      value={gigInfo.websiteType.includes(item)}
                      onValueChange={() => updateWebsiteTypeCheckData(item)}
                    />
                    <BrandText style={styles.checkedText}>{item}</BrandText>
                  </View>
                ))}
              {tab === "right" &&
                detailDataPlatformTool.map((item: string, index: number) => (
                  <View style={styles.singleCheckBox} key={index}>
                    <CheckBox
                      value={gigInfo.platformToolType.includes(item)}
                      onValueChange={() => updatePlatformToolCheckData(item)}
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
          {gigInfo.positiveKeywords.map((item: string, index: number) => (
            <View style={styles.tagCard} key={index}>
              <BrandText style={[fontSemibold14]}>{item}</BrandText>
              <Pressable onPress={() => removeTag(index)}>
                <SVG
                  source={RemoveIcon}
                  width={layout.spacing_x2}
                  height={layout.spacing_x2}
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
              setGig({
                ...gigInfo,
                positiveKeywords: [...gigInfo.positiveKeywords, addTag],
              });
              setAddTag("");
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  oneLineBig: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: pageContentWidth,
    marginBottom: layout.spacing_x4,
  },
  oneLineSmall: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: layout.spacing_x1_5,
  },
  leftBox: {
    width: leftBoxWidth,
  },
  subTitle: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
      marginTop: layout.spacing_x1_5,
    },
  ]),
  rightBox: {
    width: rightBoxWidth,
    flexDirection: "column",
    gap: layout.spacing_x2_5,
  },
  selectBox: {
    width: "100%",
    flexDirection: "row",
    gap: layout.spacing_x2_5,
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
      padding: layout.spacing_x2,
      borderRadius: layout.spacing_x1_5,
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
    paddingVertical: layout.spacing_x0_5,
  },
  unselectedTabBox: {
    backgroundColor: neutral00,
    borderWidth: 1,
    borderColor: neutral33,
    paddingVertical: layout.spacing_x0_5,
  },
  leftTab: {
    paddingLeft: layout.spacing_x2,
    paddingRight: layout.spacing_x1_5,
    borderTopLeftRadius: layout.spacing_x1_5,
    borderBottomLeftRadius: layout.spacing_x1_5,
  },
  rightTab: {
    paddingRight: layout.spacing_x2,
    paddingLeft: layout.spacing_x1_5,
    borderTopEndRadius: layout.spacing_x1_5,
    borderBottomEndRadius: layout.spacing_x1_5,
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
    paddingTop: layout.spacing_x1_5,
  },
  singleCheckBox: {
    marginBottom: layout.spacing_x1_5,
    flexDirection: "row",
    alignItems: "center",
    width: `${100 / 3}%`,
    gap: layout.spacing_x1,
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
    gap: layout.spacing_x1_5,
  },
  tagCard: {
    padding: layout.spacing_x2,
    backgroundColor: neutral33,
    borderRadius: layout.spacing_x1_5,
    flexDirection: "row",
    alignItems: "center",
    gap: layout.spacing_x1,
  },
  addTag: {
    padding: layout.spacing_x2,
    borderColor: neutral33,
    borderWidth: 1,
    borderRadius: layout.spacing_x1_5,
  },
  textInput: StyleSheet.flatten([
    fontSemibold14,
    {
      color: secondaryColor,
      backgroundColor: neutral00,
      borderColor: neutral33,
      padding: layout.spacing_x2,
      width: 123,
      borderWidth: 1,
      borderRadius: layout.spacing_x1_5,
    },
  ]),
});
