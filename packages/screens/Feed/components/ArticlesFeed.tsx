import React, { FC, memo } from "react";

import { FeedHeader } from "./FeedHeader";
import { PostsRequest } from "../../../api/feed/v1/feed";
import { MobileTitle } from "../../../components/ScreenContainer/ScreenContainerMobile";
import { NewsFeed } from "../../../components/socialFeed/NewsFeed/NewsFeed";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const ArticlesFeed: FC = memo(() => {
  const isMobile = useIsMobile();
  const feedRequest: Partial<PostsRequest> = {
    filter: {
      categories: [PostCategory.Article],
      user: "",
      mentions: [],
      hashtags: [],
    },
    limit: 10,
    offset: 0,
  };

  return (
    <NewsFeed
      req={feedRequest}
      Header={() => (
        <>
          {/* ScreenContainer in FeedScreen has noScroll, so we need to add MobileTitle here */}
          {isMobile && <MobileTitle title="SOCIAL FEED" />}
          <FeedHeader selectedTab="articles" />
        </>
      )}
    />
  );
});
