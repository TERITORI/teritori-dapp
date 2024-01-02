import React from "react";
import { View } from "react-native";

import { useBalances } from "../../../hooks/useBalances";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { parseNetworkObjectId, NetworkKind } from "../../../networks";
import { decimalFromAtomics, prettyPrice } from "../../../utils/coins";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { WalletStatusCard } from "../../cards/WalletStatusCard";
import { ConnectKeplrButton } from "../../connectWallet/ConnectKeplrButton";
import { ConnectMetamaskButton } from "../../connectWallet/ConnectMetamaskButton";
import ModalBase from "../ModalBase";

// Modal with price, fee,  Teritori wallet connexion and status and Payment button
export const TransactionPaymentModal: React.FC<{
  label: string;
  nftId: string;
  price?: string;
  priceDenom?: string;
  textComponent: JSX.Element;
  onPressProceed: () => void;
  onClose: () => void;
  visible?: boolean;
}> = ({
  label,
  nftId,
  price = "",
  priceDenom = "",
  textComponent,
  onPressProceed,
  onClose,
  visible = false,
}) => {
  const selectedWallet = useSelectedWallet();
  const [nftNetwork] = parseNetworkObjectId(nftId);
  const nftNetworkId = nftNetwork?.id;
  const balances = useBalances(nftNetworkId, selectedWallet?.address);
  const balance =
    balances.find((bal) => bal.denom === priceDenom)?.amount || "0";
  const isWalletConnected = !!selectedWallet?.connected;

  let WalletConnectComponent = null;

  switch (nftNetwork?.kind) {
    case NetworkKind.Cosmos:
      WalletConnectComponent = ConnectKeplrButton;
      break;
    case NetworkKind.Ethereum:
      WalletConnectComponent = ConnectMetamaskButton;
      break;
  }

  return (
    <ModalBase visible={visible} onClose={onClose} width={372} label={label}>
      <View>
        {/*==== Text*/}
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          {/*---- Could be some <BrandText> to explain the transaction like "You are about to purchase a xxxx NFT from the collection yyyy..." */}
          {textComponent}
        </View>

        {isWalletConnected ? (
          <WalletStatusCard />
        ) : WalletConnectComponent ? (
          <WalletConnectComponent />
        ) : null}

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
              {prettyPrice(nftNetworkId, balance, priceDenom)}
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
              {prettyPrice(nftNetworkId, price, priceDenom)}
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
          decimalFromAtomics(nftNetworkId, balance, priceDenom).isLessThan(
            decimalFromAtomics(nftNetworkId, price, priceDenom),
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
              disabled={!isWalletConnected || !+balance}
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
