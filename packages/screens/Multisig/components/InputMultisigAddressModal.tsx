import React, { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { layout } from "../../../utils/style/layout";
import ModalBase from "../../../components/modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { BrandText } from "../../../components/BrandText";
import { NetworkIcon } from "../../../components/NetworkIcon";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
interface InputMultisigAddressModalProps {
    isVisible: boolean;
    networkId: string;
    onClose?: () => void;
    onConfirm?: (walletName: string, address: string)=>void;
  }

export type AddressFormType = {
    address: string;
    wallet_name: string;
};

export const InputMultisigAddressModal: React.FC<InputMultisigAddressModalProps> = ({isVisible, networkId, onClose, onConfirm}) =>{
  const [multisigAddress, setMultisigAddress] = useState("");
  const [walletName, setWalletName] = useState("");

  const ModalHeader = useCallback(
    () => (
      <View style={styles.rowCenter}>
        <NetworkIcon networkId={networkId} size={32} />
        <SpacerRow size={3} />
        <BrandText>Input Multisig Address</BrandText>
      </View>
    ),
    [ networkId ]
  );

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      Header={ModalHeader}
      width={460}
    >
      <View style={styles.container}>
        <TextInputCustom<AddressFormType>
          variant="labelOutside"
          label="Wallet Name"
          name="wallet_name"
          rules={{ required: true }}
          placeHolder=""
          onChangeText={setWalletName}
          style={{marginBottom: 15}}
        />


        <TextInputCustom<AddressFormType>
            variant="labelOutside"
            label="Input Multisig Address"
            name="address"
            rules={{ required: true }}
            placeHolder=""
            onChangeText={setMultisigAddress}
          />

        <SpacerColumn size={4} />
        <PrimaryButton
          size="M"
          text="Use this Multisig"
          fullWidth
          disabled = { multisigAddress.trim() ==="" || walletName.trim() ==="" }
          onPress={()=>onConfirm!(walletName, multisigAddress)}
        />
      </View>
    </ModalBase>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: layout.padding_x3,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
});
