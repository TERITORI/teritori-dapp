import { bech32 } from "bech32";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View } from "react-native";

import {
  screenTabItems,
  UserPublicProfileScreenHeader,
} from "./UserPublicProfileHeader";
import { PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import { NotFound } from "../../components/NotFound";
import { Quests } from "../../components/Quests";
import { ScreenContainer } from "../../components/ScreenContainer";
import { DAOMembers } from "../../components/dao/DAOMembers";
import { DAOProposals } from "../../components/dao/DAOProposals";
import { DAOsList } from "../../components/dao/DAOsList";
import { GnoDemo } from "../../components/dao/GnoDemo";
import { MusicList } from "../../components/music/MusicList";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { UPPNFTs } from "../../components/userPublicProfile/UPPNFTs";
import { VideosList } from "../../components/video/VideosList";
import { useIsDAO } from "../../hooks/cosmwasm/useCosmWasmContractInfo";
import { useIsDAOMember } from "../../hooks/dao/useDAOMember";
import { useMaxResolution } from "../../hooks/useMaxResolution";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { usePrevious } from "../../hooks/usePrevious";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, parseUserId } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";
import { Assets } from "../WalletManager/Assets";

const TabContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  const userInfo = useNSUserInfo(userId);
  const [network, userAddress] = parseUserId(userId);
  const { isDAO } = useIsDAO(userId);
  const { isDAOMember } = useIsDAOMember(userId, selectedWallet?.userId, isDAO);
  const isCurrentUser = userId === selectedWallet?.userId;
  const userName =
    userInfo?.metadata.public_name || userInfo?.metadata.tokenId || userAddress;

  const feedRequestUserPosts: Partial<PostsRequest> = useMemo(() => {
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

  const feedRequestMentions: Partial<PostsRequest> = useMemo(() => {
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

  const Header = useCallback(() => {
    return (
      <UserPublicProfileScreenHeader
        userId={userId}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    );
  }, [selectedTab, setSelectedTab, userId]);

  switch (selectedTab) {
    case "userPosts":
      return (
        <NewsFeed
          disablePosting={
            isDAO ? !isDAOMember : selectedWallet?.userId !== userId
          }
          daoId={isDAO ? userId : undefined}
          Header={Header}
          additionalMention={
            isDAO
              ? undefined
              : selectedWallet?.address !== userAddress
                ? userInfo?.metadata.tokenId || userAddress
                : undefined
          }
          req={feedRequestUserPosts}
        />
      );
    case "mentionsPosts":
      return (
        <NewsFeed
          disablePosting={
            !selectedWallet?.connected || selectedWallet?.userId === userId
          }
          Header={Header}
          additionalMention={
            selectedWallet?.address !== userAddress
              ? userInfo?.metadata.tokenId || userAddress
              : undefined
          }
          req={feedRequestMentions}
        />
      );
    case "userMusic":
      return (
        <MusicList
          title={isCurrentUser ? "Your music" : "Music by " + userName}
          authorId={userId}
          allowUpload={isCurrentUser}
        />
      );
    case "userVideos":
      return (
        <VideosList
          title={isCurrentUser ? "Your videos" : "Videos by " + userName}
          authorId={userId}
          allowUpload={isCurrentUser}
        />
      );
    case "nfts":
      return <UPPNFTs userId={userId} />;
    // case "activity":
    //   return <UPPActivity />;
    case "quests":
      return <Quests userId={userId} />;
    // case "pathwar":
    //   return <UPPPathwarChallenges />;
    // case "gig":
    //   return <UPPGigServices />;
    case "members":
      return <DAOMembers daoId={userId} />;
    case "proposals":
      return <DAOProposals daoId={userId} />;
    case "funds":
      return <Assets userId={userId} readOnly />;
    case "daos":
      return (
        <DAOsList
          req={{ networkId: network?.id, memberAddress: userAddress }}
        />
      );
    case "gnoDemo":
      return <GnoDemo daoId={userId} />;
    default:
      return null;
  }
};

const initialTab: keyof typeof screenTabItems = "userPosts";

export const UserPublicProfileScreen: ScreenFC<"UserPublicProfile"> = ({
  route: {
    params: { id },
  },
}) => {
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof screenTabItems>(initialTab);
  const isSocialTabSelected = useMemo(
    () => selectedTab === "userPosts" || selectedTab === "mentionsPosts",
    [selectedTab],
  );

  const prevId = usePrevious(id);
  useEffect(() => {
    if (prevId && id !== prevId) {
      setSelectedTab(initialTab);
    }
  }, [id, prevId]);
  const navigation = useAppNavigation();
  const [network, userAddress] = parseUserId(id);
  const { metadata, notFound } = useNSUserInfo(id);
  useEffect(() => {
    navigation.setOptions({
      title: `Teritori - User: ${metadata.tokenId || userAddress}`,
    });
  }, [navigation, userAddress, metadata.tokenId]);

  const content =
    network?.kind !== NetworkKind.Gno &&
    (notFound || !userAddress || !bech32.decodeUnsafe(userAddress)) ? (
      <NotFound label="User" />
    ) : (
      <>
        {!isSocialTabSelected ? (
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
    );

  return (
    <ScreenContainer
      key={`UserPublicProfile ${id}`} // this key is to reset the screen state when the id changes
      forceNetworkId={network?.id}
      responsive
      fullWidth
      noScroll={isSocialTabSelected}
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
      {content}
    </ScreenContainer>
  );
};
