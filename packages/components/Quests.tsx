import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { Quest } from "../api/marketplace/v1/marketplace";
import useSelectedWallet from "../hooks/useSelectedWallet";
import { backendClient } from "../utils/backend";
import { Network } from "../utils/network";
import { QuestCard } from "./cards/QuestCard";

export const Quests: React.FC = () => {
  const selectedWallet = useSelectedWallet();
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    if (
      !selectedWallet?.publicKey ||
      selectedWallet?.network !== Network.Teritori
    ) {
      return;
    }
    setQuests([]);
    const stream = backendClient.Quests({
      limit: 100,
      offset: 0,
      userId: `tori-${selectedWallet?.publicKey}`,
    });
    stream.forEach(({ quest }) => {
      if (!quest) {
        return;
      }
      setQuests((qs) => [...qs, quest]);
    });
  }, [selectedWallet?.publicKey, selectedWallet?.network]);

  const questCardStyle = {
    marginTop: 20,
    marginRight: 16,
  };

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          label={quest.title}
          style={questCardStyle}
          completed={quest.completed}
        />
      ))}
    </View>
  );
};
