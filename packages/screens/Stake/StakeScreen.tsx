import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Tabs } from "../../components/tabs/Tabs";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useValidators } from "../../hooks/useValidators";
import { fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { DelegateModal } from "./components/DelegateModal";
import { RedelegateModal } from "./components/RedelegateModal";
import { StakeDetailModal } from "./components/StakeDetailModal";
import { UndelegateModal } from "./components/UndelegateModal";
import { ValidatorsTable } from "./components/ValidatorsList";
import { ValidatorInfo } from "./types";

export const StakeScreen: React.FC = () => {
  //   variables
  const [stakeDetailModalVisible, setStakeDetailModalVisible] = useState(false);
  const [isStakeFormVisible, setIsStakeFormVisible] = useState(false);
  const [isUndelegateModalVisible, setIsUndelegateModalVisible] =
    useState(false);
  const [isRedelegateModalVisible, setIsRedelegateModalVisible] =
    useState(false);
  const [selectedStake, setSelectedStake] = useState<
    ValidatorInfo | undefined
  >();
  const { activeValidators, inactiveValidators } = useValidators();

  const tabs = {
    active: {
      name: "Active Validators",
      badgeCount: activeValidators.length,
    },
    inactive: {
      name: "Inactive Validators",
      badgeCount: inactiveValidators.length,
    },
  };
  const [selectedTab, setSelectedTab] = useState<keyof typeof tabs>("active");
  const areThereWallets = useAreThereWallets();

  // functions
  const toggleDetailModal = (stakeData?: ValidatorInfo) => {
    setStakeDetailModalVisible(!stakeDetailModalVisible);
    setSelectedStake(stakeData);
  };

  const toggleStakeForm = () => {
    setIsStakeFormVisible(!isStakeFormVisible);
    setStakeDetailModalVisible(false);
  };

  const toggleUndelegateModal = () => {
    setIsUndelegateModalVisible(!isUndelegateModalVisible);
    setStakeDetailModalVisible(false);
  };

  const toggleRedelegateModal = () => {
    setIsRedelegateModalVisible(!isRedelegateModalVisible);
    setStakeDetailModalVisible(false);
  };

  // returns
  return (
    <ScreenContainer>
      <View style={styles.rowHeader}>
        <BrandText style={fontSemibold28}>Stake</BrandText>
        <View style={styles.rowWithCenter}>
          <Tabs
            items={tabs}
            onSelect={setSelectedTab}
            style={{ height: 44 }}
            selected={selectedTab}
          />
        </View>
      </View>
      <ValidatorsTable
        validators={
          selectedTab === "active" ? activeValidators : inactiveValidators
        }
        actions={
          areThereWallets
            ? () => [{ label: "Manage", onPress: toggleDetailModal }]
            : undefined
        }
      />
      <StakeDetailModal
        visible={stakeDetailModalVisible}
        onClose={toggleDetailModal}
        data={selectedStake}
        onPressDelegate={toggleStakeForm}
        onPressUndelegate={toggleUndelegateModal}
        onPressRedelegate={toggleRedelegateModal}
      />
      <UndelegateModal
        visible={isUndelegateModalVisible}
        onClose={toggleUndelegateModal}
        data={selectedStake}
      />
      <RedelegateModal
        visible={isRedelegateModalVisible}
        onClose={toggleRedelegateModal}
        data={selectedStake}
      />
      <DelegateModal
        visible={isStakeFormVisible}
        onClose={toggleStakeForm}
        data={selectedStake}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: layout.contentPadding,
    marginBottom: layout.padding_x2_5,
  },
  rowWithCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  upperCase: {
    textTransform: "uppercase",
  },
});
