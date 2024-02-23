import React, { useState } from "react";
import { Alert, Linking, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

import openSVG from "../../../../assets/icons/open-blue.svg";
import penSVG from "../../../../assets/icons/pen-solid-gray.svg";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { resetWallet } from "@/hooks/wallet/getNativeWallet";
import { accountExplorerLink } from "@/networks";
import { ShowWalletQR } from "@/screens/Mini/Wallet/components/ShowWalletQR";
import { CustomButton } from "@/screens/Mini/components/Button/CustomButton";
import {
  removeWalletById,
  selectWalletById,
  updateWallet,
} from "@/store/slices/wallets";
import { RootState, useAppDispatch } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import {
  azureBlue,
  azureBlue20,
  neutral22,
  secondaryColor,
} from "@/utils/style/colors";
import { fontMedium16, fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const AccountDetailsScreen: ScreenFC<"MiniAccountDetails"> = ({
  navigation,
  route,
}) => {
  const navigateToProfile = () => navigation.replace("MiniProfile");
  const params = route.params;
  const [accountName, setAccountName] = useState(params.accountName);
  const wallet = useSelector((state: RootState) =>
    selectWalletById(state, params.id),
  );
  const dispatch = useAppDispatch();

  const onAccountNameChange = (text: string) => {
    if (wallet) {
      dispatch(updateWallet({ ...wallet, name: text }));
    }
    setAccountName(text || "");
  };

  const onResetPress = () => {
    if (wallet) {
      Alert.alert(
        "Are you sure?",
        "This action will remove the wallet from your device. If you didn't save the seed, this wallet will be lost forever! If you saved the seed, you will be able to import it back later.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => {
              resetWallet(wallet.index); // remove from storage
              dispatch(removeWalletById(wallet.index)); // remove from redux | app state
              navigation.navigate("NativeWallet"); // this one is here just in case the user don't have any more wallets
            },
            style: "destructive",
            isPreferred: true,
          },
        ],
      );
    }
  };

  return (
    <BlurScreenContainer title="Account Details" onGoBack={navigateToProfile}>
      <View
        style={{
          marginTop: layout.spacing_x3,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x2,
            backgroundColor: neutral22,
            borderRadius: 10,
            height: 50,
            paddingHorizontal: layout.spacing_x2,
            marginBottom: layout.spacing_x5,
          }}
        >
          <SVG source={penSVG} height={22} width={22} />
          <TextInput
            style={[fontMedium16, { flex: 1, color: secondaryColor }]}
            value={accountName || ""}
            onChangeText={onAccountNameChange}
            cursorColor={secondaryColor}
          />
        </View>
      </View>

      <ShowWalletQR selectedWallet={wallet} />

      <View
        style={{
          backgroundColor: azureBlue20,
          paddingHorizontal: layout.spacing_x2,
          paddingVertical: layout.spacing_x2,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: layout.borderRadius,
        }}
      >
        <BrandText style={[fontSemibold14, { color: azureBlue }]}>
          View on Explorer
        </BrandText>
        <CustomPressable
          onPress={() => {
            if (wallet) {
              Linking.openURL(
                accountExplorerLink(wallet.networkId, wallet.address),
              );
            }
          }}
        >
          <SVG source={openSVG} height={22} width={22} />
        </CustomPressable>
      </View>
      <CustomButton
        title="Delete"
        onPress={onResetPress}
        type="danger"
        style={{
          marginTop: layout.spacing_x1_5,
        }}
      />
    </BlurScreenContainer>
  );
};
