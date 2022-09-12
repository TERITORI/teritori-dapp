import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { useWallets } from "../../../context/WalletsProvider";
import { selectIsKeplrConnected } from "../../../store/slices/settings";
import { neutral33, neutral77 } from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { WalletProvider } from "../../../utils/walletProvider";
import { BrandText } from "../../BrandText";
import { WalletActionButton } from "../../WalletsManager";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { WalletStatusCard } from "../../cards/WalletStatusCard";
import ModalBase from "../ModalBase";

// Modal with price, fee,  Teritori wallet connexion and status and Payment button
export const TransactionPaymentModal: React.FC<{
  label: string;
  price: number;
  text: JSX.Element;
  onClose: () => void;
  visible?: boolean;
}> = ({ label, price, text, onClose, visible }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { wallets } = useWallets();
  const isKeplrConnected = useSelector(selectIsKeplrConnected);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  return (
    <ModalBase visible={isVisible} onClose={onClose} width={372} label={label}>
      <View>
        {/*==== Text*/}
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          {/*---- Could be some <BrandText> to explain the transaction like "You are about to purchase a xxxx NFT from the collection yyyy..." */}
          {text}
        </View>

        {/*==== Teritori wallet*/}
        {isKeplrConnected ? (
          <WalletStatusCard />
        ) : (
          <WalletActionButton
            fullWidth
            wallet={
              wallets.filter(
                (wallet) => wallet.provider === WalletProvider.Keplr
              )[0]
            }
            squaresBackgroundColor="#000000"
          />
        )}

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
            <BrandText style={fontSemibold14}>23.5875 TORI</BrandText>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <BrandText style={[fontSemibold14, { color: neutral77 }]}>
              Service fee 1%
            </BrandText>
            <BrandText style={fontSemibold14}>{price * 0.01} TORI</BrandText>
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
              {price + price * 0.01} TORI
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
        <PrimaryButton
          size="XS"
          text="Proceed to payment"
          fullWidth
          disabled={!isKeplrConnected}
        />
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
