import React, { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import styled from "styled-components/native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Avatar } from "../../components/avatar";
import { SecondaryButtonOutline } from "../../components/buttons/SecondaryButtonOutline";
import { DivRow } from "../../components/div";
import { SpacerRow } from "../../components/spacer";
import { TableRowData, TableRowDataItem } from "../../components/table";
import { TableRow, TableRowHeading } from "../../components/table/TableRow";
import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import { fontSemibold13, fontSemibold28 } from "../../utils/style/fonts";
import { genericStyles } from "../../utils/style/genericStyles";
import { TEMP_IMAGE } from "../../utils/variables";
import stackData from "./stackData.json";

const mainInfoTabItems: TabItem[] = [
  {
    label: "Active Validators",
    isSelected: true,
    badgeCount: 92,
  },
  {
    label: "Inactive Validators",
    isSelected: false,
    badgeCount: 217,
  },
];

const TABLE_ROWS: { [key in string]: TableRowHeading } = {
  rank: {
    label: "Rank",
    flex: 1,
  },
  name: {
    label: "Name",
    flex: 4,
  },
  votingPower: {
    label: "Voting Power",
    flex: 3,
  },
  commission: {
    label: "Commission",
    flex: 4,
  },
  actions: {
    label: "",
    flex: 2,
  },
};
// : TableRowDataItem[][]
export const StackScreen = () => {
  //   variables
  const { onPressTabItem, tabItems } = useTabs(mainInfoTabItems);

  const customRowData = useMemo(
    () =>
      stackData.map((d) => [
        ...Object.keys(d).map((k) => ({
          label: d[k as keyof typeof d],
          id: k,
          flex: TABLE_ROWS[k].flex,
        })),
        { label: "", id: "actions", flex: TABLE_ROWS.actions.flex },
      ]),
    [stackData]
  );

  // returns
  const specialRender = useCallback((item: TableRowDataItem) => {
    switch (item.id) {
      case "name":
        return (
          <View style={genericStyles.rowWithCenter}>
            <Avatar uri={TEMP_IMAGE} />
            <SpacerRow numberOfSpaces={0.25} />
            <BrandText style={fontSemibold13}>{item.label}</BrandText>
          </View>
        );

      case "actions":
        return (
          <View style={[genericStyles.selfEnd]}>
            <SecondaryButtonOutline text="Manage" size="XS" />
          </View>
        );

      default:
        return null;
    }
  }, []);

  return (
    <ScreenContainer>
      <RowHeader>
        <Heading>Stake</Heading>
        <DivRow>
          <Tabs onPressTabItem={onPressTabItem} items={tabItems} />
        </DivRow>
      </RowHeader>

      <TableRow headings={Object.values(TABLE_ROWS)} />

      <FlatList
        data={customRowData}
        renderItem={({ item }) => (
          <TableRowData data={item} specialRender={specialRender} />
        )}
      />
    </ScreenContainer>
  );
};

const RowHeader = styled.View(({ theme: { layout } }) => ({
  ...StyleSheet.flatten(genericStyles.rowWithCenterAndSB),
  paddingTop: layout.contentPadding,
  marginBottom: layout.padding * 0.625,
}));

const Heading = styled(BrandText)({
  ...(fontSemibold28 as object),
});
