import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { screenTitle } from "../../components/navigation/Navigator";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { FeedRequest } from "../../hooks/useFetchFeed";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { NetworkKind, parseNetworkObjectId } from "../../networks";
import { feedTabToCategories, screenTabItems } from "../../utils/feed";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { FeedHeader } from "../Feed/components/FeedHeader";
import { PublicProfileIntro } from "./PublicProfileIntro";

export const PublicProfileScreen: ScreenFC<"PublicProfile"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("all");
  const [, userAddress] = parseNetworkObjectId(id);
  const ownerNSInfo = useNSUserInfo(id);

  useEffect(() => {
    if (ownerNSInfo.metadata.public_name) {
      navigation.setOptions({
        // TODO: If org, make it uppercase
        title: screenTitle(ownerNSInfo.metadata.public_name),
      });
    }
  }, [ownerNSInfo.metadata.public_name]);

  const feedRequest: FeedRequest = useMemo(() => {
    return {
      user: userAddress,
      categories: feedTabToCategories(selectedTab),
    };
  }, [userAddress, selectedTab]);

  return (
    <ScreenContainer
      forceNetworkKind={NetworkKind.Cosmos}
      responsive
      fullWidth
      noScroll
      headerChildren={
        <BrandText style={fontSemibold20}>
          {ownerNSInfo.metadata.public_name}
        </BrandText>
      }
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Feed")
      }
      footerChildren={<></>}
    >
      {ownerNSInfo.notFound || !userAddress ? (
        <View
          style={{
            alignItems: "center",
            width: "100%",
            marginTop: layout.padding_x4,
          }}
        >
          <BrandText>User not found</BrandText>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <NewsFeed
            req={feedRequest}
            Header={() => (
              <>
                <PublicProfileIntro metadata={ownerNSInfo.metadata} />
                <FeedHeader
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                />
              </>
            )}
          />
        </View>
      )}
    </ScreenContainer>
  );
};
