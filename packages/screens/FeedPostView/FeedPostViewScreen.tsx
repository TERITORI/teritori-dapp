import React from "react";
import { ActivityIndicator } from "react-native";

import { FeedPostArticleView } from "./components/FeedPostArticleView";
import { FeedPostDefaultView } from "./components/FeedPostDefaultView";
import { FeedPostVideoView } from "./components/FeedPostVideoView";
import { BrandText } from "../../components/BrandText";
import { NotFound } from "../../components/NotFound";
import { ScreenContainer } from "../../components/ScreenContainer";
import {
  PostCategory,
  ReplyToType,
} from "../../components/socialFeed/NewsFeed/NewsFeed.type";
import { usePost } from "../../hooks/feed/usePost";
import { parseNetworkObjectId } from "../../networks";
import { gnoTeritoriNetwork } from "../../networks/gno-teritori";
import { teritoriNetwork } from "../../networks/teritori";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { primaryColor } from "../../utils/style/colors";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export type OnPressReplyType = (replyTo: ReplyToType) => void;

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  let [network, postId] = parseNetworkObjectId(id);
  if (!network) {
    // fallback to teritori or gno network if there is no network prefix in the id
    if (id.includes("-")) {
      // teritori ids are uuids
      network = teritoriNetwork;
      postId = id;
    } else {
      // gno ids are integers
      network = gnoTeritoriNetwork;
      postId = id;
    }
  }
  const networkId = network?.id;
  const { post, isLoading, refetch } = usePost(postId, networkId);
  const label = post?.category === PostCategory.Video ? "Video" : "Post";

  if (isLoading) {
    return (
      <ScreenContainer
        forceNetworkId={networkId}
        fullWidth
        responsive
        noMargin
        headerChildren={
          <BrandText style={fontSemibold20}>Loading {label}</BrandText>
        }
        onBackPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("Feed")
        }
        footerChildren
        noScroll
      >
        <ActivityIndicator
          color={primaryColor}
          size="large"
          style={{ marginTop: layout.spacing_x4 }}
        />
      </ScreenContainer>
    );
  }

  if (!post) {
    return (
      <ScreenContainer
        forceNetworkId={networkId}
        fullWidth
        responsive
        noMargin
        headerChildren={
          <BrandText style={fontSemibold20}>{label} not found</BrandText>
        }
        onBackPress={() =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("Feed")
        }
        footerChildren
        noScroll
      >
        <NotFound label={label} />
      </ScreenContainer>
    );
  }

  if (post.category === PostCategory.Video) {
    return (
      <FeedPostVideoView
        networkId={networkId}
        post={post}
        refetchPost={refetch}
      />
    );
  } else if (post.category === PostCategory.Article) {
    return (
      <FeedPostArticleView
        networkId={networkId}
        post={post}
        refetchPost={refetch}
        isLoadingPost={isLoading}
      />
    );
  } else
    return (
      <FeedPostDefaultView
        networkId={networkId}
        post={post}
        isLoadingPost={isLoading}
        refetchPost={refetch}
      />
    );
};
