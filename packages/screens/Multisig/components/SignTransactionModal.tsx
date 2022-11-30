import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { BrandText } from "../../../components/BrandText";
import { Separator } from "../../../components/Separator";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SecondaryButton } from "../../../components/buttons/SecondaryButton";
import { WalletStatusCard } from "../../../components/cards/WalletStatusCard";
import { ConnectKeplrButton } from "../../../components/connectWallet/ConnectKeplrButton";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../components/spacer";
import { selectIsKeplrConnected } from "../../../store/slices/settings";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";

interface SignTransactionModalProps {
  isVisible: boolean;
  onConfirm?: () => void;
  onCancel: () => void;
}

export const SignTransactionModal: React.FC<SignTransactionModalProps> = ({
  isVisible,
  onCancel,
  onConfirm,
}) => {
  // variables
  const isKeplrConnected = useSelector(selectIsKeplrConnected);

  // returns
  return (
    <ModalBase
      label="Sign the transaction"
      visible={isVisible}
      width={372}
      onClose={onCancel}
    >
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        You're making the signature to validate a Multisig transaction
      </BrandText>
      <SpacerColumn size={2} />

      {isKeplrConnected ? <WalletStatusCard /> : <ConnectKeplrButton />}
      <SpacerColumn size={2.5} />

      <View style={styles.row}>
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Balance
        </BrandText>
        <BrandText style={fontSemibold14}>500 TORI</BrandText>
      </View>

      <SpacerColumn size={2.5} />
      <Separator />

      <SpacerColumn size={2.5} />
      <PrimaryButton
        size="SM"
        text="Confirm transaction"
        onPress={onConfirm}
        fullWidth
      />

      <SpacerColumn size={2.5} />
      <SecondaryButton size="SM" text="Cancel" onPress={onCancel} fullWidth />

      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
