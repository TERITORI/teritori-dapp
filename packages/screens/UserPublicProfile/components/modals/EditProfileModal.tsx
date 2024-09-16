import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { View } from "react-native";

import { EditProfileForm } from "../forms/EditProfileForm";

import ModalBase from "@/components/modals/ModalBase";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useTNS } from "@/context/TNSProvider";
import { nsNameInfoQueryKey } from "@/hooks/useNSNameInfo";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetwork, mustGetGnoNetwork, NetworkKind } from "@/networks";
import { TNSModalCommonProps } from "@/screens/TeritoriNameService/types";
import { adenaDoContract, AdenaDoContractMessage } from "@/utils/gno";
import { neutral17 } from "@/utils/style/colors";
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

  const gnoSubmitData = async (data: ProfileData) => {
    try {
      if (!walletAddress) {
        throw Error("No wallet address");
      }

      const network = mustGetGnoNetwork(selectedWallet?.networkId);
      if (!network.profilePkgPath) {
        throw Error("profilePkgPath is not provided");
      }

      const provider = new GnoJSONRPCProvider(network.endpoint);

      // FIXME: the contract supports only update data one by one
      // so we have to send multi msgs => Upgrade contract to support updating multi fields
      const msgs: AdenaDoContractMessage[] = [];
      for (const [key, val] of Object.entries(data)) {
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
        switch (field) {
          case "displayName":
            field = "DisplayName";
            break;
          case "bio":
            field = "Bio";
            break;
          case "avatarURL":
            field = "Avatar";
            break;
          case "bannerURL":
            field = "Ext_Banner";
            break;
          default:
            throw Error(`undefined field  ${field}`);
        }

        const vmCall = {
          caller: walletAddress,
          send: "",
          pkg_path: network.profilePkgPath,
          func,
          args: [field, val],
        };

        msgs.push({ type: "/vm.m_call", value: vmCall });
      }

      const height = await provider.getBlockNumber();
      const txHash = await adenaDoContract(network.id, msgs, {
        gasWanted: 2_000_000,
      });
      // Wait for tx done
      await provider.waitForTransaction(txHash, height, 30 * 1000);

      onClose();
    } catch (e: any) {
      console.error(e);

      setToast({
        mode: "mini",
        type: "error",
        message: e.message || `${e}`,
      });
    }

    await queryClient.invalidateQueries(
      nsNameInfoQueryKey(selectedWallet?.networkId, name),
    );
  };

  const submitData = async (data: ProfileData) => {
    switch (network?.kind) {
      case NetworkKind.Gno:
        await gnoSubmitData(data);
        break;
      default:
        throw Error(`unsupported network kind: ${network?.kind}`);
    }
  };

  return (
    <ModalBase
      hideMainSeparator
      onClose={() => onClose()}
      label={`Edit profile ${name}`}
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
        {!isLoadingMetadata && (
          <EditProfileForm
            btnLabel="Update profile"
            onPressBtn={submitData}
            initialData={initialData}
          />
        )}
      </View>
    </ModalBase>
  );
};
