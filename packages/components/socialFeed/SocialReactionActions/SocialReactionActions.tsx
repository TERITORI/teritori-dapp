import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  PostResult,
  Reaction,
} from "../../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { neutral33, secondaryColor } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { EmojiSelector } from "../../EmojiSelector";
import { AnimationFadeIn } from "../../animations";
import { AnimationFadeInOut } from "../../animations/AnimationFadeInOut";
import { FeedPostShareModal } from "../../modals/FeedPostShareModal";
import { SocialStat } from "../SocialStat";
import { MoreReactionsButton } from "./MoreReactionsButton";
import { MoreReactionsMenu } from "./MoreReactionsMenu";

interface SocialReactionActionsProps {
  reactions: PostResult["reactions"];
  isTippable: boolean;
  postId: string;
  isComment?: boolean;
  commentCount?: number;
  onPressReply?: () => void;
  onPressTip?: () => void;
  onPressReaction: (icon: string) => void;
  isReactionLoading?: boolean;
  showEmojiSelector?: boolean;
  style?: StyleProp<ViewStyle>;
}

// TODO: (Responsive) Adapt this, depending on breakpoints
export const nbReactionsShown = 3;

export const SectionDivider = () => (
  <View style={styles.sectionDivider}>
    <View style={styles.separator} />
  </View>
);

export const SocialReactionActions: React.FC<SocialReactionActionsProps> = ({
  reactions,
  onPressReaction,
  isReactionLoading,
  showEmojiSelector,
  postId,
  style,
}) => {
  // variables
  const reactionWidthRef = useRef<number>();
  const [isMoreReactionShown, setMoreReactionsShown] = useState(false);

  // animation
  const reactionAnimation = useAnimatedStyle(
    () => ({
      width: isReactionLoading
        ? withTiming(30)
        : reactionWidthRef?.current
        ? withTiming(reactionWidthRef?.current)
        : undefined,
    }),
    [isReactionLoading]
  );
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

  // returns
  return (
    <>
      {/*==== Emoji List*/}
      <Animated.View
        style={[
          styles.rowCenter,
          reactionAnimation,
          { justifyContent: "flex-end" },
          style,
        ]}
      >
        {isReactionLoading && (
          <AnimationFadeIn>
            <ActivityIndicator color={secondaryColor} />
          </AnimationFadeIn>
        )}
        {!!reactions.length && (
          <>
            <AnimationFadeInOut
              visible={!isReactionLoading}
              style={[
                styles.rowCenter,
                { paddingHorizontal: layout.padding_x0_5 },
              ]}
              onLayout={(e) => {
                reactionWidthRef.current = e.nativeEvent.layout.width;
              }}
            >
              <FlatList
                scrollEnabled
                data={shownReactions}
                contentContainerStyle={[
                  styles.rowCenter,
                  { justifyContent: "flex-end" },
                ]}
                horizontal
                showsHorizontalScrollIndicator={false}
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
                  onPressReaction={(reactionIcon) =>
                    onPressReaction(reactionIcon)
                  }
                  onPressMore={() => setMoreReactionsShown((shown) => !shown)}
                />
              )}
            </AnimationFadeInOut>
          </>
        )}
      </Animated.View>

      {/*==== Emoji Selector*/}
      {showEmojiSelector && (
        <>
          <SectionDivider />
          <EmojiSelector
            onEmojiSelected={onPressReaction}
            isLoading={isReactionLoading}
          />
          <SectionDivider />
          <FeedPostShareModal postId={postId} />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  rowCenter: { flexDirection: "row", alignItems: "center" },
  sectionDivider: {
    paddingHorizontal: layout.padding_x2,
  },
  separator: { height: 18, width: 1, backgroundColor: neutral33 },
  replyIconContainer: {
    borderWidth: 1.2,
    borderColor: secondaryColor,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
