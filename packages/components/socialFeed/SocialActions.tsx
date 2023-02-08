import React, { useState } from "react";
import { useWindowDimensions, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import governanceCircleSVG from "../../../assets/icons/governance-circle.svg";
import addThreadSVG from "../../../assets/icons/social-threads/add-thread.svg";
import chatSVG from "../../../assets/icons/social-threads/chat.svg";
import tipSVG from "../../../assets/icons/tip.svg";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { socialFeedBreakpointXL } from "../../screens/Feed/FeedScreen";
import { useAppNavigation } from "../../utils/navigation";
import {
  additionalGreen,
  neutral00,
  neutral11,
  neutral22,
  neutral44,
  orangeDefault,
  redDefault,
} from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SpacerRow } from "../spacer";
import { SocialReactionActions } from "./SocialReactionActions/SocialReactionActions";

export const socialActionsHeight = 64;
export const SocialActions: React.FC<{
  isGovernance?: boolean;
  isTippable: boolean;
  style?: ViewStyle;
  singleView?: boolean;
  post: PostResult;
  onPressTip?: () => void;
  onPressReaction: (icon: string) => void;
  isReactionLoading?: boolean;
}> = ({
  style,
  isGovernance,
  isTippable,
  singleView,
  post,
  onPressTip,
  onPressReaction,
  isReactionLoading,
}) => {
  // variables
  const navigation = useAppNavigation();
  const { width: windowWidth } = useWindowDimensions();
  const [isGovernanceAction, setGovernanceAction] = useState(false);

  // returns
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "82%",
          height: socialActionsHeight,
          backgroundColor: neutral11,
          paddingHorizontal: 14,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: neutral22,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        {/*==== Comments button and counts*/}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FeedPostView", { id: post.identifier })
          }
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <SVG
            source={chatSVG}
            height={20}
            width={20}
            style={{ marginRight: layout.padding_x1_5 }}
          />
          <BrandText style={fontSemibold14}>{post.sub_post_length}</BrandText>
        </TouchableOpacity>

        {/*==== Tips button and counts*/}
        {isTippable && (
          <>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                zIndex: 9,
                marginLeft: layout.padding_x2,
              }}
              onPress={onPressTip}
            >
              <SVG source={tipSVG} width={20} height={20} />
              <SpacerRow size={1.5} />
              <BrandText style={fontSemibold14}>Tip</BrandText>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/*==== Governance*/}
      {isGovernance && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: layout.padding_x1_5,
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: 32 }}
            activeOpacity={0.8}
            onPress={() => setGovernanceAction((prev) => !prev)}
          >
            <SVG source={governanceCircleSVG} height={36} width={36} />
          </TouchableOpacity>
          {isGovernanceAction && (
            <View style={{ flexDirection: "row" }}>
              <SecondaryButton
                text="Yes!"
                size="SM"
                backgroundColor={additionalGreen}
                textStyle={{ color: neutral00 }}
              />
              <SecondaryButton
                text="No!"
                size="SM"
                backgroundColor={orangeDefault}
                style={{ marginHorizontal: 14 }}
                textStyle={{ color: neutral00 }}
              />
              <SecondaryButton
                text="NoWithVeto!"
                size="SM"
                backgroundColor={redDefault}
                textStyle={{ color: neutral00 }}
              />
              <SecondaryButton
                text="Abstain"
                size="SM"
                backgroundColor={neutral44}
                style={{ marginHorizontal: 14 }}
                textStyle={{ color: neutral00 }}
              />
            </View>
          )}
        </View>
      )}

      {/*==== Large additional comments button*/}
      {/*TODO: Better responsive. What to do for this button ?*/}
      {!singleView &&
        !isGovernanceAction &&
        windowWidth >= socialFeedBreakpointXL && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() =>
                navigation.navigate("FeedPostView", { id: post.identifier })
              }
            >
              <SVG
                source={addThreadSVG}
                height={20}
                width={20}
                style={{ marginRight: layout.padding_x1_5 }}
              />
              <BrandText style={fontSemibold14}>Open the threads</BrandText>
            </TouchableOpacity>
          </View>
        )}

      {/*==== Reactions (emojis,...)*/}
      {!isGovernanceAction && (
        <SocialReactionActions
          style={{ flex: 1.5 }}
          isTippable={isTippable}
          onPressTip={onPressTip}
          reactions={post.reactions}
          onPressReaction={onPressReaction}
          isReactionLoading={isReactionLoading}
          postId={post.identifier}
        />
      )}
    </View>
  );
};
