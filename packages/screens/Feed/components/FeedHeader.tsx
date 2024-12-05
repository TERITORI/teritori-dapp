import { cloneDeep } from "lodash";
import React, { useMemo } from "react";
import { View } from "react-native";

import useSelectedWallet from "../../../hooks/useSelectedWallet";

import { PostsRequest } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { SpacerColumn } from "@/components/spacer";
import { Tabs } from "@/components/tabs/Tabs";
import { useIsDAOMember } from "@/hooks/dao/useDAOMember";
import { useFetchFeed } from "@/hooks/feed/useFetchFeed";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { getUserId, NetworkKind, parseUserId } from "@/networks";
import { feedsTabItems } from "@/utils/social-feed";
import { primaryColor } from "@/utils/style/colors";
import { fontRegular14 } from "@/utils/style/fonts";
import { PostCategory } from "@/utils/types/feed";

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
      networkId: selectedNetworkInfo?.id || "",
      categories: [PostCategory.Flagged],
      user: "",
      mentions: [],
      hashtags: [],
      premiumLevelMin: 0,
      premiumLevelMax: -1,
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
    <View>
      <Tabs
        items={adjustedTabItems}
        selected={selectedTab}
        onSelect={(key) => {
          navigation.navigate("Feed", { tab: key });
        }}
        style={{
          alignItems: "center",
          height: 64,
          zIndex: 9,
          elevation: 9,
        }}
        borderColorTabSelected={primaryColor}
        gradientText
        tabTextStyle={fontRegular14}
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
    </View>
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
