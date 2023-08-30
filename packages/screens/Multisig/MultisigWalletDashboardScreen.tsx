import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleProp, View, ViewStyle } from "react-native";
import { useSelector } from "react-redux";

import { MultisigFormInput } from "./components/MultisigFormInput";
import { MultisigRightSection } from "./components/MultisigRightSection";
import { MultisigSection } from "./components/MultisigSection";
import { MultisigLegacyFormType } from "./types";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { UserCard } from "../../components/dao/DAOMembers";
import { Transactions } from "../../components/multisig/Transactions";
import { SpacerColumn } from "../../components/spacer";
import { useMultisigClient } from "../../hooks/multisig/useMultisigClient";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  NetworkKind,
  getCosmosNetwork,
  getUserId,
  parseUserId,
} from "../../networks";
import { selectMultisigToken } from "../../store/slices/settings";
import { RootState } from "../../store/store";
import { validateAddress } from "../../utils/formRules";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { neutral33 } from "../../utils/style/colors";
import { fontSemibold20, fontSemibold28 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { Assets } from "../WalletManager/Assets";

export const MultisigWalletDashboardScreen: ScreenFC<
  "MultisigWalletDashboard"
> = ({ route }) => {
  const navigation = useAppNavigation();
  const { control } = useForm<MultisigLegacyFormType>();
  const { id } = route.params;
  const [network, multisigAddress] = parseUserId(id);
  const cosmosNetwork = getCosmosNetwork(network?.id);
  const userAddress = useSelectedWallet()?.selectedWallet?.address;
  const { multisig, isLoading } = useMultisigInfo(id);
  const walletName = multisig?.name;
  const membersAddress = multisig?.usersAddresses;

  // returns
  return (
    <ScreenContainer
      headerChildren={
        <BrandText style={fontSemibold20}>Dashboard {walletName}</BrandText>
      }
      onBackPress={() => navigation.navigate("Multisig")}
      footerChildren={<></>}
      noMargin
      fullWidth
      isHeaderSmallMargin
      forceNetworkId={network?.id}
    >
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          borderBottomWidth: 1,
          borderColor: neutral33,
          minHeight: 490,
        }}
        key={id}
      >
        <View
          style={{
            flex: 1,
            padding: layout.contentPadding,
            paddingTop: layout.topContentPaddingWithHeading,
          }}
        >
          <BrandText style={fontSemibold28}>General information</BrandText>
          <SpacerColumn size={2.5} />
          <MultisigSection title="Multisig Address">
            <MultisigFormInput<MultisigLegacyFormType>
              control={control}
              label=""
              hideLabel
              name="multisigAddress"
              rules={{ required: true, validate: validateAddress }}
              isCopiable
              isDisabled
              isOverrideDisabledBorder
              defaultValue={multisigAddress}
            />
          </MultisigSection>

          <MultisigSection
            isCollapsable
            title="Members"
            tresholdCurrentCount={
              multisig ? multisig?.threshold || 0 : undefined
            }
            tresholdMax={membersAddress ? membersAddress.length : undefined}
            isLoading={isLoading}
          >
            <MultisigMembers multisigId={id} />
          </MultisigSection>

          <MultisigSection title="Holdings & Assets" isCollapsable>
            <Assets userId={id} readOnly />
          </MultisigSection>
        </View>
        <MultisigRightSection />
      </View>

      <View
        style={{
          marginHorizontal: layout.contentPadding,
          marginTop: layout.topContentPaddingWithHeading,
        }}
      >
        <Transactions
          chainId={cosmosNetwork?.chainId}
          multisigAddress={multisigAddress}
          title="Transactions"
          userAddress={userAddress}
        />
      </View>
    </ScreenContainer>
  );
};

const MultisigMembers: React.FC<{
  multisigId: string | undefined;
  style?: StyleProp<ViewStyle>;
}> = ({ multisigId, style }) => {
  const [network] = parseUserId(multisigId);
  const [width, setWidth] = useState(0);
  const { multisig } = useMultisigInfo(multisigId);
  const members = multisig?.usersAddresses;
  if (!members || !network) {
    return null;
  }

  let elems = 3;
  if (width < 702) {
    elems = 1;
  } else if (width < 1365) {
    elems = 2;
  }

  return (
    <View
      style={style}
      onLayout={(ev) => setWidth(ev.nativeEvent.layout.width)}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <BrandText style={{ fontSize: 20 }}>{members.length} members</BrandText>
      </View>
      <View
        style={{ flexWrap: "wrap", flexDirection: "row", margin: -halfGap }}
      >
        {members.map((member) => {
          const userId = getUserId(network.id, member);
          return (
            <UserCard
              key={userId}
              userId={userId}
              style={{
                width: (width - (elems - 1) * 2 * halfGap) / elems,
                margin: halfGap,
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

const halfGap = 8;

export const useMultisigInfo = (id: string | undefined) => {
  const { selectedWallet } = useSelectedWallet();
  const authToken = useSelector((state: RootState) =>
    selectMultisigToken(state, selectedWallet?.address)
  );
  const client = useMultisigClient();
  const { data, ...other } = useQuery(
    ["multisig-info", id, authToken, client],
    async () => {
      if (!authToken) {
        return null;
      }
      const [network, multisigAddress] = parseUserId(id);
      if (network?.kind !== NetworkKind.Cosmos) {
        return null;
      }
      const { multisig } = await client?.MultisigInfo({
        authToken,
        multisigAddress,
        chainId: network.chainId,
      });
      return multisig;
    }
  );
  return { multisig: data, ...other };
};
