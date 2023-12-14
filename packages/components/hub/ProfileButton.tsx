import { useQueryClient } from "@tanstack/react-query";
import Long from "long";
import React, { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useBalances } from "../../hooks/useBalances";
import { nsNameInfoQueryKey, useNSNameInfo } from "../../hooks/useNSNameInfo";
import { nsPrimaryAliasQueryKey } from "../../hooks/useNSPrimaryAlias";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import {
  NetworkKind,
  getNetwork,
  getStakingCurrency,
  mustGetGnoNetwork,
  parseUserId,
  NetworkFeature,
} from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { VmCall, adenaVMCall } from "../../utils/gno";
import {
  errorColor,
  neutral00,
  neutral77,
  successColor,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { modalMarginPadding } from "../../utils/style/modals";
import { BrandText } from "../BrandText";
import { OmniLink } from "../OmniLink";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";
import { TextInputCustom } from "../inputs/TextInputCustom";
import ModalBase from "../modals/ModalBase";
import { SpacerColumn } from "../spacer";

export const ProfileButton: React.FC<{
  style?: StyleProp<ViewStyle>;
  isEdit?: boolean;
}> = ({ style, isEdit }) => {
  const selectedWallet = useSelectedWallet();
  const network = getNetwork(selectedWallet?.networkId);
  const { metadata } = useNSUserInfo(selectedWallet?.userId);
  if (!network?.features.includes(NetworkFeature.NameService)) {
    return null;
  }

  if (selectedWallet && metadata?.tokenId)
    return (
      <OmniLink
        style={style}
        disabled={network?.kind !== NetworkKind.Cosmos}
        to={
          !isEdit
            ? {
                screen: "UserPublicProfile",
                params: {
                  id: selectedWallet.userId,
                },
              }
            : metadata.tokenId
              ? {
                  screen: "TNSHome",
                  params: {
                    modal: "update-name",
                    name: metadata.tokenId.replace(".tori", ""),
                  },
                }
              : { screen: "ComingSoon" }
        }
      >
        <SecondaryButtonOutline
          size="XL"
          disabled={network?.kind !== NetworkKind.Cosmos}
          text={isEdit ? "Edit profile" : "My profile"}
          backgroundColor={neutral00}
        />
      </OmniLink>
    );

  return <RegisterButton networkId={network?.id} style={style} />;
};

const RegisterButton: React.FC<{
  style?: StyleProp<ViewStyle>;
  networkId: string | undefined;
}> = ({ networkId, style }) => {
  const network = getNetwork(networkId);
  const [gnoModalVisible, setGnoModalVisible] = useState(false);

  if (network?.kind === NetworkKind.Cosmos) {
    return (
      <OmniLink
        to={{
          screen: "TNSHome",
          params: {
            modal: "register",
          },
        }}
        style={style}
      >
        <SecondaryButtonOutline
          size="XL"
          text="Create profile"
          backgroundColor={neutral00}
        />
      </OmniLink>
    );
  }

  if (network?.kind === NetworkKind.Gno) {
    return (
      <View style={style}>
        <SecondaryButtonOutline
          size="XL"
          text="Create profile"
          backgroundColor={neutral00}
          onPress={() => setGnoModalVisible(true)}
        />
        <RegisterGnoNameModal
          networkId={networkId}
          visible={gnoModalVisible}
          onClose={() => setGnoModalVisible(false)}
        />
      </View>
    );
  }

  return null; // MAYBE TODO: fallback?
};

const gnoNameCost = 200_000_000; // MAYBE TODO: fetch min fee from contract https://testnet.gno.teritori.com/r/demo/users/users.gno

const RegisterGnoNameModal: React.FC<{
  visible: boolean;
  networkId: string | undefined;
  onClose?: () => void;
}> = ({ visible, networkId, onClose }) => {
  const [name, setName] = useState("");
  const nameWithTLD = name + ".gno";
  const { isLoading, nsInfo } = useNSNameInfo(networkId, nameWithTLD);
  const { wrapWithFeedback } = useFeedbacks();
  const selectedWallet = useSelectedWallet();
  const [network, userAddress] = parseUserId(selectedWallet?.userId);
  const balances = useBalances(network?.id, userAddress);
  const stakingCurrency = getStakingCurrency(networkId);
  const denom = stakingCurrency?.denom;
  const bal = denom ? balances?.find((b) => b.denom === denom) : undefined;
  const notEnoughFunds = Long.fromString(bal?.amount || "0").lessThan(
    Long.fromNumber(gnoNameCost),
  );
  const buttonDisabled = !name || !!nsInfo || isLoading || notEnoughFunds;
  const queryClient = useQueryClient();
  return (
    <ModalBase
      label="Register Gno name"
      visible={visible}
      onClose={onClose}
      boxStyle={{ minWidth: 400 }}
    >
      <BrandText style={fontSemibold14}>
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Fee:
        </BrandText>{" "}
        {prettyPrice(networkId, gnoNameCost.toString(), denom)}
      </BrandText>
      <SpacerColumn size={2} />
      <TextInputCustom
        label="Name"
        name="name"
        value={name}
        placeHolder="Type the name you want to register"
        onChangeText={setName}
      />
      <SpacerColumn size={2} />
      <BrandText
        style={[
          fontSemibold14,
          { color: notEnoughFunds ? errorColor : successColor },
        ]}
      >
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Available balance:
        </BrandText>{" "}
        {prettyPrice(networkId, bal?.amount, denom)}
      </BrandText>
      <SpacerColumn size={2} />
      <PrimaryButton
        text={
          nsInfo
            ? "Already taken"
            : notEnoughFunds
              ? "Not enough funds"
              : "Register"
        }
        disabled={buttonDisabled}
        fullWidth
        loader
        boxStyle={{ marginBottom: modalMarginPadding }}
        onPress={async () => {
          await wrapWithFeedback(async () => {
            if (!selectedWallet) throw new Error("No wallet selected");
            const network = mustGetGnoNetwork(networkId);
            const req: VmCall = {
              caller: selectedWallet?.address,
              send: `${gnoNameCost}${denom}`,
              pkg_path: network.nameServiceContractAddress,
              func: "Register",
              args: ["", name, ""],
            };
            await adenaVMCall(network.id, req, { gasWanted: 2_000_000 });
          })();
          queryClient.invalidateQueries(
            nsNameInfoQueryKey(networkId, nameWithTLD),
          );
          queryClient.invalidateQueries(
            nsPrimaryAliasQueryKey(selectedWallet?.userId),
          );
          onClose?.();
        }}
      />
    </ModalBase>
  );
};
