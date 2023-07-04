import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { TNSNameFinderModal } from "../../../components/modals/teritoriNameService/TNSNameFinderModal";
import { SpacerColumn } from "../../../components/spacer";
import { AppRouteType, useAppNavigation } from "../../../utils/navigation";
import { neutral33, neutral55 } from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { TNSMintNameMultisignScreen } from "../../TeritoriNameService/TNSMintNameMultisignScreen";
import { TNSRegisterScreen } from "../../TeritoriNameService/TNSRegisterScreen";

export const RightSection = () => {
  const navigation = useAppNavigation();
  const [visibleRegisterForm, setVisibleRegisterForm] =
    useState<boolean>(false);
  const [visibleMintForm, setVisibleMintForm] = useState<boolean>(false);
  const {
    params: { address, walletName },
  } = useRoute<AppRouteType<"MultisigWalletDashboard">>();

  const [modalNameFinderVisible, setModalNameFinderVisible] = useState(false);

  const handleRegisterTnsModalClose = (modalName?: string) => {
    setVisibleRegisterForm(false);
    if (modalName === "TNSMintName") {
      setVisibleMintForm(true);
    }
  };
  const handleMintTnsModalClose = (modalName?: string) => {
    setVisibleMintForm(false);
    navigation.reset({
      index: 1,
      routes: [{ name: "Multisig" }],
    });
  };

  // returns
  return (
    <View style={styles.container}>
      <SpacerColumn size={5} />
      <BrandText style={[fontSemibold12, { color: neutral55 }]}>
        ACTIONS
      </BrandText>

      <SpacerColumn size={2} />
      <PrimaryButton
        size="M"
        text="Create Transaction"
        fullWidth
        onPress={() =>
          navigation.navigate("MultisigTransfer", { address, walletName })
        }
      />

      <SpacerColumn size={2.5} />
      <PrimaryButton
        size="M"
        text="Create Delegation"
        fullWidth
        onPress={() =>
          navigation.navigate("MultisigDelegate", { address, walletName })
        }
      />

      <SpacerColumn size={2.5} />
      <PrimaryButton
        size="M"
        text="Buy a TNS Account"
        fullWidth
        onPress={() => {
          setModalNameFinderVisible(true);
        }}
      />

      <SpacerColumn size={2.5} />
      <PrimaryButton
        size="M"
        text="Transactions"
        fullWidth
        onPress={() =>
          navigation.navigate("MultisigTransactions", {
            address,
            walletName,
          })
        }
      />
      <TNSNameFinderModal
        visible={modalNameFinderVisible}
        onClose={() => {
          setModalNameFinderVisible(false);
        }}
        onEnter={() => {
          setModalNameFinderVisible(false);
          setVisibleRegisterForm(true);
          // pressedTNSItems &&
          // navigation.navigate("TNSHome", {
          //   modal: TNSPathMap[pressedTNSItems],
          //   name,
          // });
        }}
      />
      {visibleRegisterForm && (
        <TNSRegisterScreen onClose={handleRegisterTnsModalClose} />
      )}
      {visibleMintForm && (
        <TNSMintNameMultisignScreen
          onClose={handleMintTnsModalClose}
          address={address}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: "100%",
    borderLeftWidth: 1,
    borderColor: neutral33,
    padding: layout.padding_x2_5,
  },
});
