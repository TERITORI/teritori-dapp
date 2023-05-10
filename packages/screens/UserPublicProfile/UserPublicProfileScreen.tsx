import { bech32 } from "bech32";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

import {
  UserPublicProfileScreenHeader,
  screenTabItems,
} from "./UserPublicProfileHeader";
import { PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import { NotFound } from "../../components/NotFound";
import { ScreenContainer } from "../../components/ScreenContainer";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { UPPNFTs } from "../../components/userPublicProfile/UPPNFTs";
import { UPPQuests } from "../../components/userPublicProfile/UPPSucceedQuests";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { parseNetworkObjectId, parseUserId } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { setDocumentTitle } from "../../utils/setDocumentTitle";
import { fontSemibold20 } from "../../utils/style/fonts";

const TabContainer: React.FC = ({ children }) => {
  const { width } = useMaxResolution();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={{ width }}>{children}</View>
    </View>
  );
};

const SelectedTabContent: React.FC<{
  userId: string;
  selectedTab: keyof typeof screenTabItems;
  setSelectedTab: (tab: keyof typeof screenTabItems) => void;
}> = ({ userId, selectedTab, setSelectedTab }) => {
  const selectedWallet = useSelectedWallet();
  const [, userAddress] = parseNetworkObjectId(userId);
  const userInfo = useNSUserInfo(userId);
  const feedRequestUser: PostsRequest = useMemo(() => {
    return {
      filter: {
        user: userId,
        mentions: [],
        categories: [],
        hashtags: [],
      },
      limit: 10,
      offset: 0,
    };
  }, [userId]);

  const feedRequestMentions: PostsRequest = useMemo(() => {
    return {
      filter: {
        user: "",
        mentions: userInfo?.metadata.tokenId
          ? // The user can be mentioned by his NS name OR his address, so we use both in this filter
            [`@${userAddress}`, `@${userInfo?.metadata.tokenId}`]
          : // Btw, is the user has no NS name, we use his address in this filter
            [`@${userAddress}`],
        categories: [],
        hashtags: [],
      },
      limit: 10,
      offset: 0,
    };
  }, [userInfo?.metadata.tokenId, userAddress]);

  switch (selectedTab) {
    case "userPosts":
      return (
        <NewsFeed
          Header={() => (
            <UserPublicProfileScreenHeader
              userId={userId}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}
          additionalMention={
            selectedWallet?.address !== userAddress
              ? userInfo?.metadata.tokenId || userAddress
              : undefined
          }
          req={feedRequestUser}
        />
      );
    case "mentionsPosts":
      return (
        <NewsFeed
          Header={() => (
            <UserPublicProfileScreenHeader
              userId={userId}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}
          additionalMention={
            selectedWallet?.address !== userAddress
              ? userInfo?.metadata.tokenId || userAddress
              : undefined
          }
          req={feedRequestMentions}
        />
      );
    case "nfts":
      return <UPPNFTs userId={userId} />;
    // case "activity":
    //   return <UPPActivity />;
    case "quests":
      return <UPPQuests userId={userId} />;
    // case "pathwar":
    //   return <UPPPathwarChallenges />;
    // case "gig":
    //   return <UPPGigServices />;
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
    useState<keyof typeof screenTabItems>("userPosts");

  const navigation = useAppNavigation();
  const [network, userAddress] = parseUserId(id);
  const { metadata, notFound } = useNSUserInfo(id);
  setDocumentTitle(`User: ${metadata?.tokenId}`);

  return (
    <ScreenContainer
      key={`UserPublicProfile ${id}`} // this key is to reset the screen state when the id changes
      forceNetworkId={network?.id}
      smallMargin
      isHeaderSmallMargin
      responsive
      fullWidth
      noScroll={selectedTab === "userPosts" || selectedTab === "mentionsPosts"}
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
        <NotFound label="User" />
      ) : (
        <>
          {selectedTab !== "userPosts" && selectedTab !== "mentionsPosts" ? (
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
