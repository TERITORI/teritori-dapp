import React, {useEffect, useState} from "react"
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
} from "react-native";

import { addWallet, StoreWallet } from "../store/slices/wallets";
import { useAppDispatch } from "../store/store";
import {
  neutral22,
  neutral33,
  neutral44,
  neutral77,
  pinkDefault,
  yellowDefault,
} from "../utils/colors";
import { addressToNetwork, Network } from "../utils/network";
import { WalletProvider } from "../utils/walletProvider";
import { BrandText } from "./BrandText";
import { NetworkIcon } from "./NetworkIcon";
import { useWallets, Wallet } from "../context/WalletsProvider";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { TertiaryButton } from "./buttons/TertiaryButton";
import ModalBase from "./modals/ModalBase"

const Separator: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[{ borderBottomWidth: 1, borderColor: neutral44 }, style]} />
);

const WalletActionButton: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  switch (wallet.provider) {
    case WalletProvider.Phantom:
      if (wallet.publicKey) {
        return (
          <TertiaryButton
            text={`Disconnect ${wallet.provider}`}
            onPress={async () => {
              if (wallet.provider === WalletProvider.Phantom) {
                try {
                  await (window as any)?.solana?.disconnect();
                } catch (err) {
                  console.warn("phantom failed to connect", err);
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
              }
            } catch (err) {
              console.warn("phantom failed to disconnect", err);
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
  console.log('wallets', wallets)
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

  useEffect(() => {
    console.log('addressValue', addressValue)
    console.log('addressNetwork', addressNetwork)
  }, [addressValue])

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
  onClose?: () => void
  visible?: boolean
}> = ({
  onClose, visible
}) => {
  return (
    <ModalBase label="Manage Connected Wallets" onClose={onClose} visible={visible} childrenBottom={
      <>
        <Separator />
        <AddNewWallet />
      </>
    }>
      <Wallets />
    </ModalBase>
  )

  {/* <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>*/}
      {/*<View*/}
      {/*  style={{*/}
      {/*    backgroundColor: neutral22,*/}
      {/*    borderWidth: 1,*/}
      {/*    borderColor: neutral33,*/}
      {/*    borderRadius: 8,*/}
      {/*    justifyContent: "space-between",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <View style={{ padding: 20 }}>*/}
      {/*    <View*/}
      {/*      style={{*/}
      {/*        flexDirection: "row",*/}
      {/*        justifyContent: "space-between",*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <BrandText style={{ fontSize: 20, color: "white" }}>*/}
      {/*        Manage Connected Wallets*/}
      {/*      </BrandText>*/}
      {/*      <TouchableOpacity onPress={onClose}>*/}
      {/*        <BrandText style={{ fontSize: 20, color: "white" }}>X</BrandText>*/}
      {/*      </TouchableOpacity>*/}
      {/*    </View>*/}
      {/*    <Separator style={{ marginTop: 20, marginBottom: 16 }} />*/}
      {/*    <Wallets />*/}
      {/*  </View>*/}
      {/*  <View>*/}
      {/*    <Separator />*/}
      {/*    <AddNewWallet />*/}
      {/*  </View>*/}
      {/*</View>*/}
    {/*</View>*/}
      //)
};
