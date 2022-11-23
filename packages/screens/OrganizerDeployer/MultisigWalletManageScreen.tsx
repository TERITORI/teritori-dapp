import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { BackTo } from "../../components/navigation/BackTo";
import { SpacerColumn, SpacerRow } from "../../components/spacer";
import { TableRow, TableRowHeading } from "../../components/table";
import { useAppNavigation } from "../../utils/navigation";
import { neutral00, neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { MultisigWalletItem } from "./components/MultisigWalletItem";
import data from "./multisig-wallet.json";

export const MULTISIG_WALLET_HEADING: { [key in string]: TableRowHeading } = {
  id: {
    label: "#",
    flex: 1,
  },
  name: {
    label: "Wallet Name",
    flex: 3,
  },
  asset_type: {
    label: "Asset Type",
    flex: 3,
  },
  approval_required: {
    label: "Approvals Required",
    flex: 3,
  },
  actions: {
    label: "",
    flex: 2,
  },
};

export const MultisigWalletManageScreen = () => {
  // variables
  const navigation = useAppNavigation();

  // returns
  return (
    <ScreenContainer
      isHeaderSmallMargin
      headerChildren={<BackTo label="Manage Multisig Wallet" />}
      footerChildren={<></>}
      noMargin
      fullWidth
      noScroll
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.rowSB}>
            <BrandText style={fontSemibold20}>Wallet</BrandText>
            <SpacerRow size={1} />
            <BrandText style={[fontSemibold20, { color: neutral77 }]}>
              {data.length}
            </BrandText>
          </View>
          <View style={styles.rowSB}>
            <SecondaryButton text="Add existing Wallet" size="M" />
            <SpacerRow size={2} />
            <PrimaryButton text="Create Multisig Wallet" size="M" />
          </View>
        </View>
        <SpacerColumn size={2.5} />
        <TableRow
          headings={Object.values(MULTISIG_WALLET_HEADING)}
          showBrokenCorner
          style={styles.tableRow}
        />
        {data.map((wallet) => (
          <MultisigWalletItem
            data={wallet}
            key={wallet.id}
            onPressTransactions={() =>
              navigation.navigate("MultisigWalletTransaction")
            }
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: layout.contentPadding, paddingTop: 0 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: layout.padding_x1,
    borderColor: neutral33,
    borderBottomWidth: 1,
    width: "100%",
  },
  rowSB: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tableRow: {
    backgroundColor: neutral00,
    minHeight: 44,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
});
