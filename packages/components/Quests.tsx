import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { QuestCard } from "./cards/QuestCard";
import { Quest } from "../api/marketplace/v1/marketplace";
import { parseNetworkObjectId } from "../networks";
import { mustGetMarketplaceClient } from "../utils/backend";
export const Quests: React.FC<{
  userId?: string;
}> = ({ userId }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [network] = parseNetworkObjectId(userId);

  useEffect(() => {
    try {
      setQuests([]);
      const backendClient = mustGetMarketplaceClient(network?.id);
      const stream = backendClient.Quests({
        limit: 100,
        offset: 0,
        userId,
      });
      stream.forEach(({ quest }) => {
        if (!quest) {
          return;
        }
        setQuests((qs) => [...qs, quest]);
      });
    } catch (err) {
      console.warn("failed to fetch quests", err);
    }
  }, [network?.id, userId]);

  const questCardStyle = {
    marginTop: 20,
    marginRight: 16,
  };

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: -20,
        marginRight: -16,
      }}
    >
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
