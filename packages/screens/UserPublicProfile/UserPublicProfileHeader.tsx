import React, { useEffect } from "react";

import { Tabs } from "../../components/tabs/Tabs";
import { UPPIntro } from "../../components/userPublicProfile/UPPIntro";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, parseUserId } from "../../networks";
import { primaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";
import { objectKeys } from "../../utils/typescript";

export const screenTabItems = {
  userPosts: {
    name: "Posts",
  },
  nfts: {
    name: "NFTs",
  },
  // activity: {
  //   name: "Activity",
  //   disabled: true,
  // },
  quests: {
    name: "Quests",
  },
  mentionsPosts: {
    name: "Mentions Posts",
  },
  daos: {
    name: "Organizations",
  },
  proposals: {
    name: "Proposals",
  },
  members: {
    name: "Members",
  },
  funds: {
    name: "Funds",
  },
  gnoDemo: {
    name: "POCs",
  },
  musicAlbums: {
    name: "Albums",
  },
  // pathwar: {
  //   name: "Pathwar Challenges",
  //   disabled: true,
  // },
  // gig: {
  //   name: "Gig Services",
  //   disabled: true,
  // },
  // votes: {
  //   name: "Governance Votes",
  //   disabled: true,
  // },
  // footer: {
  //   name: "Putted NFT to Rioters Footer",
  //   disabled: true,
  // },
  // servers: {
  //   name: "Shared servers",
  //   disabled: true,
  // },
};

interface UserPublicProfileScreenHeaderProps {
  userId: string;
  selectedTab: keyof typeof screenTabItems;
  setSelectedTab: (tab: keyof typeof screenTabItems) => void;
}

export const UserPublicProfileScreenHeader = ({
  userId,
  selectedTab,
  setSelectedTab,
}: UserPublicProfileScreenHeaderProps) => {
  const selectedWallet = useSelectedWallet();
  const { width } = useMaxResolution();
  const { isDAO } = useIsDAO(userId);
  const [network] = parseUserId(userId);

  // TODO: refactor this to use network features filter defined on tab
  const items = Object.entries(screenTabItems).reduce((o, [key, item]) => {
    if (
      network?.kind === NetworkKind.Gno &&
      ["nfts", "quests", "mentionsPosts", "funds"].includes(key)
    ) {
      return o;
    }
    if (network?.kind !== NetworkKind.Gno && ["gnoDemo"].includes(key)) {
      return o;
    }
    if (
      (isDAO || network?.kind === NetworkKind.Gno) &&
      ["daos"].includes(key)
    ) {
      return o;
    }
    if (!isDAO && ["members", "proposals", "funds", "gnoDemo"].includes(key)) {
      return o;
    }
    return { ...o, [key]: item };
  }, {} as { [key in keyof typeof screenTabItems]: { name: string } });

  // TODO: refactor the way we handle the tabs to better support dynamic list of tabs
  const forcedSelection = items[selectedTab]
    ? selectedTab
    : objectKeys(items)[0];
  useEffect(() => {
    if (forcedSelection && selectedTab !== forcedSelection) {
      setSelectedTab(forcedSelection);
    }
  }, [setSelectedTab, selectedTab, forcedSelection]);

  return (
    <>
      <UPPIntro
        userId={userId}
        isUserOwner={selectedWallet?.userId === userId}
      />
      <Tabs
        items={items}
        selected={selectedTab}
        onSelect={setSelectedTab}
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
