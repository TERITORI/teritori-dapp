import React from "react";
import { View, StyleSheet, TextInput, TextProps } from "react-native";

import {
  neutral77,
  neutral33,
  secondaryColor,
  neutral00,
  neutral17,
  neutral55,
} from "../../../utils/style/colors";
import {
  fontMedium13,
  fontSemibold14,
  fontSemibold16,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { TableCheckBox } from "../../checkbox/TableCheckBox";
import { TableSelect } from "../../select/TableSelect";

export const GigCreationPricingTable: React.FC = () => {
  const tableWidth = 909;
  // const tableHeight = 524;
  const unitWidth = 226;
  const unitHeight = 38;
  const borderWidth = 1;

  const columnTitle = ["Basic", "Standard", "Premium"];
  const rowTitle = [
    "Number of pages/screens",
    "Custom asset design",
    "Responsive design",
    "Prototype",
    "Source file",
    "Content Upload",
    "Convert to HTML/CSS",
    "Revisions",
    "Price",
  ];
  const textData = [
    Array(3).fill("Name your packages"),
    Array(3).fill("Describe the details of your offerings"),
  ];
  const deliveryTimeData = [
    "delivery time 1",
    "delivery time 2",
    "delivery time 3",
    "delivery time 4",
  ];
  const pageScreenNumberData = ["1 - 5", "5 - 10", "11 - 15", "16 - 20"];
  const revisionsData = [
    "Revisions 1",
    "Revisions 2",
    "Revisions 3",
    "Revisions 4",
    "Revisions 5",
  ];
  const customAssetDesign = [
    "Custom Asset Design 1",
    "Custom Asset Design 2",
    "Custom Asset Design 3",
    "Custom Asset Design 4",
  ];

  const styles = StyleSheet.create({
    tableContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: tableWidth,
      marginTop: layout.padding_x2,
      borderColor: neutral33,
      backgroundColor: neutral33,
      borderWidth: 1,
      gap: borderWidth,
      zIndex: 1,
    },
    columnTitle: StyleSheet.flatten([
      fontSemibold16,
      {
        color: neutral77,
      },
    ]),
    rowTitle: StyleSheet.flatten([
      fontMedium13,
      {
        color: neutral77,
      },
    ]),
    normalText: StyleSheet.flatten([
      fontMedium13,
      {
        color: neutral55,
      },
    ]),
    columnContainer: {
      width: unitWidth,
      height: "100%",
      flexDirection: "column",
      gap: borderWidth,
    },
    columnDivideLine: {
      height: "100%",
      width: 1,
      backgroundColor: neutral33,
    },
    rowDivideLine: {
      width: "100%",
      height: 1,
      backgroundColor: neutral33,
    },
  });

  return (
    <View style={styles.tableContainer}>
      <View style={styles.columnContainer}>
        {rowTitle.map((item, index) => (
          <NormalUnit
            text={item}
            title
            style={styles.rowTitle}
            key={index}
            first={index === 0 ? true : undefined}
          />
        ))}
      </View>

      <View style={styles.columnContainer}>
        <NormalUnit text={columnTitle[0]} title style={styles.columnTitle} />
        <NormalUnit text={textData[0][0]} style={styles.normalText} />
        <NormalUnit text={textData[1][0]} style={styles.normalText} line={2} />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={deliveryTimeData}
          initValue="Delivery time"
          zIndex={3}
        />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={pageScreenNumberData}
          initValue="Select"
          zIndex={2}
        />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={customAssetDesign}
          initValue="Select"
          zIndex={1}
        />
        <TableCheckBox />
        <TableCheckBox />
        <TableCheckBox />
        <TableCheckBox />
        <TableCheckBox />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={revisionsData}
          initValue="Select"
          zIndex={1}
        />
        <TableTextInput />
      </View>

      <View style={styles.columnContainer}>
        <NormalUnit text={columnTitle[0]} title style={styles.columnTitle} />
        <NormalUnit text={textData[0][0]} style={styles.normalText} />
        <NormalUnit text={textData[1][0]} style={styles.normalText} line={2} />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={deliveryTimeData}
          initValue="Delivery time"
          zIndex={3}
        />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={pageScreenNumberData}
          initValue="Select"
          zIndex={2}
        />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={customAssetDesign}
          initValue="Select"
          zIndex={1}
        />
        <TableCheckBox />
        <TableCheckBox />
        <TableCheckBox />
        <TableCheckBox />
        <TableCheckBox />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={revisionsData}
          initValue="Select"
          zIndex={1}
        />
        <TableTextInput />
      </View>

      <View style={styles.columnContainer}>
        <NormalUnit text={columnTitle[0]} title style={styles.columnTitle} />
        <NormalUnit text={textData[0][0]} style={styles.normalText} />
        <NormalUnit text={textData[1][0]} style={styles.normalText} line={2} />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={deliveryTimeData}
          initValue="Delivery time"
          zIndex={3}
        />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={pageScreenNumberData}
          initValue="Select"
          zIndex={2}
        />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={customAssetDesign}
          initValue="Select"
          zIndex={1}
        />
        <TableCheckBox />
        <TableCheckBox />
        <TableCheckBox />
        <TableCheckBox />
        <TableCheckBox />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={revisionsData}
          initValue="Select"
          zIndex={1}
        />
        <TableTextInput />
      </View>
    </View>
  );
};

type NormalUnitProps = {
  text: string;
  title?: boolean;
  style: TextProps;
  line?: number;
  first?: boolean;
};

const NormalUnit: React.FC<NormalUnitProps> = ({
  text,
  title = false,
  style,
  line = 1,
  first = false,
}) => {
  const unitHeight = 38;
  const lineHeight = 18;
  const unitHorizontalPadding = 10;
  const borderWidth = 1;
  const firstRowTitleHeight = 5 * unitHeight + 4 * borderWidth + lineHeight;

  const styles = StyleSheet.create({
    alignLeftContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      height: first
        ? firstRowTitleHeight
        : unitHeight + (line - 1) * lineHeight,
      paddingTop: first ? firstRowTitleHeight - unitHeight : 0,
      paddingHorizontal: unitHorizontalPadding,
      backgroundColor: neutral00,
    },
    alignCenterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: unitHeight + (line - 1) * lineHeight,
      paddingHorizontal: unitHorizontalPadding,
      backgroundColor: neutral00,
    },
  });

  return (
    <View
      style={[
        styles.alignLeftContainer,
        { backgroundColor: title ? neutral17 : neutral00 },
      ]}
    >
      <BrandText style={style}>{text}</BrandText>
    </View>
  );
};

const TableTextInput: React.FC = () => {
  const unitHeight = 38;

  const styles = StyleSheet.create({
    inputContainer: {
      width: "100%",
      height: unitHeight,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: neutral00,
      paddingHorizontal: 10,
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
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.inputBox, { outlineStyle: "none" } as any]}
        placeholder="0"
      />
      <BrandText style={styles.inputText}>$</BrandText>
    </View>
  );
};
