import { bech32 } from "bech32";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { TeritoriNftClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getNetwork } from "../../networks";
import { getSigningCosmWasmClient } from "../../utils/keplr";
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

const network = getNetwork(process.env.TERITORI_NETWORK_ID);

export const NFTTransferModal: React.FC<NFTTransferModalProps> = ({
  isVisible,
  onClose,
  nft,
  onSubmit,
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const { handleSubmit: formHandleSubmit, control } =
    useForm<NFTTransferForm>();

  const handleSubmit: SubmitHandler<NFTTransferForm> = async (formValues) => {
    try {
      // check that it's a teritori nft
      if (!nft?.id.startsWith("tori-")) {
        setToastError({
          title: "Internal error",
          message: "Network not supported",
        });
        onClose();
        return;
      }

      // check for sender
      const sender = selectedWallet?.address;
      if (!sender) {
        setToastError({ title: "Internal error", message: "No sender" });
        onClose();
        return;
      }

      // get token id
      const tokenId = nft.id.split("-").slice(2).join("-");

      // check for network
      if (!network) {
        setToastError({ title: "Internal error", message: "No network" });
        onClose();
        return;
      }

      // validate address
      let address;
      try {
        address = bech32.decode(formValues.receiverAddress);
      } catch (err) {
        if (err instanceof Error) {
          setToastError({
            title: "Invalid address",
            message: err.message,
          });
        }
        onClose();
        return;
      }
      if (address.prefix !== network.addressPrefix) {
        setToastError({
          title: "Invalid address",
          message: "Bad prefix",
        });
        onClose();
      }

      // create client
      const signingComswasmClient = await getSigningCosmWasmClient();
      const nftClient = new TeritoriNftClient(
        signingComswasmClient,
        sender,
        nft.nftContractAddress
      );

      // transfer
      await nftClient.transferNft({
        recipient: formValues.receiverAddress,
        tokenId,
      });

      // signal success
      setToastSuccess({
        title: "NFT transfered",
        message: "",
      });
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setToastError({
          title: "Transfer failed",
          message: err.message,
        });
      }
    }
    onClose();
  };

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
        Estimated Time: 6 Seconds
      </BrandText>
      <SpacerColumn size={1} />
      <PrimaryButton
        size="M"
        text="Transfer"
        fullWidth
        loader
        onPress={formHandleSubmit(handleSubmit)}
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
