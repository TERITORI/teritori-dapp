import { bech32 } from "bech32";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

import { PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { UPPActivity } from "../../components/userPublicProfile/UPPActivity";
import { UPPGigServices } from "../../components/userPublicProfile/UPPGigServices";
import { UPPNFTs } from "../../components/userPublicProfile/UPPNFTs";
import { UPPPathwarChallenges } from "../../components/userPublicProfile/UPPPathwarChallenges";
import { UPPQuests } from "../../components/userPublicProfile/UPPSucceedQuests";
import { UserNotFound } from "../../components/userPublicProfile/UserNotFound";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { parseNetworkObjectId, parseUserId } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { setDocumentTitle } from "../../utils/setDocumentTitle";
import { fontSemibold20 } from "../../utils/style/fonts";
import { NEWS_FEED_MAX_WIDTH } from "../../utils/style/layout";
import {
  UserPublicProfileScreenHeader,
  screenTabItems,
} from "./UserPublicProfileHeader";

const TabContainer: React.FC = ({ children }) => (
  <View style={{ flex: 1, alignItems: "center" }}>
    <View style={{ width: "100%", maxWidth: NEWS_FEED_MAX_WIDTH }}>
      {children}
    </View>
  </View>
);

const SelectedTabContent: React.FC<{
  userId: string;
  selectedTab: keyof typeof screenTabItems;
  setSelectedTab: (tab: keyof typeof screenTabItems) => void;
}> = ({ userId, selectedTab, setSelectedTab }) => {
  const selectedWallet = useSelectedWallet();
  const [, userAddress] = parseNetworkObjectId(userId);
  const userInfo = useNSUserInfo(userId);

  const mentionedUser = useMemo(() => {
    if (selectedWallet?.address !== userAddress) {
      return userInfo?.metadata.tokenId || userAddress;
    }
  }, [selectedWallet?.address, userAddress, userInfo?.metadata.tokenId]);

  const feedRequest: PostsRequest = useMemo(() => {
    return {
      filter: {
        //TODO: Get posts filtered by userId (author) AND mentions. On UPP, we want author's posts AND posts where he's mentioned
        user: userId,
        //TODO: Here, if the user get a NS Name, the old posts that have his address as mention will not be fetched. Maybe check (mention) for NS Name in backend ?
        mentions: mentionedUser ? [`@${mentionedUser}`] : [],
        categories: [],
        hashtags: [],
      },
      limit: 10,
      offset: 0,
    };
  }, [userId, mentionedUser]);
  switch (selectedTab) {
    case "social-feed":
      return (
        <NewsFeed
          Header={() => (
            <UserPublicProfileScreenHeader
              userId={userId}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}
          additionalMention={mentionedUser ? `@${mentionedUser}` : undefined}
          req={feedRequest}
        />
      );
    case "nfts":
      return <UPPNFTs userId={userId} />;
    case "activity":
      return <UPPActivity />;
    case "quests":
      return <UPPQuests userId={userId} />;
    case "pathwar":
      return <UPPPathwarChallenges />;
    case "gig":
      return <UPPGigServices />;
    default:
      return null;
  }
};

export const UserPublicProfileScreen: ScreenFC<"UserPublicProfile"> = ({
  route: {
    params: { id },
  },
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>("social-feed");

  const navigation = useAppNavigation();
  const [network, userAddress] = parseUserId(id);
  const { metadata, notFound } = useNSUserInfo(id);
  setDocumentTitle(`User: ${metadata?.tokenId}`);

  return (
    <ScreenContainer
      forceNetworkId={network?.id}
      responsive
      fullWidth
      noScroll={selectedTab === "social-feed"}
      smallMargin
      footerChildren={<></>}
      headerChildren={
        <BrandText style={fontSemibold20}>
          {metadata?.tokenId || userAddress}
        </BrandText>
      }
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Home")
      }
    >
      {notFound || !userAddress || !bech32.decodeUnsafe(userAddress) ? (
        <UserNotFound />
      ) : (
        <>
          {selectedTab !== "social-feed" ? (
            <TabContainer>
              <UserPublicProfileScreenHeader
                userId={id}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
              <SelectedTabContent
                selectedTab={selectedTab}
                userId={id}
                setSelectedTab={setSelectedTab}
              />
            </TabContainer>
          ) : (
            <SelectedTabContent
              selectedTab={selectedTab}
              userId={id}
              setSelectedTab={setSelectedTab}
            />
          )}
        </>
      )}
    </ScreenContainer>
  );
};
