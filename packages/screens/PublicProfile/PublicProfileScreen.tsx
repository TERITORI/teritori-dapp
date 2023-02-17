import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { BackTo } from "../../components/navigation/BackTo";
import { screenTitle } from "../../components/navigation/Navigator";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { useTNSMetadata } from "../../hooks/useTNSMetadata";
import { screenTabItems } from "../../utils/feed";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { layout } from "../../utils/style/layout";
import { FeedHeader } from "../Feed/components/FeedHeader";
import { PublicProfileIntro } from "./PublicProfileIntro";

export interface SelectedTabContentProps {
  selectedTab: keyof typeof screenTabItems;
  Header: React.ComponentType;
}

const SelectedTabContent: React.FC<SelectedTabContentProps> = ({
  selectedTab,
  Header,
}) => {
  switch (selectedTab) {
    case "news":
      return <NewsFeed Header={Header} />;
    default:
      return null;
  }
};

export const PublicProfileScreen: ScreenFC<"PublicProfile"> = ({
  route: {
    params: { id },
  },
}) => {
  const navigation = useAppNavigation();
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("news");
  const { metadata, notFound } = useTNSMetadata(
    id.includes(".tori") ? id : id.replace("tori-", "")
  );

  useEffect(() => {
    if (metadata?.public_name) {
      navigation.setOptions({
        title: screenTitle((metadata?.public_name).toUpperCase()),
      });
    }
  }, [metadata?.public_name]);

  return (
    <ScreenContainer
      fullWidth
      headerChildren={<BackTo label={metadata?.public_name || ""} />}
      footerChildren={<></>}
    >
      {notFound || (!id.startsWith("tori-") && !id.includes(".tori")) ? (
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
          <SelectedTabContent
            selectedTab={selectedTab}
            Header={() => (
              <>
                <PublicProfileIntro
                  userId={id.includes(".tori") ? `@${id}` : id}
                  metadata={metadata}
                />
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
