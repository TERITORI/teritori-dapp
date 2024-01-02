import React from "react";
import { View } from "react-native";

import { MoreReactionsButton } from "./MoreReactionsButton";
import { Reaction } from "../../../api/feed/v1/feed";
import { neutral15, neutral22 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { SocialStat } from "../SocialStat";

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
        padding: layout.spacing_x0_25,
        borderRadius: 12,
        flexDirection: "row",
        flexWrap: "wrap",
        position: "absolute",
        left: -3,
        right: -3,
        top: -1,
        zIndex: -1,
      }}
    >
      {sortedReactions.map((reaction, index) =>
        index === nbShown ? (
          <MoreReactionsButton
            key={index}
            label={moreReactionsButtonLabel}
            onPress={onPressMore}
          />
        ) : (
          <SocialStat
            key={index}
            label={String(reaction.count)}
            emoji={reaction.icon}
            onPress={() => onPressReaction(reaction.icon)}
          />
        ),
      )}
    </View>
  );
};
