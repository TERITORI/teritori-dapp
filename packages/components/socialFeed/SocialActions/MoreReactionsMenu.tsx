import React from "react";
import { View } from "react-native";

import { Reaction } from "../../../api/feed/v1/feed";
import { neutral15, neutral22 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { SocialStat } from "../SocialStat";
import { MoreReactionsButton } from "./MoreReactionsButton";

export const MoreReactionsMenu: React.FC<{
  sortedReactions: Reaction[];
  onPressReaction: (icon: string) => void;
  onPressMore: () => void;
  moreReactionsButtonLabel: string;
  nbShown: number;
}> = ({
  sortedReactions,
  onPressReaction,
  moreReactionsButtonLabel,
  onPressMore,
  nbShown,
}) => {
  return (
    <View
      style={{
        backgroundColor: neutral15,
        borderColor: neutral22,
        borderWidth: 1,
        padding: layout.padding_x0_25,
        borderRadius: 12,
        flexDirection: "row",
        flexWrap: "wrap",
        position: "absolute",
        left: -3,
        right: -3,
        top: -layout.padding_x0_5 - 1,
        zIndex: -1,
      }}
    >
      {sortedReactions.map((reaction, index) =>
        index === nbShown ? (
          <MoreReactionsButton
            key={index}
            label={moreReactionsButtonLabel}
            onPress={onPressMore}
            style={{
              marginHorizontal: layout.padding_x0_25,
              marginVertical: layout.padding_x0_25,
            }}
          />
        ) : (
          <SocialStat
            key={index}
            style={{
              marginHorizontal: layout.padding_x0_25,
              marginVertical: layout.padding_x0_25,
            }}
            label={String(reaction.count)}
            emoji={reaction.icon}
            onPress={() => onPressReaction(reaction.icon)}
          />
        )
      )}
    </View>
  );
};
