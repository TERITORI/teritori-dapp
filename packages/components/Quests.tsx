import { useQuery } from "@tanstack/react-query";
import React from "react";

import { QuestCard } from "./cards/QuestCard";
import { GridList } from "./layout/GridList";
import { Quest } from "../api/marketplace/v1/marketplace";
import { parseUserId } from "../networks";
import { getMarketplaceClient } from "../utils/backend";
import { layout } from "../utils/style/layout";

export const Quests: React.FC<{
  userId: string | undefined;
}> = ({ userId }) => {
  const { data: quests } = useQuests(userId);
  return (
    <GridList<Quest>
      renderItem={({ item: quest }, elemWidth) => {
        return (
          <QuestCard
            key={quest.id}
            label={quest.title}
            width={elemWidth}
            completed={quest.completed}
          />
        );
      }}
      data={quests || []}
      minElemWidth={140}
      gap={layout.spacing_x1}
      keyExtractor={(item) => item.id}
      noFixedHeight
    />
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
