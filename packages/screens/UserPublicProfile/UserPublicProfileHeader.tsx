import React from "react";

import { Tabs } from "../../components/tabs/Tabs";
import { UPPIntro } from "../../components/userPublicProfile/UPPIntro";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { primaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";

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
  funds: {
    name: "Funds",
  },
  members: {
    name: "Members",
  },
  proposals: {
    name: "Proposals",
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
  const { selectedWallet } = useSelectedWallet();
  const { width } = useMaxResolution();
  const { isDAO } = useIsDAO(userId);

  const items = Object.entries(screenTabItems).reduce((o, [key, item]) => {
    if (isDAO && ["daos"].includes(key)) {
      return o;
    }
    if (!isDAO && ["members", "proposals", "funds"].includes(key)) {
      return o;
    }
    return { ...o, [key]: item };
  }, {} as { [key in keyof typeof screenTabItems]: { name: string } });

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
          marginBottom: layout.padding_x4,
          height: 45,
        }}
        borderColorTabSelected={primaryColor}
      />
    </>
  );
};
