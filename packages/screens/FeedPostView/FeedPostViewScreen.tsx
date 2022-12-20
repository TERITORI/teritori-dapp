import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { socialFeedClient } from "../../client-creators/socialFeedClient";
import { NewsFeedInput } from "../../components/NewsFeed/NewsFeedInput";
import { ScreenContainer } from "../../components/ScreenContainer";
import { SocialThreadCard } from "../../components/cards/SocialThreadCard";
import { BackTo } from "../../components/navigation/BackTo";
import { PostResult } from "../../contracts-clients/teritori-social-feed/TeritoriSocialFeed.types";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { ScreenFC } from "../../utils/navigation";
import { secondaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id },
  },
}) => {
  const wallet = useSelectedWallet();
  const [refresh, setRefresh] = useState(0);
  const { triggerError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<PostResult>();

  const fetchPost = async () => {
    if (!wallet?.connected || !wallet.address) {
      return;
    }
    try {
      setIsLoading(true);
      const client = await socialFeedClient({
        walletAddress: wallet.address,
      });
      const _post = await client.queryPost({ identifier: id });
      setPost(_post);
    } catch (error) {
      triggerError({ error });
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPost();
    }, [wallet?.connected])
  );

  return (
    <ScreenContainer
      responsive
      headerChildren={<BackTo label="Feed" />}
      footerChildren
      fullWidth
      fixedFooterChildren={
        <View
          style={{
            marginBottom: layout.padding_x2,
            marginHorizontal: layout.contentPadding,
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
          paddingHorizontal: layout.contentPadding,
        }}
      >
        {isLoading && <ActivityIndicator size="small" color={secondaryColor} />}
        {!!post && (
          <SocialThreadCard post={post} singleView refresh={refresh} />
        )}
      </View>
    </ScreenContainer>
  );
};
