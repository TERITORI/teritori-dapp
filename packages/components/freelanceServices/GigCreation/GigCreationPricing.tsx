import React, { useState } from "react";
import { View, StyleSheet, Pressable, TextInput } from "react-native";

import {
  neutral77,
  neutralA3,
  primaryColor,
  neutral33,
  secondaryColor,
  neutral00,
  neutral22,
} from "../../../utils/style/colors";
import { fontSemibold13, fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { CheckBox } from "../../checkbox/CheckBox";
import { GeneralSelect } from "../../select/GeneralSelect";
import { GigCreationPricingTable } from "./GigCreationPricingTable";

export const GigCreationPricing: React.FC = () => {
  const pageContentWidth = 908;
  const inputWidth = 196;

  const selectData = [
    "Select 1",
    "Select 2",
    "Select 3",
    "Select 4",
    "Select 5",
  ];

  const [agreePolicy, setAgreePolicy] = useState<boolean>(false);
  const [additionalPages, setAdditionalPages] = useState<boolean>(false);
  const [extraFastDelivery, setExtraFastDelivery] = useState<boolean>(false);
  const [customAssetDesign, setCustomAssetDesign] = useState<boolean>(false);
  const [sourceFile, setSourceFile] = useState<boolean>(false);
  const [contentUpload, setContentUpload] = useState<boolean>(false);
  const [convert, setConvert] = useState<boolean>(false);
  const [additionalRevision, setAdditionalRevision] = useState<boolean>(false);
  const [basicExtra, setBasicExtra] = useState<string>("");
  const [standardExtra, setStandardExtra] = useState<string>("");
  const [premiumExtra, setPremiumExtra] = useState<string>("");
  const [selectPrototype, setSelectPrototype] = useState<string>("");

  const styles = StyleSheet.create({
    pageContent: {
      flexDirection: "column",
      width: pageContentWidth,
    },
    text: StyleSheet.flatten([
      fontSemibold13,
      {
        color: neutralA3,
      },
    ]),
    rowContainer: {
      flexDirection: "row",
      gap: layout.padding_x1_5,
      alignItems: "center",
    },
    oneLine: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: layout.padding_x1_5,
      height: 48,
    },
    divideLine: {
      width: "100%",
      height: 1,
      backgroundColor: neutral22,
      marginVertical: layout.padding_x1_5,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: layout.padding_x1,
      backgroundColor: neutral00,
      borderWidth: 1,
      borderColor: neutral33,
      padding: layout.padding_x2,
      borderRadius: layout.padding_x1_5,
    },
    inputBox: StyleSheet.flatten([
      fontSemibold14,
      {
        backgroundColor: neutral00,
        borderWidth: 0,
        color: secondaryColor,
      },
    ]),
    inputText: StyleSheet.flatten([
      fontSemibold14,
      {
        color: neutral77,
      },
    ]),
  });

  return (
    <View style={styles.pageContent}>
      <BrandText>Packages</BrandText>
      <GigCreationPricingTable />

      <BrandText style={{ marginVertical: layout.padding_x4 }}>
        Add extra services
      </BrandText>
      <View style={styles.oneLine}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={additionalPages}
            onValueChange={() => setAdditionalPages((value) => !value)}
          />
          <BrandText style={[fontSemibold14]}>Additional pages</BrandText>
        </View>
      </View>

      <View style={styles.divideLine} />

      <View style={styles.oneLine}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={extraFastDelivery}
            onValueChange={() => setExtraFastDelivery((value) => !value)}
          />
          <BrandText style={[fontSemibold14]}>Extra fast delivery</BrandText>
        </View>
      </View>
      <View style={[styles.oneLine, { zIndex: 3 }]}>
        <BrandText style={styles.text}>Basic</BrandText>
        <View style={styles.rowContainer}>
          <BrandText style={styles.text}>I'll deliver in only</BrandText>
          <GeneralSelect
            data={selectData}
            width={inputWidth}
            value={basicExtra}
            setValue={setBasicExtra}
            initValue="Select"
          />
          <BrandText style={styles.text}>for an extra</BrandText>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.inputBox, { outlineStyle: "none" } as any]}
              placeholder="0"
            />
            <BrandText style={styles.inputText}>$</BrandText>
          </View>
        </View>
      </View>
      <View style={[styles.oneLine, { zIndex: 2 }]}>
        <BrandText style={styles.text}>Standard</BrandText>
        <View style={styles.rowContainer}>
          <BrandText style={styles.text}>I'll deliver in only</BrandText>
          <GeneralSelect
            data={selectData}
            width={inputWidth}
            value={standardExtra}
            setValue={setStandardExtra}
            initValue="Select"
          />
          <BrandText style={styles.text}>for an extra</BrandText>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.inputBox, { outlineStyle: "none" } as any]}
              placeholder="0"
            />
            <BrandText style={styles.inputText}>$</BrandText>
          </View>
        </View>
      </View>
      <View style={[styles.oneLine, { zIndex: 1 }]}>
        <BrandText style={styles.text}>Premium</BrandText>
        <View style={styles.rowContainer}>
          <BrandText style={styles.text}>I'll deliver in only</BrandText>
          <GeneralSelect
            data={selectData}
            width={inputWidth}
            value={premiumExtra}
            setValue={setPremiumExtra}
            initValue="Select"
          />
          <BrandText style={styles.text}>for an extra</BrandText>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.inputBox, { outlineStyle: "none" } as any]}
              placeholder="0"
            />
            <BrandText style={styles.inputText}>$</BrandText>
          </View>
        </View>
      </View>

      <View style={styles.divideLine} />

      <View style={styles.oneLine}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={customAssetDesign}
            onValueChange={() => setCustomAssetDesign((value) => !value)}
          />
          <BrandText style={[fontSemibold14]}>
            Additional custom asset design
          </BrandText>
        </View>
      </View>

      <View style={styles.divideLine} />

      <View style={styles.oneLine}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={agreePolicy}
            onValueChange={() => setAgreePolicy((value) => !value)}
          />
          <BrandText style={[fontSemibold14]}>Prototype</BrandText>
        </View>
        <View style={styles.rowContainer}>
          <BrandText style={styles.text}>I'll deliver in only</BrandText>
          <GeneralSelect
            data={selectData}
            width={inputWidth}
            value={selectPrototype}
            setValue={setSelectPrototype}
            initValue="Select"
          />
          <BrandText style={styles.text}>+ additional</BrandText>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.inputBox, { outlineStyle: "none" } as any]}
              placeholder="0"
            />
            <BrandText style={styles.inputText}>$</BrandText>
          </View>
        </View>
      </View>

      <View style={styles.divideLine} />

      <View style={styles.oneLine}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={sourceFile}
            onValueChange={() => setSourceFile((value) => !value)}
          />
          <BrandText style={[fontSemibold14]}>Source file</BrandText>
        </View>
        <View style={styles.rowContainer}>
          <BrandText style={styles.text}>for an extra</BrandText>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.inputBox, { outlineStyle: "none" } as any]}
              placeholder="0"
            />
            <BrandText style={styles.inputText}>$</BrandText>
          </View>
        </View>
      </View>

      <View style={styles.divideLine} />

      <View style={styles.oneLine}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={contentUpload}
            onValueChange={() => setContentUpload((value) => !value)}
          />
          <BrandText style={[fontSemibold14]}>Content upload</BrandText>
        </View>
      </View>

      <View style={styles.divideLine} />

      <View style={styles.oneLine}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={convert}
            onValueChange={() => setConvert((value) => !value)}
          />
          <BrandText style={[fontSemibold14]}>Convert to HTML/CSS</BrandText>
        </View>
      </View>

      <View style={styles.divideLine} />

      <View style={styles.oneLine}>
        <View style={styles.rowContainer}>
          <CheckBox
            zoom={1.5}
            value={additionalRevision}
            onValueChange={() => setAdditionalRevision((value) => !value)}
          />
          <BrandText style={[fontSemibold14]}>Additional revision</BrandText>
        </View>
      </View>

      <View style={[styles.divideLine, { marginBottom: layout.padding_x3 }]} />

      <Pressable>
        <BrandText style={[fontSemibold14, { color: primaryColor }]}>
          + Add Question
        </BrandText>
      </Pressable>
    </View>
  );
};
