import React, { FC, useState } from "react";
import { Linking, View } from "react-native";

import ModalBase from "./ModalBase";
import { Coin } from "../../api/teritori-chain/cosmos/base/v1beta1/coin";
import { useBalances } from "../../hooks/useBalances";
import { useSelectedNetworkInfo } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getCurrency, getNativeCurrency } from "../../networks";
import { DepositWithdrawModal } from "../../screens/WalletManager/components/DepositWithdrawModal";
import { prettyPrice } from "../../utils/coins";
import { neutral77 } from "../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { WalletStatusBox } from "../WalletStatusBox";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SeparatorGradient } from "../separators/SeparatorGradient";
import { SpacerColumn } from "../spacer";

interface DoSomethingButton {
  text: string;
  onPress: () => void;
}

export const NotEnoughFundsModal: FC<{
  cost?: Coin;
  label?: string;
  visible?: boolean;
  onClose?: () => void;
}> = ({ label = "Not enough funds", cost, visible, onClose }) => {
  const selectedWallet = useSelectedWallet();
  const selectedNetwork = useSelectedNetworkInfo();
  const balances = useBalances(selectedNetwork?.id, selectedWallet?.address);
  const costBalance = balances.find((bal) => bal.denom === cost?.denom);
  const currency = getCurrency(selectedNetwork?.id, cost?.denom);
  const nativeCurrency = getNativeCurrency(selectedNetwork?.id, cost?.denom);
  const [isDepositModalVisible, setDepositModalVisible] = useState(false);

  const doSomethingButtons: DoSomethingButton[] =
    currency?.kind === "ibc"
      ? [
          {
            text: `Deposit ${
              nativeCurrency ? nativeCurrency.displayName : "tokens"
            }`,
            onPress: () => setDepositModalVisible(true),
          },
        ]
      : [
          {
            text: "Add funds with card",
            onPress: () => Linking.openURL("https://app.kado.money/"),
          },
        ];

  return (
    <>
      {cost && isDepositModalVisible && selectedNetwork && (
        <DepositWithdrawModal
          variation="deposit"
          networkId={selectedNetwork.id}
          targetCurrency={cost.denom}
          onClose={() => setDepositModalVisible(false)}
          isVisible
        />
      )}

      <ModalBase visible={visible} onClose={onClose} width={480} label={label}>
        <WalletStatusBox />
        <SpacerColumn size={2} />
        <View>
          {cost && costBalance && selectedNetwork && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                  Transaction cost
                </BrandText>
                <BrandText style={fontSemibold14}>
                  {prettyPrice(selectedNetwork.id, cost.amount, cost.denom)}
                </BrandText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                  Balance
                </BrandText>
                <BrandText style={fontSemibold14}>
                  {prettyPrice(
                    selectedNetwork.id,
                    costBalance.amount,
                    costBalance.denom,
                  )}
                </BrandText>
              </View>

              <SpacerColumn size={2} />
              <SeparatorGradient />
              <SpacerColumn size={2} />
            </>
          )}
        </View>

        <BrandText style={fontSemibold20}>
          Do something to get{" "}
          {nativeCurrency ? nativeCurrency.displayName : "tokens"}
        </BrandText>
        <SpacerColumn size={2} />

        <View style={{ flex: 1, alignItems: "center" }}>
          {doSomethingButtons.map((item) => (
            <SecondaryButton
              key={item.text}
              text={item.text}
              onPress={item.onPress}
              size="XL"
              style={{
                marginBottom: layout.spacing_x2_5,
              }}
              fullWidth
            />
          ))}
        </View>
      </ModalBase>
    </>
  );
};
