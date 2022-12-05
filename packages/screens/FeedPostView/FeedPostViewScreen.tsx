import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { BrandText } from "../../components/BrandText";
import { NewsFeedInput } from "../../components/NewsFeed/NewsFeedInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SocialThreadCard } from "../../components/cards/SocialThreadCard";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id },
  },
}) => {
  const wallet = useSelectedWallet();
  const [refresh, setRefresh] = useState(0);
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
          <NewsFeedInput
            type="comment"
            parentId={id}
            onSubmitSuccess={() => setRefresh((prev) => prev + 1)}
          />
        </View>
      }
    >
      <View
        style={{
          paddingTop: layout.contentPadding,
        }}
      >
        {!!post && (
          <SocialThreadCard post={post} singleView refresh={refresh} />
        )}
      </View>
    </ScreenContainer>
  );
};
