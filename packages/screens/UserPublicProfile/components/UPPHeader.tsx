import React, { memo, useState } from "react";

import { UPPIntro } from "./UPPIntro";
import useSelectedWallet from "../../../hooks/useSelectedWallet";

import { Tabs } from "@/components/tabs/Tabs";
import { EditProfileModal } from "@/components/user/modals/EditProfileModal";
import { useTNS } from "@/context/TNSProvider";
import { useIsDAO } from "@/hooks/cosmwasm/useCosmWasmContractInfo";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { NetworkKind, parseUserId, UserKind } from "@/networks";
import { TNSUpdateNameScreen } from "@/screens/TeritoriNameService/TNSUpdateNameScreen";
import { primaryColor } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { uppTabItems } from "@/utils/upp";

interface UserPublicProfileScreenHeaderProps {
  userId: string;
  selectedTab: keyof typeof uppTabItems;
}

export const UPPHeader = memo(
  ({
    userId,
    selectedTab: selectedTabKey,
  }: UserPublicProfileScreenHeaderProps) => {
    const navigation = useAppNavigation();
    const selectedWallet = useSelectedWallet();
    const { width } = useMaxResolution();
    const { isDAO } = useIsDAO(userId);
    const [network] = parseUserId(userId);
    const [isEditProfileModal, setIsEditProfileModal] = useState<boolean>();
    const { setName } = useTNS();

    const onCloseModalHandler = () => {
      setIsEditProfileModal(false);
      setName("");
    };

    const items: typeof uppTabItems = Object.entries(uppTabItems).reduce(
      (o, [key, item]) => {
        if (!network) return o;
        if (item.networkKinds && !item.networkKinds.includes(network.kind)) {
          return o;
        }
        if (
          item.userKinds &&
          ((item.userKinds.includes(UserKind.Organization) && !isDAO) ||
            (item.userKinds.includes(UserKind.Single) && isDAO))
        ) {
          return o;
        }
        if (
          item.networkFeatures &&
          !item.networkFeatures.find((networkFeature) =>
            network.features.includes(networkFeature),
          )
        ) {
          return o;
        }
        return { ...o, [key]: item };
      },
      {} as { [key in keyof typeof uppTabItems]: { name: string } },
    );

    return (
      <>
        <UPPIntro
          userId={userId}
          isUserOwner={selectedWallet?.userId === userId}
          setIsEditProfileModal={(val: boolean) => setIsEditProfileModal(val)}
        />
        <Tabs
          items={items}
          selected={selectedTabKey}
          onSelect={(key) => {
            navigation.navigate("UserPublicProfile", { id: userId, tab: key });
          }}
          style={{
            width,
            marginTop: 32,
            marginBottom: layout.spacing_x4,
            height: 45,
          }}
          borderColorTabSelected={primaryColor}
        />

        {isEditProfileModal &&
          (network?.kind === NetworkKind.Cosmos ? (
            <TNSUpdateNameScreen onClose={() => onCloseModalHandler()} />
          ) : (
            <EditProfileModal onClose={() => onCloseModalHandler()} />
          ))}
      </>
    );
  },
);
