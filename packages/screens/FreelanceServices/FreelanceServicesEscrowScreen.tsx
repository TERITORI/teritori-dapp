import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { FreelanceScreenBase } from "./FreelanceScreenBase";
import { EscrowInfo } from "../../api/freelance/v1/freelance";
import { BrandText } from "../../components/BrandText";
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
    <FreelanceScreenBase>
      <View
        style={[
          {
            flex: 1,
            backgroundColor: "#000000",
            flexDirection: "column",
          },
          marginStyle,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: layout.contentSpacing,
            marginBottom: layout.spacing_x2_5,
          }}
        >
          <BrandText style={fontSemibold28}>Manage Escrow</BrandText>
        </View>
        <EscrowTable escrows={escrows} />
      </View>
    </FreelanceScreenBase>
  );
};
