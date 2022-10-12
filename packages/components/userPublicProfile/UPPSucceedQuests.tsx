import React from "react";
import { View } from "react-native";

import { fakeQuests } from "../../utils/fakeData/userPublicProfile";
import { layout } from "../../utils/style/layout";
import { QuestCard } from "../cards/QuestCard";

export const UPPSucceedQuests: React.FC = () => {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {fakeQuests.map((quest, index) => (
        <QuestCard
          quest={quest}
          style={{ margin: layout.padding_x2_5 / 2 }}
          key={index}
        />
      ))}
    </View>
  );
};
