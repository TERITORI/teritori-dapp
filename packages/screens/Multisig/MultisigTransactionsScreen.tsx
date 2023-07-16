import React from "react";

import { Transactions } from "./components/Transactions";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { NetworkKind } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";

export const MultisigTransactionsScreen: ScreenFC<"MultisigTransactions"> = ({
  route,
}) => {
  const navigation = useAppNavigation();
  const { address, walletName } = route.params;

  return (
    <ScreenContainer
      isHeaderSmallMargin
      headerChildren={
        <BrandText style={fontSemibold20}>Transactions</BrandText>
      }
      footerChildren={<></>}
      noMargin
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("MultisigWalletDashboard", {
              walletName,
              address,
            })
      }
      fullWidth
      noScroll
      forceNetworkKind={NetworkKind.Cosmos}
    >
      <Transactions multisigId={address} title={walletName} />
    </ScreenContainer>
  );
};
