import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";

import { TNSModalCommonProps } from "./TNSHomeScreen";
import burnSVG from "../../../assets/icons/burn.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import ModalBase from "../../components/modals/ModalBase";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { TeritoriNameServiceClient } from "../../contracts-clients/teritori-name-service/TeritoriNameService.client";
import { nsNameInfoQueryKey } from "../../hooks/useNSNameInfo";
import { useNSTokensByOwner } from "../../hooks/useNSTokensByOwner";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  getKeplrSigningCosmWasmClient,
  mustGetCosmosNetwork,
} from "../../networks";
import { neutral17 } from "../../utils/style/colors";

interface TNSBurnNameScreenProps extends TNSModalCommonProps {}

export const TNSBurnNameScreen: React.FC<TNSBurnNameScreenProps> = ({
  onClose,
}) => {
  const { name } = useTNS();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const network = mustGetCosmosNetwork(selectedWallet?.networkId);
  const { tokens } = useNSTokensByOwner(selectedWallet?.userId);
  const walletAddress = selectedWallet?.address;
  const normalizedTokenId = (name + network.nameServiceTLD || "").toLowerCase();

  const queryClient = useQueryClient();

  const onSubmit = async () => {
    if (!walletAddress) {
      setToastError({
        title: "No wallet address",
        message: "",
      });
      return;
    }
    if (tokens.length && !tokens.includes(normalizedTokenId)) {
      setToastError({
        title: "Something went wrong!",
        message: "",
      });
      return;
    }

    try {
      if (!network.nameServiceContractAddress) {
        throw new Error("network not supported");
      }

      const signingClient = await getKeplrSigningCosmWasmClient(network.id);

      const nsClient = new TeritoriNameServiceClient(
        signingClient,
        walletAddress,
        network.nameServiceContractAddress,
      );

      await nsClient.burn({ tokenId: normalizedTokenId });

      console.log(normalizedTokenId + " successfully burnt");
      setToastSuccess({
        title: normalizedTokenId + " successfully burnt",
        message: "",
      });

      onClose("TNSManage");
    } catch (e) {
      if (e instanceof Error) {
        setToastError({
          title: "Something went wrong!",
          message: e.message,
        });
      }
      console.warn(e);
    }

    await queryClient.invalidateQueries(
      nsNameInfoQueryKey(selectedWallet?.networkId, normalizedTokenId),
    );
  };

  return (
    <ModalBase
      hideMainSeparator
      onClose={() => onClose()}
      width={457}
      boxStyle={{
        backgroundColor: neutral17,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <NameNFT name={name} />

        <View
          style={{
            marginTop: 20,
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View>
            <View
              style={{ flex: 1, alignItems: "center", flexDirection: "row" }}
            >
              <SVG
                width={32}
                height={32}
                source={burnSVG}
                style={{ marginRight: 16 }}
              />
              <BrandText style={{ fontSize: 32, lineHeight: 44 }}>
                Burn {name}
              </BrandText>
            </View>
            <BrandText
              style={{
                fontSize: 16,
                lineHeight: 20,
                color: "#A3A3A3",
                marginTop: 16,
                marginBottom: 20,
              }}
            >
              This will permanently destroy the token. The token will no longer
              be visible from the name service and another token with the same
              name will be mintable.
            </BrandText>
            <SecondaryButton
              fullWidth
              size="XS"
              text="I understand, burn it"
              onPress={onSubmit}
              style={{ marginBottom: 80 }}
              loader
            />
          </View>
        </View>
      </View>
    </ModalBase>
  );
};
