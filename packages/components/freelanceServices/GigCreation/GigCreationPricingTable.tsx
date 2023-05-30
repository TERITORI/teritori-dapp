import React from "react";
import { View, StyleSheet, TextInput, TextProps } from "react-native";

import { deliveryTimeData } from "./GigBasedata";
import { GigPriceContentData } from "./GigPriceContentData";
import {
  GigInfo,
  PriceContentType,
} from "../../../screens/FreelanceServices/types/fields";
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
import { TableSelect } from "../../select/TableSelect";

const tableWidth = 909;
const borderWidth = 1;
const unitWidth = 226;

export const GigCreationPricingTable: React.FC<{
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
}> = ({ gigInfo, setGig }) => {
  const unitHeight = 38;

  const columnTitle = ["Basic", "Standard", "Premium"];

  return (
    <View style={[styles.tableContainer, { zIndex: 50 }]}>
      <View style={styles.columnContainer}>
        {gigInfo.basicPackage.contents.map((item, index) => (
          <NormalUnit
            text={item.title}
            title
            style={styles.rowTitle}
            key={index}
            first={index === 0 ? true : undefined}
          />
        ))}
        <NormalUnit text="Price" title style={styles.rowTitle} />
      </View>

      <View style={styles.columnContainer}>
        <NormalUnit text={columnTitle[0]} title style={styles.columnTitle} />
        <TableTextInput
          visibleUnit={false}
          placeHolder="Name your package"
          value={gigInfo.basicPackage.title}
          onChangeText={(v) => {
            setGig({
              ...gigInfo,
              basicPackage: { ...gigInfo.basicPackage, title: v },
            });
          }}
        />
        <TableTextInput
          visibleUnit={false}
          placeHolder="Describe the details of your offering"
          line={2}
          isMultiline
          value={gigInfo.basicPackage.desc}
          onChangeText={(v) => {
            setGig({
              ...gigInfo,
              basicPackage: { ...gigInfo.basicPackage, desc: v },
            });
          }}
        />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={deliveryTimeData}
          initValue="Delivery time"
          zIndex={3}
          value={gigInfo.basicPackage.deliveryTime}
          setValue={(v: string) => {
            setGig({
              ...gigInfo,
              basicPackage: { ...gigInfo.basicPackage, deliveryTime: v },
            });
          }}
        />
        <GigPriceContentData
          gigInfo={gigInfo}
          setGig={setGig}
          priceContentType={PriceContentType.basic}
        />

        <TableTextInput
          value={gigInfo.basicPackage.price}
          onChangeText={(v) => {
            setGig({
              ...gigInfo,
              basicPackage: { ...gigInfo.basicPackage, price: v },
            });
          }}
        />
      </View>
      <View style={styles.columnContainer}>
        <NormalUnit text={columnTitle[1]} title style={styles.columnTitle} />
        <TableTextInput
          visibleUnit={false}
          placeHolder="Name your package"
          value={gigInfo.standardPackage.title}
          onChangeText={(v) => {
            setGig({
              ...gigInfo,
              standardPackage: { ...gigInfo.standardPackage, title: v },
            });
          }}
        />
        <TableTextInput
          visibleUnit={false}
          placeHolder="Describe the details of your offering"
          line={2}
          isMultiline
          value={gigInfo.standardPackage.desc}
          onChangeText={(v) => {
            setGig({
              ...gigInfo,
              standardPackage: { ...gigInfo.standardPackage, desc: v },
            });
          }}
        />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={deliveryTimeData}
          initValue="Delivery time"
          zIndex={3}
          value={gigInfo.standardPackage.deliveryTime}
          setValue={(v: string) => {
            setGig({
              ...gigInfo,
              standardPackage: { ...gigInfo.standardPackage, deliveryTime: v },
            });
          }}
        />
        <GigPriceContentData
          gigInfo={gigInfo}
          setGig={setGig}
          priceContentType={PriceContentType.standard}
        />
        <TableTextInput
          value={gigInfo.standardPackage.price}
          onChangeText={(v) => {
            setGig({
              ...gigInfo,
              standardPackage: { ...gigInfo.standardPackage, price: v },
            });
          }}
        />
      </View>

      <View style={styles.columnContainer}>
        <NormalUnit text={columnTitle[2]} title style={styles.columnTitle} />
        <TableTextInput
          visibleUnit={false}
          placeHolder="Name your package"
          value={gigInfo.premiumPackage.title}
          onChangeText={(v) => {
            setGig({
              ...gigInfo,
              premiumPackage: { ...gigInfo.premiumPackage, title: v },
            });
          }}
        />
        <TableTextInput
          visibleUnit={false}
          placeHolder="Describe the details of your offering"
          line={2}
          isMultiline
          value={gigInfo.premiumPackage.desc}
          onChangeText={(v) => {
            setGig({
              ...gigInfo,
              premiumPackage: { ...gigInfo.premiumPackage, desc: v },
            });
          }}
        />
        <TableSelect
          width={unitWidth}
          height={unitHeight}
          data={deliveryTimeData}
          initValue="Delivery time"
          zIndex={3}
          value={gigInfo.premiumPackage.deliveryTime}
          setValue={(v: string) => {
            setGig({
              ...gigInfo,
              premiumPackage: { ...gigInfo.premiumPackage, deliveryTime: v },
            });
          }}
        />
        <GigPriceContentData
          gigInfo={gigInfo}
          setGig={setGig}
          priceContentType={PriceContentType.premium}
        />
        <TableTextInput
          value={gigInfo.premiumPackage.price}
          onChangeText={(v) => {
            setGig({
              ...gigInfo,
              premiumPackage: { ...gigInfo.premiumPackage, price: v },
            });
          }}
        />
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

type TableTextInputProps = {
  visibleUnit?: boolean;
  placeHolder?: string;
  line?: number;
  isMultiline?: boolean;
  value?: string;
  onChangeText: (v: string) => void;
};

const TableTextInput: React.FC<TableTextInputProps> = ({
  visibleUnit = true,
  placeHolder = "0",
  line = 1,
  isMultiline = false,
  value = "",
  onChangeText,
}) => {
  const unitHeight = 38;
  const lineHeight = 18;

  const styles = StyleSheet.create({
    inputContainer: {
      width: "100%",
      height: unitHeight + (line - 1) * lineHeight,
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
        style={[
          styles.inputBox,
          {
            outlineStyle: "none",
            height: line === 2 ? unitHeight + 10 : "",
          } as any,
        ]}
        placeholder={placeHolder}
        multiline={isMultiline}
        value={value}
        onChangeText={onChangeText}
      />
      {visibleUnit && <BrandText style={styles.inputText}>$</BrandText>}
    </View>
  );
};

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
  textInput: StyleSheet.flatten([
    fontSemibold14,
    {
      padding: layout.padding_x2,
      borderWidth: 1,
      borderColor: neutral33,
      color: secondaryColor,
      borderTopLeftRadius: layout.padding_x1_5,
      borderTopRightRadius: layout.padding_x1_5,
      borderBottomWidth: 0,
      outlineStyle: "none",
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
