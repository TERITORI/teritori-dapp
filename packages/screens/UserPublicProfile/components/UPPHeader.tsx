import React, { memo } from "react";

import { UPPIntro } from "./UPPIntro";
import { Tabs } from "../../../components/tabs/Tabs";
import { useIsDAO } from "../../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { parseUserId, UserKind } from "../../../networks";
import { useAppNavigation } from "../../../utils/navigation";
import { primaryColor } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { uppTabItems } from "../../../utils/upp";

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
      </>
    );
  },
);
