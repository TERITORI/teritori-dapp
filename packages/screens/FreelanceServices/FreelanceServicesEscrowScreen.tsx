import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { EscrowInfo } from "../../api/freelance/v1/freelance";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { EscrowTable } from "../../components/freelanceServices/Escrow/EscrowList";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { mustGetFreelanceClient } from "../../utils/backend";
import { ScreenFC } from "../../utils/navigation";
import { fontSemibold28 } from "../../utils/style/fonts";
import {
  layout,
  screenContainerContentMarginHorizontal,
} from "../../utils/style/layout";

export const FreelanceServicesEscrowScreen: ScreenFC<
  "FreelanceServicesEscrow"
> = ({ route }) => {
  const [escrows, setEscrows] = useState<EscrowInfo[]>([]);
  const selectedWallet = useSelectedWallet();
  const networkId = useSelectedNetworkId();
  const marginStyle = {
    marginHorizontal: screenContainerContentMarginHorizontal,
  };

  useEffect(() => {
    if (!selectedWallet) return;
    const getEscrowsData = async () => {
      const freelanceClient = mustGetFreelanceClient(networkId);
      const res = await freelanceClient.EscrowAllList({
        address: selectedWallet.address,
      });
      setEscrows(res.escrows);
    };
    getEscrowsData();
  }, [selectedWallet, networkId]);

  return (
    <ScreenContainer fullWidth noMargin>
      <View style={[styles.container, marginStyle]}>
        <View style={styles.rowHeader}>
          <BrandText style={fontSemibold28}>Manage Escrow</BrandText>
        </View>
        <EscrowTable escrows={escrows} />
      </View>
    </ScreenContainer>
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
    marginBottom: layout.spacing_x2_5,
  },
  rowWithCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  upperCase: {
    textTransform: "uppercase",
  },
});
