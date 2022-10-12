import React from "react";
import { View } from "react-native";

import { QuestCard } from "./cards/QuestCard";

export const Quests: React.FC = () => {
  const questCardStyle = {
    marginTop: 20,
    marginRight: 16,
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <QuestCard
        label="Claim Teritori    Airdrop"
        style={questCardStyle}
        isCurrent
      />
      <QuestCard
        label="Book a Handle Teritori Name Service"
        style={questCardStyle}
      />
      <QuestCard label="Buy your 1st NFT on Launchpad" style={questCardStyle} />
      <QuestCard
        label="List your 1st  NFT on Marketplace"
        style={questCardStyle}
      />
      <QuestCard
        label="Sell your 1st NFT on Marketplace "
        style={questCardStyle}
      />
      <QuestCard
        label="Put your Graffiti on Rioters Footer"
        style={questCardStyle}
      />
    </View>
  );
};
