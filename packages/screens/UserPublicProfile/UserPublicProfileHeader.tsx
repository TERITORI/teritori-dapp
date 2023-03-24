import React from "react";

import { Tabs } from "../../components/tabs/Tabs";
import { UPPIntro } from "../../components/userPublicProfile/UPPIntro";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { primaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";

export const screenTabItems = {
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
  userPosts: {
    name: "User's Posts",
    disabled: true,
  },
  mentionsPosts: {
    name: "Mentions Posts",
    disabled: true,
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

  return (
    <>
      <UPPIntro
        userId={userId}
        isUserOwner={selectedWallet?.userId === userId}
      />
      <Tabs
        items={screenTabItems}
        selected={selectedTab}
        onSelect={setSelectedTab}
        style={{
          marginTop: 32,
          marginBottom: layout.padding_x2_5 / 2,
        }}
        borderColorTabSelected={primaryColor}
      />
    </>
  );
};
