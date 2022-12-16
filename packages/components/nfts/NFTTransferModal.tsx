import { bech32 } from "bech32";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { NFT } from "../../api/marketplace/v1/marketplace";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { TeritoriBunkerMinterQueryClient } from "../../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import { TeritoriNftClient } from "../../contracts-clients/teritori-nft/TeritoriNft.client";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getNetwork } from "../../networks";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
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
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const network = getNetwork(selectedNetworkId);
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

      // get contract address
      const contractAddress = nft.id.split("-")[1];

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

      // get nft contract address
      let nftContractAddress;
      if (
        contractAddress === process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS
      ) {
        nftContractAddress = contractAddress;
      } else {
        const comswasmClient = await getNonSigningCosmWasmClient();
        const bunkerClient = new TeritoriBunkerMinterQueryClient(
          comswasmClient,
          contractAddress
        );
        const config = await bunkerClient.config();
        nftContractAddress = config.nft_addr;
      }

      // create client
      const signingComswasmClient = await getSigningCosmWasmClient();
      const nftClient = new TeritoriNftClient(
        signingComswasmClient,
        sender,
        nftContractAddress
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
