import React, { useMemo, useRef, useState } from "react";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { Reaction } from "../../../api/feed/v1/feed";
import { secondaryColor } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { AnimationFadeIn } from "../../animations";
import { AnimationFadeInOut } from "../../animations/AnimationFadeInOut";
import { SocialStat } from "../SocialStat";
import { MoreReactionsButton } from "./MoreReactionsButton";
import { MoreReactionsMenu } from "./MoreReactionsMenu";

// TODO: (Responsive) Adapt this, depending on breakpoints
export const nbReactionsShown = 3;

export const Reactions: React.FC<{
  reactions: Reaction[];
  onPressReaction: (icon: string) => void;
  isLoading?: boolean;
}> = ({ reactions = [], onPressReaction, isLoading }) => {
  const reactionWidthRef = useRef<number>();
  const reactionAnimation = useAnimatedStyle(
    () => ({
      width: isLoading
        ? withTiming(30)
        : reactionWidthRef?.current
        ? withTiming(reactionWidthRef?.current)
        : undefined,
    }),
    [isLoading]
  );
  const [isMoreReactionShown, setMoreReactionsShown] = useState(false);
  const sortedReactions = useMemo(
    () => reactions.sort((a, b) => b.count - a.count),
    [reactions]
  );
  const shownReactions = useMemo(
    () => sortedReactions.slice(0, nbReactionsShown),
    [sortedReactions]
  );
  const hiddenReactions = useMemo(
    () => sortedReactions.slice(nbReactionsShown, -1),
    [sortedReactions]
  );
  const moreReactionsButtonLabel = useMemo(
    () => (isMoreReactionShown ? "Hide" : `+ ${hiddenReactions.length}`),
    [hiddenReactions, isMoreReactionShown]
  );

  return (
    <Animated.View
      style={[
        { flexDirection: "row", alignItems: "center" },
        reactionAnimation,
      ]}
    >
      {isLoading && (
        <AnimationFadeIn>
          <ActivityIndicator color={secondaryColor} />
        </AnimationFadeIn>
      )}
      {!!reactions.length && (
        <AnimationFadeInOut
          visible={!isLoading}
          style={{
            paddingHorizontal: layout.padding_x0_5,
            flexDirection: "row",
            alignItems: "center",
          }}
          onLayout={(e) => {
            reactionWidthRef.current = e.nativeEvent.layout.width;
          }}
        >
          <FlatList
            scrollEnabled
            data={shownReactions}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
            renderItem={({ item: reaction, index }) => (
              <SocialStat
                key={index}
                label={String(reaction.count)}
                emoji={reaction.icon}
                onPress={() => onPressReaction(reaction.icon)}
                style={{ marginHorizontal: layout.padding_x0_25 }}
              />
            )}
            keyExtractor={(reaction: Reaction) => String(reaction.icon)}
          />

          {!!hiddenReactions.length && (
            <MoreReactionsButton
              label={moreReactionsButtonLabel}
              style={{ marginHorizontal: layout.padding_x0_25 }}
              onPress={() => setMoreReactionsShown((shown) => !shown)}
            />
          )}

          {/*TODO: This menu is under others SocialReactActions due to his DOM level. We need a proper "absolute menus handling (and close the opened one by clicking outside)"*/}
          {!!hiddenReactions.length && isMoreReactionShown && (
            <MoreReactionsMenu
              moreReactionsButtonLabel={moreReactionsButtonLabel}
              sortedReactions={sortedReactions}
              onPressReaction={(reactionIcon) => onPressReaction(reactionIcon)}
              onPressMore={() => setMoreReactionsShown((shown) => !shown)}
            />
          )}
        </AnimationFadeInOut>
      )}
    </Animated.View>
  );
};
