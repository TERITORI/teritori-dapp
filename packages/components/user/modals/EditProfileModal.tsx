import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { View } from "react-native";

import { EditProfileForm } from "../forms/EditProfileForm";
import { TNSModalCommonProps } from "../types";

import { BrandText } from "@/components/BrandText";
import ModalBase from "@/components/modals/ModalBase";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useTNS } from "@/context/TNSProvider";
import { getNSMintPrice } from "@/hooks/useNSMintPrice";
import { GNO_CONTRACT_FIELD, nsNameInfoQueryKey } from "@/hooks/useNSNameInfo";
import { nsPrimaryAliasQueryKey } from "@/hooks/useNSPrimaryAlias";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetwork, mustGetGnoNetwork, NetworkKind } from "@/networks";
import { adenaDoContract, AdenaDoContractMessage, VmCall } from "@/utils/gno";
import { neutral17, neutral77 } from "@/utils/style/colors";
import { fontMedium16 } from "@/utils/style/fonts";
import { EMPTY_PROFILE, ProfileData } from "@/utils/upp";

interface EditProfileModalProps extends TNSModalCommonProps {}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onClose,
}) => {
  const { name } = useTNS();
  const { setToast } = useFeedbacks();

  const selectedWallet = useSelectedWallet();
  const walletAddress = selectedWallet?.address;

  const { metadata, loading: isLoadingMetadata } = useNSUserInfo(
    selectedWallet?.userId,
  );

  const initialData = useMemo(() => {
    if (isLoadingMetadata || !metadata) return EMPTY_PROFILE;

    return {
      displayName: metadata.public_name,
      avatarURL: metadata.image,
      bannerURL: metadata.public_profile_header,
      bio: metadata.public_bio,
    };
  }, [isLoadingMetadata, metadata]);

  const network = getNetwork(selectedWallet?.networkId);

  const queryClient = useQueryClient();

  const gnoSubmitData = async (profileData: ProfileData, username: string) => {
    try {
      if (!walletAddress) {
        throw Error("No wallet address");
      }

      const network = mustGetGnoNetwork(selectedWallet?.networkId);
      if (!network.profilePkgPath) {
        throw Error("profilePkgPath is not provided");
      }

      const provider = new GnoJSONRPCProvider(network.endpoint);

      const msgs: AdenaDoContractMessage[] = [];

      if (username !== name) {
        const mintPrice = await getNSMintPrice(network.id, username);
        if (!mintPrice) {
          throw Error("unable to get price for given username");
        }

        const vmCall: VmCall = {
          caller: selectedWallet?.address,
          send: `${mintPrice.amount}${mintPrice.denom}`,
          pkg_path: network.nameServiceContractAddress,
          func: "Register",
          args: ["", username, ""],
        };
        msgs.push({ type: "/vm.m_call", value: vmCall });
      }

      // FIXME: the contract supports only update data one by one
      // so we have to send multi msgs => Upgrade contract to support updating multi fields
      for (const [key, val] of Object.entries(profileData)) {
        if (!val) continue;

        let func: string;

        switch (typeof key) {
          case "number":
            func = "SetIntField";
            break;
          case "boolean":
            func = "SetBooleanField";
            break;
          case "string":
            func = "SetStringField";
            break;
          default:
            throw Error(`undefined type of ${key}`);
        }

        // Remapping field
        let field = key;
        let shouldUpdate = false;

        switch (field) {
          case "displayName":
            field = GNO_CONTRACT_FIELD.DISPLAY_NAME;
            shouldUpdate = initialData.displayName !== val;
            break;
          case "bio":
            field = GNO_CONTRACT_FIELD.BIO;
            shouldUpdate = initialData.bio !== val;
            break;
          case "avatarURL":
            field = GNO_CONTRACT_FIELD.AVATAR;
            shouldUpdate = initialData.avatarURL !== val;
            break;
          case "bannerURL":
            field = GNO_CONTRACT_FIELD.BANNER;
            shouldUpdate = initialData.bannerURL !== val;
            break;
          default:
            throw Error(`undefined field  ${field}`);
        }

        if (!shouldUpdate) continue;

        const vmCall: VmCall = {
          caller: walletAddress,
          send: "",
          pkg_path: network.profilePkgPath,
          func,
          args: [field, val],
        };

        msgs.push({ type: "/vm.m_call", value: vmCall });
      }

      if (msgs.length === 0) {
        onClose();
        return setToast({
          mode: "mini",
          type: "warning",
          message: "nothing to update",
        });
      }

      const height = await provider.getBlockNumber();
      const txHash = await adenaDoContract(network.id, msgs, {
        gasWanted: 2_000_000,
      });
      // Wait for tx done
      await provider.waitForTransaction(txHash, height, 30 * 1000);

      onClose();

      queryClient.invalidateQueries(
        nsNameInfoQueryKey(selectedWallet?.networkId, name),
      );

      queryClient.invalidateQueries(
        nsPrimaryAliasQueryKey(selectedWallet?.userId),
      );

      setToast({
        mode: "mini",
        type: "success",
        message: "profile updated successfully",
      });
    } catch (e: any) {
      console.error(e);

      setToast({
        mode: "mini",
        type: "error",
        message: e.message || `${e}`,
      });
    }
  };

  const updateProfile = async (profileData: ProfileData, username: string) => {
    switch (network?.kind) {
      case NetworkKind.Gno:
        await gnoSubmitData(profileData, username);
        break;
      default:
        onClose();
        setToast({
          mode: "mini",
          type: "error",
          message: `unsupported network kind: ${network?.kind}`,
        });
    }
  };

  return (
    <ModalBase
      hideMainSeparator
      onClose={() => onClose()}
      label="Edit profile"
      scrollable
      width={457}
      boxStyle={{
        backgroundColor: neutral17,
      }}
    >
      <View
        style={{
          marginBottom: 20,
        }}
      >
        {isLoadingMetadata ? (
          <BrandText
            style={[fontMedium16, { color: neutral77, fontStyle: "italic" }]}
          >
            Loading...
          </BrandText>
        ) : (
          <EditProfileForm
            btnLabel="Update profile"
            onPressBtn={updateProfile}
            initialData={initialData}
          />
        )}
      </View>
    </ModalBase>
  );
};
