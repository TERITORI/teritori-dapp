import React, { useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { Reaction } from "../../../api/feed/v1/feed";
import { layout } from "../../../utils/style/layout";
import { SocialStat } from "../SocialStat";
import { MoreReactionsButton } from "./MoreReactionsButton";
import { MoreReactionsMenu } from "./MoreReactionsMenu";

// TODO: (Responsive) Adapt this, depending on breakpoints
export const NB_REACTIONS_SHOWN = 10;

export const Reactions: React.FC<{
  reactions: Reaction[];
  onPressReaction: (icon: string) => void;
  isLoading?: boolean;
}> = ({ reactions = [], onPressReaction}) => {
  // const reactionWidthRef = useRef<number>();
  // const reactionAnimation = useAnimatedStyle(
  //   () => ({
  //     width: isLoading
  //       ? withTiming(30)
  //       : reactionWidthRef?.current
  //       ? withTiming(reactionWidthRef?.current)
  //       : undefined,
  //   }),
  //   [isLoading]
  // );
  const [isMoreReactionShown, setMoreReactionsShown] = useState(false);
  const sortedReactions = useMemo(
    () => reactions.sort((a, b) => b.count - a.count),
    [reactions]
  );
  const shownReactions = useMemo(
    () => sortedReactions.slice(0, NB_REACTIONS_SHOWN),
    [sortedReactions]
  );
  const hiddenReactions = useMemo(
    () => sortedReactions.slice(NB_REACTIONS_SHOWN, -1),
    [sortedReactions]
  );
  const moreReactionsButtonLabel = useMemo(
    () => (isMoreReactionShown ? "Hide" : `+ ${hiddenReactions.length}`),
    [hiddenReactions, isMoreReactionShown]
  );

  return (
    // TODO: Remove animation stuff from this cpt. We'll fix animations later
    // <Animated.View
    //   style={[
    //     { flexDirection: "row", alignItems: "center" },
    //     reactionAnimation,
    //   ]}
    // >
    <View style={[{ flexDirection: "row", alignItems: "center" }]}>
      {/*{isLoading && (*/}
      {/*  <AnimationFadeIn>*/}
      {/*    <ActivityIndicator color={secondaryColor} />*/}
      {/*  </AnimationFadeIn>*/}
      {/*)}*/}
      {!!reactions.length && (
        <>
          {/* <AnimationFadeInOut*/}
          {/*visible={!isLoading}*/}
          {/*  style={{*/}
          {/*    paddingHorizontal: layout.padding_x0_5,*/}
          {/*    flexDirection: "row",*/}
          {/*    alignItems: "center",*/}
          {/* }}*/}
          {/*  onLayout={(e) => {*/}
          {/*    reactionWidthRef.current = e.nativeEvent.layout.width;*/}
          {/*   }}*/}
          {/* >*/}
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
            keyExtractor={(reaction: Reaction) => reaction.icon}
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
          {/*</AnimationFadeInOut>*/}
        </>
      )}
    </View>
  );
};
