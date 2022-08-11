import { Window as KeplrWindow } from "@keplr-wallet/types";
import React, { useState } from "react";
import { ScrollView, TextInput, View, ViewStyle, Text } from "react-native";

import { useWallets, Wallet } from "../context/WalletsProvider";
import { setIsKeplrConnected } from "../store/slices/settings";
import { addWallet, StoreWallet } from "../store/slices/wallets";
import { useAppDispatch } from "../store/store";
import {
  neutral33,
  neutral44,
  neutral77,
  pinkDefault,
  yellowDefault,
} from "../utils/style/colors";
import { addressToNetwork, Network } from "../utils/network";
import { keplrSuggestTeritori, teritoriChainId } from "../utils/teritori";
import { WalletProvider } from "../utils/walletProvider";
import { BrandText } from "./BrandText";
import { NetworkIcon } from "./NetworkIcon";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { TertiaryButton } from "./buttons/TertiaryButton";
import ModalBase from "./modals/ModalBase";

const Separator: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[{ borderBottomWidth: 1, borderColor: neutral44 }, style]} />
);

const WalletActionButton: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  const dispatch = useAppDispatch();
  switch (wallet.provider) {
    case WalletProvider.Phantom:
    case WalletProvider.Keplr:
      if (wallet.publicKey) {
        // FIXME: no disconnect on keplr
        return (
          <TertiaryButton
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
          />
        );
      }
      return (
        <TertiaryButton
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
                await keplr.enable(teritoriChainId);
                dispatch(setIsKeplrConnected(true));
              }
            } catch (err) {
              console.warn(wallet.provider, "failed to connect", err);
            }
          }}
        />
      );
    case WalletProvider.Store:
      return <TertiaryButton text="Remove" />;
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
        margin: 20,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          borderColor: neutral33,
          borderWidth: 1,
          borderRadius: 8,
          flex: 1,
          height: 48,
          paddingHorizontal: 12,
          justifyContent: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <BrandText
              style={{ color: neutral77, fontSize: 10, fontWeight: "500" }}
            >
              WALLET ADDRESS
            </BrandText>
            <TextInput
              placeholder="Enter address here..."
              value={addressValue}
              onChangeText={setAddressValue}
              placeholderTextColor="#999999"
              style={[
                {
                  fontSize: 14,
                  marginTop: 4,
                  color: "white",
                  fontFamily: "Exo_600SemiBold",
                },
                { outlineStyle: "none" } as any,
              ]}
            />
          </View>
          <NetworkIcon network={addressNetwork} circle size={24} />
        </View>
      </View>
      <PrimaryButton
        text="Add New Wallet"
        style={{ marginLeft: 16 }}
        disabled={!addressNetwork}
        onPress={() => {
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
