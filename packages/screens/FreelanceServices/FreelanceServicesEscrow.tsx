import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { FreelanceServicesScreenWrapper } from "./FreelanceServicesScreenWrapper";
import { BrandText } from "../../components/BrandText";
import { EscrowTable } from "../../components/freelanceServices/Escrow/EscrowList";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { freelanceClient } from "../../utils/backend";
import { ScreenFC } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import {
  layout,
  screenContainerContentMarginHorizontal,
} from "../../utils/style/layout";
import { EscrowInfo } from "../../utils/types/freelance";

export const FreelanceServicesEscrow: ScreenFC<"FreelanceServicesEscrow"> = ({
  route,
}) => {
  const [escrows, setEscrows] = useState<EscrowInfo[]>([]);
  const selectedWallet = useSelectedWallet();
  const marginStyle = {
    marginHorizontal: screenContainerContentMarginHorizontal,
  };

  useEffect(() => {
    if (!selectedWallet) return;
    const getEscrowsData = async () => {
      const res = await freelanceClient.escrowAllList({
        address: selectedWallet.address,
      });
      setEscrows(res.escrows);
    };
    getEscrowsData();
  }, [selectedWallet]);

  return (
    <FreelanceServicesScreenWrapper>
      <View style={[styles.container, marginStyle]}>
        <View style={styles.rowHeader}>
          <BrandText style={fontSemibold28}>Manage Escrow</BrandText>
        </View>
        <EscrowTable escrows={escrows} />
      </View>
    </FreelanceServicesScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    flexDirection: "column",
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
