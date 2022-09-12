import { Window as KeplrWindow } from "@keplr-wallet/types";
import React, { useState } from "react";
import { ScrollView, View, ViewStyle, Text, StyleProp } from "react-native";

import { useWallets, Wallet } from "../context/WalletsProvider";
import { setIsKeplrConnected } from "../store/slices/settings";
import { addWallet, StoreWallet } from "../store/slices/wallets";
import { useAppDispatch } from "../store/store";
import { addressToNetwork, Network } from "../utils/network";
import {
  neutral22,
  neutral44,
  pinkDefault,
  yellowDefault,
} from "../utils/style/colors";
import { modalMarginPadding } from "../utils/style/modals";
import { keplrSuggestTeritori, teritoriChainId } from "../utils/teritori";
import { WalletProvider } from "../utils/walletProvider";
import { BrandText } from "./BrandText";
import { NetworkIcon } from "./NetworkIcon";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { TertiaryButton } from "./buttons/TertiaryButton";
import { TextInputCustom } from "./inputs/TextInputCustom";
import ModalBase from "./modals/ModalBase";

const Separator: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View
    style={[
      { borderBottomWidth: 1, borderColor: neutral44, width: "100%" },
      style,
    ]}
  />
);

export const WalletActionButton: React.FC<{
  wallet: Wallet;
  squaresBackgroundColor?: string;
  fullWidth?: boolean;
}> = ({ wallet, fullWidth = false, squaresBackgroundColor = neutral22 }) => {
  const tertiaryButtonProps = { fullWidth, squaresBackgroundColor };

  const dispatch = useAppDispatch();
  switch (wallet.provider) {
    case WalletProvider.Phantom:
    case WalletProvider.Keplr:
      if (wallet.publicKey) {
        // FIXME: no disconnect on keplr
        return (
          <TertiaryButton
            size="SM"
            text={`Disconnect ${wallet.provider}`}
            onPress={async () => {
              if (wallet.provider === WalletProvider.Phantom) {
                try {
                  await (window as any)?.solana?.disconnect();
                } catch (err) {
                  console.warn(wallet.provider, "failed to disconnect", err);
                }
              }
            }}
            {...tertiaryButtonProps}
          />
        );
      }
      return (
        <TertiaryButton
          size="SM"
          text={`Connect ${wallet.provider}`}
          onPress={async () => {
            try {
              if (wallet.provider === WalletProvider.Phantom) {
                console.log("Connecting to phantom");
                (window as any)?.solana?.connect();
              } else if (wallet.provider === WalletProvider.Keplr) {
                console.log("Connecting to keplr");
                const keplr = (window as KeplrWindow)?.keplr;
                if (!keplr) {
                  return;
                }
                await keplrSuggestTeritori(keplr);
                if (!teritoriChainId) {
                  console.error("missing chain id for teritori");
                  return;
                }
                await keplr.enable(teritoriChainId);
                dispatch(setIsKeplrConnected(true));
              }
            } catch (err) {
              console.warn(wallet.provider, "failed to connect", err);
            }
          }}
          {...tertiaryButtonProps}
        />
      );
    case WalletProvider.Store:
      return (
        <TertiaryButton text="Remove" size="SM" {...tertiaryButtonProps} />
      );
    default:
      return null;
  }
};

const networkColor = (net: Network) => {
  switch (net) {
    case Network.Solana:
      return yellowDefault;
    case Network.Teritori:
      return pinkDefault;
    default:
      return "white";
  }
};

const Wallets: React.FC = () => {
  const { wallets } = useWallets();
  return (
    <ScrollView style={{ height: 400 }}>
      {wallets.map((wallet) => {
        const pk = wallet.publicKey;
        return (
          <View key={wallet.id}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <BrandText
                style={{
                  fontSize: 12,
                  color: networkColor(wallet.network),
                  width: 100,
                  textTransform: "uppercase",
                }}
              >
                {wallet.network}
              </BrandText>
              {!!pk && (
                <>
                  <NetworkIcon network={wallet.network} circle size={24} />
                  <BrandText
                    style={{
                      fontSize: 14,
                      color: "white",
                      marginLeft: 8,
                    }}
                  >
                    {pk}
                  </BrandText>
                  {wallet.provider === WalletProvider.Store && (
                    <Text style={{ marginLeft: 8 }}>👁️</Text>
                  )}
                </>
              )}
              <View style={{ width: 161 }} />
              <View
                style={{
                  justifyContent: "flex-end",
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <WalletActionButton wallet={wallet} />
              </View>
            </View>
            <Separator style={{ marginVertical: 8 }} />
          </View>
        );
      })}
    </ScrollView>
  );
};

const AddNewWallet: React.FC = () => {
  const [addressValue, setAddressValue] = useState("");
  const addressNetwork = addressToNetwork(addressValue);
  const dispatch = useAppDispatch();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: modalMarginPadding,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInputCustom
          value={addressValue}
          onChangeText={setAddressValue}
          squaresBackgroundColor={neutral22}
          label="WALLET ADDRESS"
          placeHolder="Enter address here..."
        >
          <NetworkIcon network={addressNetwork} circle size={24} />
        </TextInputCustom>
      </View>
      <PrimaryButton
        squaresBackgroundColor={neutral22}
        size="M"
        text="Add New Wallet"
        style={{ marginLeft: 16 }}
        disabled={!addressNetwork}
        onPress={() => {
          if (!addressNetwork) {
            console.error("unknown address network");
            return;
          }
          const wallet: StoreWallet = {
            publicKey: addressValue,
            network: addressNetwork,
          };
          dispatch(addWallet(wallet));
          setAddressValue("");
        }}
      />
    </View>
  );
};

export const WalletsManager: React.FC<{
  onClose?: () => void;
  visible?: boolean;
}> = ({ onClose, visible }) => {
  return (
    <ModalBase
      label="Manage Connected Wallets"
      onClose={onClose}
      visible={visible}
      childrenBottom={
        <>
          <Separator />
          <AddNewWallet />
        </>
      }
    >
      <Wallets />
    </ModalBase>
  );
};
