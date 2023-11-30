import React, { useEffect } from "react";

import { UPPIntro } from "./UPPIntro";
import { Tabs } from "../../../components/tabs/Tabs";
import { useIsDAO } from "../../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { NetworkFeature, NetworkKind, parseUserId } from "../../../networks";
import { useAppNavigation } from "../../../utils/navigation";
import { primaryColor } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { objectKeys } from "../../../utils/typescript";
import { uppTabItems } from "../../../utils/upp";

interface UserPublicProfileScreenHeaderProps {
  userId: string;
  selectedTab: keyof typeof uppTabItems;
}

export const UPPHeader = ({
  userId,
  selectedTab,
}: UserPublicProfileScreenHeaderProps) => {
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const { width } = useMaxResolution();
  const { isDAO } = useIsDAO(userId);
  const [network] = parseUserId(userId);

  const items = Object.entries(uppTabItems).reduce(
    (o, [key, item]) => {
      if (
        !network?.features.includes(NetworkFeature.NFTMarketplace) &&
        ["nfts"].includes(key)
      ) {
        return o;
      }
      if (
        !network?.features.includes(NetworkFeature.Organizations) &&
        ["daos", "daoProposals", "daoMembers"].includes(key)
      ) {
        return o;
      }
      if (
        network?.features.includes(NetworkFeature.Organizations) &&
        isDAO &&
        ["daos"].includes(key)
      ) {
        return o;
      }
      if (
        !network?.features.includes(NetworkFeature.SocialFeed) &&
        ["feedMentionsPosts", "feedMusic", "feedVideos"].includes(key)
      ) {
        return o;
      }
      if (network?.kind !== NetworkKind.Gno && ["gnoDemo"].includes(key)) {
        return o;
      }
      if (
        !isDAO &&
        ["daosMembers", "daosProposals", "funds", "gnoDemo"].includes(key)
      ) {
        return o;
      }

      return { ...o, [key]: item };
    },
    {} as { [key in keyof typeof uppTabItems]: { name: string } },
  );

  const forcedSelection = items[selectedTab]
    ? selectedTab
    : objectKeys(items)[0];
  useEffect(() => {
    if (forcedSelection && selectedTab !== forcedSelection) {
      navigation.replace("UserPublicProfile", {
        id: userId,
        tab: forcedSelection,
      });
    }
  }, [userId, selectedTab, forcedSelection, navigation]);

  return (
    <>
      <UPPIntro
        userId={userId}
        isUserOwner={selectedWallet?.userId === userId}
      />
      <Tabs
        items={items}
        selected={selectedTab}
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
};
