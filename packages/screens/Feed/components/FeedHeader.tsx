import { cloneDeep } from "lodash";
import React, { useMemo } from "react";

import { PostsRequest } from "../../../api/feed/v1/feed";
import { BrandText } from "../../../components/BrandText";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { SpacerColumn } from "../../../components/spacer";
import { Tabs } from "../../../components/tabs/Tabs";
import { useIsDAOMember } from "../../../hooks/dao/useDAOMember";
import { useFetchFeed } from "../../../hooks/feed/useFetchFeed";
import { useMaxResolution } from "../../../hooks/useMaxResolution";
import { useSelectedNetworkInfo } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { getUserId, NetworkKind, parseUserId } from "../../../networks";
import { useAppNavigation } from "../../../utils/navigation";
import { feedsTabItems } from "../../../utils/social-feed";
import { primaryColor } from "../../../utils/style/colors";
import { fontSemibold16 } from "../../../utils/style/fonts";

type FeedHeaderProps = {
  selectedTab: keyof typeof feedsTabItems;
};

export const FeedHeader: React.FC<FeedHeaderProps> = ({ selectedTab }) => {
  const { width } = useMaxResolution();
  const navigation = useAppNavigation();
  const selectedNetworkInfo = useSelectedNetworkInfo();
  const selectedNetworkKind = selectedNetworkInfo?.kind;
  const selectedWallet = useSelectedWallet();
  const isModerationDAOMember = useIsModerationDAOMember(
    selectedWallet?.userId,
  );

  const req: Partial<PostsRequest> = {
    filter: {
      categories: [PostCategory.Flagged],
      user: "",
      mentions: [],
      hashtags: [],
    },
    limit: 1,
    offset: 0,
    queryUserId: selectedWallet?.userId,
  };
  const { data } = useFetchFeed(req);

  const hasFlaggedPosts = useMemo(() => {
    return (data?.pages?.[0]?.totalCount || 0) > 0;
  }, [data]);

  const adjustedTabItems = useMemo(() => {
    const res = cloneDeep(feedsTabItems);

    if (
      selectedNetworkKind === NetworkKind.Gno &&
      res.moderationDAO &&
      !hasFlaggedPosts
    ) {
      res.moderationDAO.iconSVG = null;
    }

    if (selectedNetworkKind !== NetworkKind.Gno || !isModerationDAOMember) {
      delete res["moderationDAO"];
    }

    delete res["videoNotes"];
    delete res["sounds"];
    return res;
  }, [hasFlaggedPosts, isModerationDAOMember, selectedNetworkKind]);

  return (
    <>
      <Tabs
        items={adjustedTabItems}
        selected={selectedTab}
        onSelect={(key) => {
          navigation.navigate("Feed", { tab: key });
        }}
        style={{
          alignSelf: "center",
          height: 64,
          zIndex: 9,
          elevation: 9,
          width,
        }}
        borderColorTabSelected={primaryColor}
        gradientText
        tabTextStyle={fontSemibold16}
        tabContainerStyle={{ height: 64 }}
      />

      <SpacerColumn size={1.5} />

      {selectedTab === "moderationDAO" && (
        <BrandText style={{ alignSelf: "flex-start" }}>
          {hasFlaggedPosts
            ? "Please review all applications carefully and give your verdict."
            : "There are no items to moderate yet."}
        </BrandText>
      )}
    </>
  );
};

const useIsModerationDAOMember = (userId: string | undefined) => {
  const [network] = parseUserId(userId);
  let daoId;
  switch (network?.kind) {
    case NetworkKind.Gno:
      daoId = getUserId(network.id, network.socialFeedsDAOPkgPath);
  }
  return useIsDAOMember(daoId, userId);
};
