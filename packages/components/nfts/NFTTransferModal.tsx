import React from "react";
import { useForm } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { neutral77, secondaryColor } from "../../utils/style/colors";
import { fontSemibold12, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";
import { NFTTransferForm } from "./types";

interface NFTTransferModalProps {
  nft?: NFT;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (form: NFTTransferForm) => void;
}

export const NFTTransferModal: React.FC<NFTTransferModalProps> = ({
  isVisible,
  onClose,
  nft,
  onSubmit,
}) => {
  // variables
  const { handleSubmit, control } = useForm<NFTTransferForm>();

  // returns
  return (
    <ModalBase
      width={456}
      label="Transfer my NFT"
      visible={isVisible}
      onClose={onClose}
    >
      <View style={styles.detailContainer}>
        <Image source={{ uri: nft?.imageUri }} style={styles.image} />
        <SpacerColumn size={2} />
        <BrandText style={fontSemibold14}>{nft?.name}</BrandText>
        <SpacerColumn size={1.5} />
        <View style={styles.rowCenter}>
          <BrandText style={[fontSemibold12, { color: neutral77 }]}>
            {nft?.collectionName}
          </BrandText>
        </View>
      </View>

      <TextInputCustom<NFTTransferForm>
        control={control}
        variant="labelOutside"
        name="receiverAddress"
        label="Receiver Address"
        rules={{ required: true }}
        labelStyle={{ color: secondaryColor }}
      />
      <SpacerColumn size={2} />
      <BrandText style={styles.estimatedText}>
        Estimated Time: 20 Seconds
      </BrandText>
      <SpacerColumn size={1} />
      <PrimaryButton
        size="M"
        text="Transfer"
        fullWidth
        onPress={handleSubmit(onSubmit)}
      />
      <SpacerColumn size={2.5} />
    </ModalBase>
  );
};

const styles = StyleSheet.create({
  image: { height: 223, width: 223, borderRadius: 12 },
  detailContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: layout.padding_x4,
  },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  estimatedText: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutral77,
    },
  ]),
});
