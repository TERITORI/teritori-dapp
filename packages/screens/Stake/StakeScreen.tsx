import React, { useState } from "react";
import { View } from "react-native";

import { DelegateModal } from "./components/DelegateModal";
import { RedelegateModal } from "./components/RedelegateModal";
import { StakeDetailModal } from "./components/StakeDetailModal";
import { UndelegateModal } from "./components/UndelegateModal";
import { ValidatorsTable } from "./components/ValidatorsList";
import { ValidatorInfo } from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { Tabs } from "../../components/tabs/Tabs";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { useValidators } from "../../hooks/useValidators";
import { NetworkKind, UserKind, parseUserId } from "../../networks";
import { ScreenFC } from "../../utils/navigation";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const StakeScreen: ScreenFC<"Staking"> = ({ route: { params } }) => {
  const selectedWallet = useSelectedWallet();
  const isMobile = useIsMobile();
  let selectedNetworkId: string | undefined = useSelectedNetworkId();
  let userId = selectedWallet?.userId;
  const multisigId = params?.multisigId;
  const userKind = multisigId ? UserKind.Multisig : UserKind.Single;
  if (multisigId) {
    const [network] = parseUserId(multisigId);
    selectedNetworkId = network?.id;
    userId = multisigId;
  }

  const [stakeDetailModalVisible, setStakeDetailModalVisible] = useState(false);
  const [isStakeFormVisible, setIsStakeFormVisible] = useState(false);
  const [isUndelegateModalVisible, setIsUndelegateModalVisible] =
    useState(false);
  const [isRedelegateModalVisible, setIsRedelegateModalVisible] =
    useState(false);
  const [selectedStake, setSelectedStake] = useState<
    ValidatorInfo | undefined
  >();

  const {
    data: { activeValidators, inactiveValidators },
  } = useValidators(selectedNetworkId);

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

  return (
    <ScreenContainer
      headerChildren={<BrandText style={fontSemibold20}>Stake</BrandText>}
      responsive
      isLarge
      forceNetworkKind={NetworkKind.Cosmos}
      forceNetworkId={multisigId && selectedNetworkId}
    >
      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: layout.contentSpacing,
          marginBottom: layout.spacing_x2_5,
        }}
      >
        <BrandText style={fontSemibold28}>
          Stake{multisigId && " with Multisig"}
        </BrandText>
        <Tabs
          items={tabs}
          onSelect={setSelectedTab}
          selected={selectedTab}
          style={{ height: 60 }}
        />
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
        userId={userId}
        userKind={userKind}
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
        validator={selectedStake}
        userId={userId}
        userKind={userKind}
      />
      <RedelegateModal
        visible={isRedelegateModalVisible}
        onClose={toggleRedelegateModal}
        validator={selectedStake}
        userId={userId}
        userKind={userKind}
      />
      <DelegateModal
        visible={isStakeFormVisible}
        onClose={toggleStakeForm}
        validator={selectedStake}
        userId={userId}
        userKind={userKind}
      />
    </ScreenContainer>
  );
};
