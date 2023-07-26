import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { PrimaryButton } from "../../../components/buttons/PrimaryButton";
import { SendModal } from "../../../components/modals/SendModal";
import { TNSNameFinderModal } from "../../../components/modals/teritoriNameService/TNSNameFinderModal";
import { SpacerColumn } from "../../../components/spacer";
import { UserKind, getStakingCurrency, parseUserId } from "../../../networks";
import { AppRouteType, useAppNavigation } from "../../../utils/navigation";
import { neutral33, neutral55 } from "../../../utils/style/colors";
import { fontSemibold12 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { TNSMintNameModal } from "../../TeritoriNameService/TNSMintNameScreen";
import { TNSRegisterScreen } from "../../TeritoriNameService/TNSRegisterScreen";

export const RightSection = () => {
  const navigation = useAppNavigation();
  const [visibleRegisterForm, setVisibleRegisterForm] =
    useState<boolean>(false);
  const [visibleMintForm, setVisibleMintForm] = useState<boolean>(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const {
    params: { id },
  } = useRoute<AppRouteType<"MultisigWalletDashboard">>();
  const [network] = parseUserId(id);

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
        text="Send"
        fullWidth
        onPress={() => setShowSendModal(true)}
      />
      {!!network && (
        <SendModal
          isVisible={showSendModal}
          userId={id}
          userKind={UserKind.Multisig}
          onClose={() => setShowSendModal(false)}
          nativeCurrency={getStakingCurrency(network.id)}
        />
      )}

      <SpacerColumn size={2.5} />
      <PrimaryButton
        size="M"
        text="Delegate"
        fullWidth
        onPress={() => navigation.navigate("Staking", { multisigId: id })}
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

      <TNSNameFinderModal
        visible={modalNameFinderVisible}
        onClose={() => {
          setModalNameFinderVisible(false);
        }}
        onEnter={() => {
          setModalNameFinderVisible(false);
          setVisibleRegisterForm(true);
        }}
      />
      {visibleRegisterForm && (
        <TNSRegisterScreen onClose={handleRegisterTnsModalClose} />
      )}
      {visibleMintForm && (
        <TNSMintNameModal
          initialData={{}}
          userId={id}
          userKind={UserKind.Multisig}
          onClose={handleMintTnsModalClose}
          navigateBackTo="TNSManage" // FIXME: this is weird
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
