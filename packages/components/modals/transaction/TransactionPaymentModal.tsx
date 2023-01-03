import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { useBalances } from "../../../hooks/useBalances";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import {
  selectIsKeplrConnected,
  selectIsMetamaskConnected,
} from "../../../store/slices/settings";
import { decimalFromAtomics, prettyPrice } from "../../../utils/coins";
import { Network } from "../../../utils/network";
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
  const isMetamaskConnected = useSelector(selectIsMetamaskConnected);
  const selectedWallet = useSelectedWallet();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkId = selectedNetworkInfo?.id || "";
  const balances = useBalances(selectedNetworkId, selectedWallet?.address);
  const balance =
    balances.find((bal) => bal.denom === priceDenom)?.amount || "0";

  // TODO: Should use nft id, but for now we can not get network id from nftInfo quickly
  // so we can assume that NFT is listed on the same network as it's nft
  const nftNetworkId = selectedNetworkId;

  let isWalletConnected = false;
  let WalletConnectComponent = null;

  switch (selectedNetworkInfo?.network) {
    case Network.Teritori:
      isWalletConnected = isKeplrConnected && !!selectedWallet?.address;
      WalletConnectComponent = ConnectKeplrButton;
      break;
    case Network.Ethereum:
      isWalletConnected = isMetamaskConnected && !!selectedWallet?.address;
      WalletConnectComponent = ConnectMetamaskButton;
      break;
  }

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
            decimalFromAtomics(nftNetworkId, price, priceDenom)
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
