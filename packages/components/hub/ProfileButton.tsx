import React, { useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, getNetwork, NetworkFeature } from "../../networks";
import { neutral00 } from "../../utils/style/colors";
import { OmniLink } from "../OmniLink";
import { SecondaryButtonOutline } from "../buttons/SecondaryButtonOutline";
import { EditProfileModal } from "../user/modals/EditProfileModal";

import { useTNS } from "@/context/TNSProvider";
import { ButtonsSize } from "@/utils/style/buttons";

export const ProfileButton: React.FC<{
  buttonSize?: ButtonsSize;
  style?: StyleProp<ViewStyle>;
  isEdit?: boolean;
  setIsEditProfileModal?: (val: boolean) => void;
}> = ({
  style,
  isEdit,
  buttonSize = "XL",
  setIsEditProfileModal = (val: boolean) => {},
}) => {
  const selectedWallet = useSelectedWallet();
  const { setName } = useTNS();

  const network = getNetwork(selectedWallet?.networkId);
  const { metadata } = useNSUserInfo(selectedWallet?.userId);

  if (!network?.features.includes(NetworkFeature.NameService)) {
    return null;
  }
  if (!selectedWallet || !metadata?.tokenId) {
    return (
      <RegisterButton networkId={network?.id} style={style} size={buttonSize} />
    );
  }

  if (isEdit) {
    return (
      <SecondaryButtonOutline
        size={buttonSize}
        disabled={!network?.features.includes(NetworkFeature.UPP)}
        text="Edit profile"
        backgroundColor={neutral00}
        onPress={() => {
          const tokenName = metadata?.tokenId?.replace(".tori", "");
          setIsEditProfileModal(true);
          setName(tokenName || "");
        }}
      />
    );
  }

  return (
    <OmniLink
      style={style}
      disabled={network?.kind !== NetworkKind.Cosmos}
      to={{
        screen: "UserPublicProfile",
        params: {
          id: selectedWallet.userId,
        },
      }}
    >
      <SecondaryButtonOutline
        size={buttonSize}
        disabled={network?.kind !== NetworkKind.Cosmos}
        text="My profile"
        backgroundColor={neutral00}
      />
    </OmniLink>
  );
};

const RegisterButton: React.FC<{
  style?: StyleProp<ViewStyle>;
  networkId: string | undefined;
  size: ButtonsSize;
}> = ({ networkId, style, size }) => {
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
          size={size}
          text="Edit profile"
          backgroundColor={neutral00}
        />
      </OmniLink>
    );
  }

  if (network?.kind === NetworkKind.Gno) {
    return (
      <View style={style}>
        <SecondaryButtonOutline
          size={size}
          text="Edit profile"
          backgroundColor={neutral00}
          onPress={() => setGnoModalVisible(true)}
        />

        {gnoModalVisible && (
          <EditProfileModal onClose={() => setGnoModalVisible(false)} />
        )}
      </View>
    );
  }

  return null; // MAYBE TODO: fallback?
};

// NOTE: Legacy code, when we could create username/TNS Nft separately
// keep this just to have a reference
// const gnoNameCost = 200_000_000; // MAYBE TODO: fetch min fee from contract https://testnet.gno.teritori.com/r/demo/users/users.gno

// const RegisterGnoNameModal: React.FC<{
//   visible: boolean;
//   networkId: string | undefined;
//   onClose?: () => void;
// }> = ({ visible, networkId, onClose }) => {
//   const [name, setName] = useState("");
//   const nameWithTLD = name + ".gno";
//   const { isLoading, nsInfo } = useNSNameInfo(networkId, nameWithTLD);
//   const { wrapWithFeedback } = useFeedbacks();
//   const selectedWallet = useSelectedWallet();
//   const [network, userAddress] = parseUserId(selectedWallet?.userId);
//   const { balances } = useBalances(network?.id, userAddress);
//   const stakingCurrency = getStakingCurrency(networkId);
//   const denom = stakingCurrency?.denom;
//   const bal = denom ? balances?.find((b) => b.denom === denom) : undefined;
//   const notEnoughFunds = Long.fromString(bal?.amount || "0").lessThan(
//     Long.fromNumber(gnoNameCost),
//   );
//   const buttonDisabled = !name || !!nsInfo || isLoading || notEnoughFunds;
//   const queryClient = useQueryClient();
//   return (
//     <ModalBase
//       label="Register Gno name"
//       visible={visible}
//       onClose={onClose}
//       boxStyle={{ minWidth: 400 }}
//     >
//       <BrandText style={fontSemibold14}>
//         <BrandText style={[fontSemibold14, { color: neutral77 }]}>
//           Fee:
//         </BrandText>{" "}
//         {prettyPrice(networkId, gnoNameCost.toString(), denom)}
//       </BrandText>
//       <SpacerColumn size={2} />
//       <TextInputCustom
//         label="Name"
//         name="name"
//         value={name}
//         placeHolder="Type the name you want to register"
//         onChangeText={setName}
//       />
//       <SpacerColumn size={2} />
//       <BrandText
//         style={[
//           fontSemibold14,
//           { color: notEnoughFunds ? errorColor : successColor },
//         ]}
//       >
//         <BrandText style={[fontSemibold14, { color: neutral77 }]}>
//           Available balance:
//         </BrandText>{" "}
//         {prettyPrice(networkId, bal?.amount, denom)}
//       </BrandText>
//       <SpacerColumn size={2} />
//       <PrimaryButton
//         text={
//           nsInfo
//             ? "Already taken"
//             : notEnoughFunds
//               ? "Not enough funds"
//               : "Register"
//         }
//         disabled={buttonDisabled}
//         fullWidth
//         loader
//         boxStyle={{ marginBottom: modalMarginPadding }}
//         onPress={async () => {
//           await wrapWithFeedback(async () => {
//             if (!selectedWallet) throw new Error("No wallet selected");
//             const network = mustGetGnoNetwork(networkId);
//             const req: VmCall = {
//               caller: selectedWallet?.address,
//               send: `${gnoNameCost}${denom}`,
//               pkg_path: network.nameServiceContractAddress,
//               func: "Register",
//               args: ["", name, ""],
//             };
//             await adenaVMCall(network.id, req, { gasWanted: 2_000_000 });
//           })();
//           queryClient.invalidateQueries(
//             nsNameInfoQueryKey(networkId, nameWithTLD),
//           );
//           queryClient.invalidateQueries(
//             nsPrimaryAliasQueryKey(selectedWallet?.userId),
//           );
//           onClose?.();
//         }}
//       />
//     </ModalBase>
//   );
// };
