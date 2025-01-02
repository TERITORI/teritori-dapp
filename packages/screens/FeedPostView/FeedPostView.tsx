import React from "react";
import { ActivityIndicator } from "react-native";

import { FeedPostArticleView } from "./components/FeedPostArticleView";
import { FeedPostDefaultView } from "./components/FeedPostDefaultView";
import { FeedPostVideoView } from "./components/FeedPostVideoView";

import { NotFound } from "@/components/NotFound";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { usePost } from "@/hooks/feed/usePost";
import { parseNetworkObjectId } from "@/networks";
import { FeedPostArticleMarkdownView } from "@/screens/FeedPostView/components/FeedPostArticleMarkdownView";
import { convertLegacyPostId } from "@/utils/feed/queries";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { primaryColor } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { PostCategory } from "@/utils/types/feed";

export const FeedPostView: ScreenFC<"FeedPostView"> = ({
  route: {
    params: { id: idParam },
  },
}) => {
  const id = convertLegacyPostId(idParam);
  const navigation = useAppNavigation();
  const [network] = parseNetworkObjectId(idParam);
  const { post, isLoading, refetch } = usePost(id);
  const label: string =
    post?.category === PostCategory.Video ? "Video" : "Post";

  if (isLoading) {
    return (
      <ScreenContainer
        forceNetworkId={network?.id}
        fullWidth
        responsive
        noMargin
        headerChildren={<ScreenTitle>Loading {label}</ScreenTitle>}
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
        forceNetworkId={network?.id}
        fullWidth
        responsive
        noMargin
        headerChildren={<ScreenTitle>{label} not found</ScreenTitle>}
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
    return <FeedPostVideoView post={post} refetchPost={refetch} />;
  } else if (post.category === PostCategory.ArticleMarkdown) {
    return (
      <FeedPostArticleMarkdownView
        post={post}
        refetchPost={refetch}
        isLoadingPost={isLoading}
      />
    );
  } else if (post.category === PostCategory.Article) {
    return (
      <FeedPostArticleView
        post={post}
        refetchPost={refetch}
        isLoadingPost={isLoading}
      />
    );
  } else
    return (
      <FeedPostDefaultView
        post={post}
        isLoadingPost={isLoading}
        refetchPost={refetch}
      />
    );
};
