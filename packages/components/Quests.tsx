import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { Quest } from "../api/marketplace/v1/marketplace";
import { backendClient } from "../utils/backend";
import { QuestCard } from "./cards/QuestCard";

export const Quests: React.FC<{
  userAddress?: string;
}> = ({ userAddress }) => {
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    setQuests([]);
    const stream = backendClient.Quests({
      limit: 100,
      offset: 0,
      userId: `tori-${userAddress}`,
    });
    stream.forEach(({ quest }) => {
      if (!quest) {
        return;
      }
      setQuests((qs) => [...qs, quest]);
    });
  }, [userAddress]);

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
