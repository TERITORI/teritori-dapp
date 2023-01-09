import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";

import { Quest } from "../api/marketplace/v1/marketplace";
import { useBackendClient } from "../hooks/useBackendClient";
import { QuestCard } from "./cards/QuestCard";
export const Quests: React.FC<{
  userId?: string;
}> = ({ userId }) => {
  const { backendClient, isForceBackendMainnet } = useBackendClient();

  const { data: quests = [] } = useQuery(
    ["quests", userId, isForceBackendMainnet()],
    async () => {
      try {
        const quests: Quest[] = [];

        const stream = backendClient.Quests({
          limit: 100,
          offset: 0,
          userId,
        });
        await stream.forEach(({ quest }) => {
          if (!quest) {
            return;
          }
          // nfts.push(response.nft);
          quests.push(quest);
          // setQuests((qs) => [...qs, quest]);
        });
        return quests;
      } catch (err) {
        console.error(err);
      }
    },
    { initialData: [] }
  );

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
