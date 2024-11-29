import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import stopSVG from "../../../../assets/icons/stop.svg";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { CustomButton } from "@/components/buttons/CustomButton";
import { SpacerColumn } from "@/components/spacer";
import {
  resetAllAddressBook,
  resetAllTokens,
  resetAllWallets,
  selectAllWallets,
} from "@/store/slices/wallets";
import { useAppDispatch } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium16, fontSemibold30 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { resetWallet } from "@/utils/wallet/getNativeWallet";

export const ResetWalletScreen: ScreenFC<"MiniResetWallet"> = ({
  navigation,
}) => {
  const gotoSecurityAndPrivacy = () =>
    navigation.replace("MiniSecurityAndPrivacy");

  const dispatch = useAppDispatch();
  const wallets = useSelector(selectAllWallets);

  const onResetPress = () => {
    wallets.map((wallet) => {
      resetWallet(wallet.index); // remove from storage
    });
    dispatch(resetAllWallets()); // remove all from redux | app state
    dispatch(resetAllAddressBook()); // reset means reset!
    dispatch(resetAllTokens()); // reset means reset!
  };

  return (
    <BlurScreenContainer title="Reset Wallet" onGoBack={gotoSecurityAndPrivacy}>
      <View
        style={{
          justifyContent: "space-between",
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <SpacerColumn size={1} />
          <SVG
            source={stopSVG}
            height={104}
            width={104}
            style={{ marginBottom: layout.spacing_x4 }}
          />
          <BrandText
            style={[fontSemibold30, { marginBottom: layout.spacing_x1_5 }]}
          >
            Reset Wallet
          </BrandText>
          <BrandText style={[fontMedium16, { color: neutral77 }]}>
            Only proceed if you wish to remove all existing accounts and replace
            them with new ones. Make sure to back up your seed phrase and keys
            first.
          </BrandText>
        </View>
        <CustomButton title="Reset" onPress={onResetPress} type="danger" />
      </View>
    </BlurScreenContainer>
  );
};
