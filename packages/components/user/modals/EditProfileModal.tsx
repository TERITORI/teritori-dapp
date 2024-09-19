import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { toUtf8 } from "@cosmjs/encoding";
import { useQueryClient } from "@tanstack/react-query";
import Long from "long";
import React, { useMemo } from "react";
import { View } from "react-native";

import {
  ExecuteMsg as TNSExecuteMsg,
  Metadata,
} from "../../../contracts-clients/teritori-name-service/TeritoriNameService.types";
import { EditProfileForm } from "../forms/EditProfileForm";
import { TNSModalCommonProps } from "../types";

import { BrandText } from "@/components/BrandText";
import ModalBase from "@/components/modals/ModalBase";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { getNSMintPrice } from "@/hooks/useNSMintPrice";
import { GNO_CONTRACT_FIELD, nsNameInfoQueryKey } from "@/hooks/useNSNameInfo";
import { nsPrimaryAliasQueryKey } from "@/hooks/useNSPrimaryAlias";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { useRunOrProposeTransaction } from "@/hooks/useRunOrProposeTransaction";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getNetwork, NetworkKind, UserKind } from "@/networks";
import { adenaDoContract, AdenaDoContractMessage, VmCall } from "@/utils/gno";
import { neutral17, neutral77 } from "@/utils/style/colors";
import { fontMedium16 } from "@/utils/style/fonts";
import { EMPTY_PROFILE, ProfileData } from "@/utils/upp";

interface EditProfileModalProps extends TNSModalCommonProps {}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onClose,
}) => {
  const { setToast } = useFeedbacks();

  const selectedWallet = useSelectedWallet();
  const walletAddress = selectedWallet?.address;

  const { metadata: currentMetadata, loading: isLoadingMetadata } =
    useNSUserInfo(selectedWallet?.userId);

  const currentUsername = currentMetadata.tokenId || undefined;

  const initialData = useMemo(() => {
    if (isLoadingMetadata || !currentMetadata) return EMPTY_PROFILE;

    return {
      displayName: currentMetadata.public_name,
      avatarURL: currentMetadata.image,
      bannerURL: currentMetadata.public_profile_header,
      bio: currentMetadata.public_bio,
    };
  }, [isLoadingMetadata, currentMetadata]);

  const network = getNetwork(selectedWallet?.networkId);

  const queryClient = useQueryClient();
  const runOrProposeTransaction = useRunOrProposeTransaction(
    selectedWallet?.userId,
    UserKind.Single,
  );

  const cosmosSubmitData = async (
    profileData: ProfileData,
    username: string,
  ) => {
    if (!walletAddress) {
      throw Error("No wallet address");
    }

    if (network?.kind !== NetworkKind.Cosmos) {
      throw Error("network is not cosmos");
    }

    // const nameTokenId = username + network.nameServiceTLD;
    const nameTokenId = username;

    if (!network?.nameServiceContractAddress) {
      throw new Error("Invalid network");
    }

    const mintPrice = await getNSMintPrice(network.id, nameTokenId);
    if (!mintPrice) {
      throw Error("unable to get price for given username");
    }

    // Case of minting
    let payload: TNSExecuteMsg | null = null;
    const metadata: Metadata = {
      public_bio: profileData.bio || "",
      public_name: profileData.displayName || "",
      image: profileData.avatarURL || "",
      public_profile_header: profileData.bannerURL || "",
    };

    if (!currentUsername && nameTokenId) {
      payload = {
        mint: {
          owner: walletAddress,
          token_id: nameTokenId,
          extension: metadata,
        },
      };
    }

    // Case of update
    if (currentUsername) {
      payload = {
        update_metadata: {
          token_id: nameTokenId,
          metadata,
        },
      };
    }

    if (payload === null) {
      throw Error("nothing to execute");
    }

    const msg: MsgExecuteContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: walletAddress,
        contract: network.nameServiceContractAddress,
        msg: toUtf8(JSON.stringify(payload)),
        funds: Long.fromString(mintPrice.amount).isZero()
          ? undefined
          : [mintPrice],
      },
    };

    await runOrProposeTransaction({
      msgs: [msg],
      navigateToProposals: true,
    });

    // FIXME: Handle DAO later
    // const message =
    //   userKind === UserKind.Single
    //     ? normalizedTokenId + " successfully booked"
    //     : "Proposed to book " + normalizedTokenId;

    onClose?.();
    setToast({
      type: "success",
      mode: "mini",
      message: "profile updated successfully",
    });

    queryClient.invalidateQueries(nsNameInfoQueryKey(network.id, nameTokenId));

    queryClient.invalidateQueries(
      nsPrimaryAliasQueryKey(selectedWallet?.userId),
    );
  };

  const gnoSubmitData = async (profileData: ProfileData, username: string) => {
    if (!walletAddress) {
      throw Error("No wallet address");
    }

    if (network?.kind !== NetworkKind.Gno) {
      throw Error("network is not gno");
    }

    if (!network.profilePkgPath) {
      throw Error("profilePkgPath is not provided");
    }

    const msgs: AdenaDoContractMessage[] = [];

    if (username && username !== currentUsername) {
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

    await adenaDoContract(network.id, msgs, {
      gasWanted: 2_000_000,
    });

    onClose();

    queryClient.invalidateQueries(
      nsNameInfoQueryKey(network.id, currentUsername),
    );

    queryClient.invalidateQueries(
      nsPrimaryAliasQueryKey(selectedWallet?.userId),
    );

    setToast({
      mode: "mini",
      type: "success",
      message: "profile updated successfully",
    });
  };

  const updateProfile = async (profileData: ProfileData, username: string) => {
    try {
      switch (network?.kind) {
        case NetworkKind.Gno:
          await gnoSubmitData(profileData, username);
          break;
        case NetworkKind.Cosmos:
          await cosmosSubmitData(profileData, username);
          break;
        default:
          throw Error(`unsupported network kind: ${network?.kind}`);
      }
    } catch (e: any) {
      console.error(e);
      onClose();
      setToast({
        mode: "mini",
        type: "error",
        message: e.message || `${e}`,
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
            initialUsername={currentUsername}
          />
        )}
      </View>
    </ModalBase>
  );
};
