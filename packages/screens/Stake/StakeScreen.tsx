import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import styled from "styled-components/native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Avatar } from "../../components/avatar";
import { SecondaryButtonOutline } from "../../components/buttons/SecondaryButtonOutline";
import { DivRow } from "../../components/div";
import { SpacerRow } from "../../components/spacer";
import {
  TableRowData,
  TableRowDataItem,
  TableRow,
  TableRowHeading,
} from "../../components/table";
import { TabItem, Tabs, useTabs } from "../../components/tabs/Tabs";
import { fontSemibold13, fontSemibold28 } from "../../utils/style/fonts";
import { genericStyles } from "../../utils/style/genericStyles";
import { TEMP_IMAGE } from "../../utils/variables";
import { StakeDetailModal } from "./components/StakeDetailModal";
import { StakeFormModal } from "./components/StakeFormModal";
import stakeData from "./stakeData.json";
import { StakeType } from "./types";

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

export const StakeScreen = () => {
  //   variables
  const { onPressTabItem, tabItems } = useTabs(mainInfoTabItems);
  const [stakeDetailModalVisible, setStakeDetailModalVisible] = useState(false);
  const [isStakeFormVisible, setIsStakeFormVisible] = useState(false);
  const [selectedStake, setSelectedStake] = useState<StakeType | undefined>();

  const customRowData = useMemo(
    (): TableRowDataItem[][] =>
      stakeData.map((d) => [
        ...Object.keys(d)
          .filter((f) =>
            ["rank", "name", "votingPower", "commission"].includes(f)
          )
          .map((k) => ({
            label: d[k as keyof typeof d],
            keyId: k,
            flex: TABLE_ROWS[k].flex,
            uid: d.rank,
          })),
        {
          label: "",
          keyId: "actions",
          flex: TABLE_ROWS.actions.flex,
          uid: d.rank,
        },
      ]),
    [stakeData]
  );

  // functions
  const toggleDetailModal = (stakeData?: StakeType) => {
    setStakeDetailModalVisible(!stakeDetailModalVisible);
    setSelectedStake(stakeData);
  };

  const toggleStakeForm = () => {
    setIsStakeFormVisible(!isStakeFormVisible);
    setStakeDetailModalVisible(false);
  };

  // returns
  const specialRender = useCallback((item: TableRowDataItem) => {
    switch (item.keyId) {
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
            <SecondaryButtonOutline
              onPress={() =>
                toggleDetailModal(stakeData.find((d) => d.rank === item.uid))
              }
              text="Manage"
              size="XS"
            />
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

      <StakeDetailModal
        visible={stakeDetailModalVisible}
        onClose={toggleDetailModal}
        data={selectedStake}
        onPressDelegate={toggleStakeForm}
      />

      <StakeFormModal
        visible={isStakeFormVisible}
        onClose={toggleStakeForm}
        data={selectedStake}
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
