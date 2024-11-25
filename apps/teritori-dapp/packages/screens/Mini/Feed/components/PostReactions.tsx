import React, { useMemo } from "react";
import { FlatList, View } from "react-native";

import { Reaction } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type Props = {
  reactions: Reaction[];
  onPressReaction?: (icon: string) => void;
  isLoading?: boolean;
};

const numberOfReactionsToShow = 4;

export const PostReactions = ({
  onPressReaction,
  reactions,
  isLoading,
}: Props) => {
  const sortedReactions = useMemo(
    () => reactions.sort((a, b) => b.count - a.count),
    [reactions],
  );

  const shownReactions = sortedReactions.slice(0, numberOfReactionsToShow);

  const renderEmoji = ({ item: reaction }: { item: Reaction }) => {
    return (
      <CustomPressable
        onPress={() => onPressReaction && onPressReaction(reaction.icon)}
      >
        <BrandText style={[fontSemibold13, {}]}>
          {reaction.icon}
          {reaction.count}
        </BrandText>
      </CustomPressable>
    );
  };

  return (
    <View>
      <FlatList
        horizontal
        data={shownReactions}
        renderItem={renderEmoji}
        keyExtractor={(item, index) => item.icon}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: layout.spacing_x0_75,
        }}
      />
    </View>
  );
};
