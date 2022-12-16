import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  selectIsKeplrConnected,
  selectSelectedNetworkId,
} from "../../../store/slices/settings";
import { decimalFromAtomics, prettyPrice } from "../../../utils/coins";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { WalletStatusCard } from "../../cards/WalletStatusCard";
import { ConnectKeplrButton } from "../../connectWallet/ConnectKeplrButton";
import ModalBase from "../ModalBase";

// Modal with price, fee,  Teritori wallet connexion and status and Payment button
export const TransactionPaymentModal: React.FC<{
  label: string;
  price?: string;
  priceDenom?: string;
  textComponent: JSX.Element;
  onPressProceed: () => void;
  onClose: () => void;
  visible?: boolean;
}> = ({
  label,
  price = "",
  priceDenom = "",
  textComponent,
  onPressProceed,
  onClose,
  visible = false,
}) => {
  const isKeplrConnected = useSelector(selectIsKeplrConnected);
  const selectedWallet = useSelectedWallet();
  const selectedNetworkId = useSelector(selectSelectedNetworkId);
  const balances = useBalances(selectedNetworkId, selectedWallet?.address);
  const balance = balances.find((bal) => bal.denom === priceDenom)?.amount;

  return (
    <ModalBase
      visible={visible}
      onClose={onClose}
      width={372}
      label={label}
      noBrokenCorners
    >
      <View>
        {/*==== Text*/}
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          {/*---- Could be some <BrandText> to explain the transaction like "You are about to purchase a xxxx NFT from the collection yyyy..." */}
          {textComponent}
        </View>

        {/*==== Teritori wallet*/}
        {isKeplrConnected ? <WalletStatusCard /> : <ConnectKeplrButton />}

        {/*==== Amounts*/}
        <View style={{ marginTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              Balance
            </BrandText>
            {/* TODO: Refresh totalString just after connect Keplr*/}
            <BrandText style={fontSemibold14}>
              {prettyPrice(selectedNetworkId, balance || "0", priceDenom)}
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
              You will pay
            </BrandText>
            <BrandText style={fontSemibold14}>
              {prettyPrice(selectedNetworkId, price, priceDenom)}
            </BrandText>
          </View>
        </View>

        <View
          style={{
            backgroundColor: neutral33,
            width: "100%",
            height: 1,
            marginBottom: 24,
            marginTop: 20,
          }}
        />
        {/*==== Buttons */}
        {
          // Can buy if only the funds are sufficient
          price &&
          decimalFromAtomics(
            selectedNetworkId,
            balance || "0",
            priceDenom
          ).isLessThan(
            decimalFromAtomics(selectedNetworkId, price, priceDenom)
          ) ? (
            <View style={{ alignItems: "center", width: "100%" }}>
              <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                Insufficient funds
              </BrandText>
            </View>
          ) : (
            <PrimaryButton
              onPress={onPressProceed}
              size="XS"
              text="Proceed to payment"
              fullWidth
              disabled={!isKeplrConnected}
            />
          )
        }
        <SecondaryButton
          size="XS"
          text="Cancel"
          fullWidth
          onPress={onClose}
          style={{ marginBottom: 24, marginTop: 16 }}
        />
      </View>
    </ModalBase>
  );
};
