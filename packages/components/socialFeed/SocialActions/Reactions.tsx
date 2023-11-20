import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { MoreReactionsButton } from "./MoreReactionsButton";
import { MoreReactionsMenu } from "./MoreReactionsMenu";
import { Reaction } from "../../../api/feed/v1/feed";
import { SocialStat } from "../SocialStat";

const DEFAULT_NB_EMOJI_SHOWN = 6;

export const Reactions: React.FC<{
  reactions: Reaction[];
  onPressReaction: (icon: string) => void;
  isLoading?: boolean;
  nbShown?: number;
}> = ({
  reactions = [],
  onPressReaction,
  nbShown = DEFAULT_NB_EMOJI_SHOWN,
}) => {
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
    [reactions],
  );
  const shownReactions = useMemo(
    () => sortedReactions.slice(0, nbShown),
    [sortedReactions, nbShown],
  );
  const hiddenReactions = useMemo(
    () => sortedReactions.slice(nbShown, -1),
    [sortedReactions, nbShown],
  );
  const moreReactionsButtonLabel = useMemo(
    () => (isMoreReactionShown ? "Hide" : `+ ${hiddenReactions.length}`),
    [hiddenReactions, isMoreReactionShown],
  );

  return (
    // TODO: Rework animations
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
          {/*    paddingHorizontal: layout.spacing_x0_5,*/}
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
              />
            )}
            keyExtractor={(reaction: Reaction) => reaction.icon}
          />

          {!!hiddenReactions.length && (
            <MoreReactionsButton
              label={moreReactionsButtonLabel}
              onPress={() => setMoreReactionsShown((shown) => !shown)}
            />
          )}

          {/*TODO: This menu is under others SocialReactActions due to his DOM level. We need a proper "absolute menus handling (and close the opened one by clicking outside)"*/}
          {!!hiddenReactions.length && isMoreReactionShown && (
            <MoreReactionsMenu
              nbShown={nbShown}
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

// Number of SocialStat displayed depending on a width (A Social Card width)
export const nbReactionsShown = (viewWidth: number) => {
  if (viewWidth >= 650) return DEFAULT_NB_EMOJI_SHOWN;
  else if (viewWidth >= 600) return 5;
  else if (viewWidth >= 580) return 4;
  else return 3;
};
