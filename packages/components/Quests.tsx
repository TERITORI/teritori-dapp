import { useQuery } from "@tanstack/react-query";
import React from "react";
import { View } from "react-native";

import { QuestCard } from "./cards/QuestCard";
import { Quest } from "../api/marketplace/v1/marketplace";
import { parseUserId } from "../networks";
import { getMarketplaceClient } from "../utils/backend";

export const Quests: React.FC<{
  userId: string | undefined;
}> = ({ userId }) => {
  const { data: quests } = useQuests(userId);

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
      {(quests || []).map((quest) => (
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

const useQuests = (userId: string | undefined) => {
  return useQuery(
    ["quests", userId],
    async () => {
      const [network] = parseUserId(userId);
      const backendClient = getMarketplaceClient(network?.id);
      if (!backendClient) {
        return [];
      }
      const stream = backendClient.Quests({
        limit: 100,
        offset: 0,
        userId,
      });
      const quests: Quest[] = [];
      await stream.forEach(({ quest }) => {
        if (!quest) {
          return;
        }
        quests.push(quest);
      });
      return quests;
    },
    { staleTime: Infinity },
  );
};
