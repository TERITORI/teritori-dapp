import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { BrandText } from "../../components/BrandText";
import { CommentInput } from "../../components/NewsFeed/CommentInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SocialThreadCard } from "../../components/cards/SocialThreadCard";
import { screenTitle } from "../../components/navigation/Navigator";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

const COMMENT_COST = 0.1;

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  const wallet = useSelectedWallet();
  const [post, setPost] = useState<PostResult>();

  const fetchPost = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }

    const client = await socialFeedClient({
      walletAddress: wallet.address,
    });
    const _post = await client.queryPost({ identifier: id });
    setPost(_post);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPost();
      navigation.setOptions({
        title: screenTitle("GNOPUNKS"),
      });
    }, [wallet?.connected])
  );

  return (
    <ScreenContainer
      smallMargin
      responsive
      headerChildren={<BrandText style={fontSemibold20} />}
      footerChildren
      fixedFooterChildren={
        <View
          style={{
            marginBottom: layout.padding_x2,
          }}
        >
          <CommentInput
            placeholder="Hey yo! Write your comment here!_____"
            footerText={[`The cost for comment is ${COMMENT_COST} Tori`]}
            buttonText="Comment"
          />
        </View>
      }
    >
      <View
        style={{
          paddingTop: layout.contentPadding,
        }}
      >
        {!!post && <SocialThreadCard post={post} singleView />}
      </View>
    </ScreenContainer>
  );
};
