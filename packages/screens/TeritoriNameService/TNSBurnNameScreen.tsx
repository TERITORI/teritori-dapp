import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import burnSVG from "../../../assets/icons/burn.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import ModalBase from "../../components/modals/ModalBase";
import { NameNFT } from "../../components/teritoriNameService/NameNFT";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { getNetwork } from "../../networks";
import { selectSelectedNetworkId } from "../../store/slices/settings";
import { defaultExecuteFee } from "../../utils/fee";
import {
  getFirstKeplrAccount,
  getSigningCosmWasmClient,
} from "../../utils/keplr";
import { defaultMemo } from "../../utils/memo";
import { neutral17 } from "../../utils/style/colors";
import { isTokenOwnedByUser } from "../../utils/tns";
import { TNSModalCommonProps } from "./TNSHomeScreen";

interface TNSBurnNameScreenProps extends TNSModalCommonProps {}

export const TNSBurnNameScreen: React.FC<TNSBurnNameScreenProps> = ({
  onClose,
}) => {
  const { name } = useTNS();
  const { setToastError, setToastSuccess } = useFeedbacks();

  const { tokens } = useTokenList();
  const isKeplrConnected = useIsKeplrConnected();
  const userHasCoWallet = useAreThereWallets();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const selectedNetwork = getNetwork(selectedNetworkId);
  const contractAddress = process.env
    .TERITORI_NAME_SERVICE_CONTRACT_ADDRESS as string;
  const normalizedTokenId = (name + process.env.TLD).toLowerCase();

  const onSubmit = async () => {
    if (!isKeplrConnected) {
      setToastError({
        title: "Please connect Keplr",
        message: "",
      });
      return;
    }
    if (
      tokens.length &&
      (!userHasCoWallet || !isTokenOwnedByUser(tokens, name))
    ) {
      setToastError({
        title: "Something went wrong!",
        message: "",
      });
      return;
    }

    const msg = {
      burn: {
        token_id: normalizedTokenId,
      },
    };
    try {
      const signingClient = await getSigningCosmWasmClient(selectedNetwork);

      const walletAddress = (await getFirstKeplrAccount(selectedNetwork))
        .address;

      const updatedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultExecuteFee,
        defaultMemo
      );
      if (updatedToken) {
        console.log(normalizedTokenId + " successfully burnt");
        setToastSuccess({
          title: normalizedTokenId + " successfully burnt",
          message: "",
        });

        onClose("TNSManage");
      }
    } catch (e) {
      if (e instanceof Error) {
        setToastError({
          title: "Something went wrong!",
          message: e.message,
        });
      }
      console.warn(e);
    }
  };

  return (
    <ModalBase
      hideMainSeparator
      onClose={() => onClose()}
      width={457}
      contentStyle={{
        backgroundColor: neutral17,
        borderRadius: 8,
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
              squaresBackgroundColor={neutral17}
              loader
            />
          </View>
        </View>
      </View>
    </ModalBase>
  );
};
