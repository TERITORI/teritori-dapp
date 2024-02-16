import React, { useState } from "react";
import { Alert, Linking, TextInput, View } from "react-native";

import openSVG from "../../../../assets/icons/open-blue.svg";
import penSVG from "../../../../assets/icons/pen-solid-gray.svg";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { resetWallet } from "@/hooks/wallet/getNativeWallet";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { accountExplorerLink } from "@/networks";
import { ShowWalletQR } from "@/screens/Mini/Wallet/components/ShowWalletQR";
import { CustomButton } from "@/screens/Mini/components/Button/CustomButton";
import { removeWalletById, updateWallet } from "@/store/slices/wallets";
import { useAppDispatch } from "@/store/store";
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
  const selectedWallet = useSelectedNativeWallet();
  const dispatch = useAppDispatch();

  const onAccountNameChange = (text: string) => {
    if (selectedWallet) {
      dispatch(updateWallet({ ...selectedWallet, name: text }));
    }
    setAccountName(text || "");
  };

  const onResetPress = () => {
    if (selectedWallet) {
      Alert.alert(
        "Are you sure?",
        "This action will remove the wallet from your device. You can always import it back.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => {
              resetWallet(selectedWallet.index); // remove from storage
              dispatch(removeWalletById(selectedWallet.index)); // remove from redux | app state
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

      <ShowWalletQR selectedWallet={selectedWallet} />

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
            if (selectedWallet) {
              Linking.openURL(
                accountExplorerLink(
                  selectedWallet.networkId,
                  selectedWallet.address,
                ),
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
