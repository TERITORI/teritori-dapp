import { bech32 } from "bech32";
import React, { useEffect, useMemo } from "react";

import { DAOMembersUPPScreen } from "./DAOMembersUPPScreen";
import { DAOProposalsUPPScreen } from "./DAOProposalsUPPScreen";
import { DAOsUPPScreen } from "./DAOsUPPScreen";
import { FeedMentionsPostsUPPScreen } from "./FeedMentionsPostsUPPScreen";
import { FeedMusicUPPScreen } from "./FeedMusicUPPScreen";
import { FeedPostsUPPScreen } from "./FeedPostsUPPScreen";
import { FeedVideosUPPScreen } from "./FeedVideosUPPScreen";
import { FundsUPPScreen } from "./FundsUPPScreen";
import { GnoDemoUPPScreen } from "./GnoDemoUPPScreen";
import { NFTsUPPScreen } from "./NFTsUPPScreen";
import { QuestsUPPScreen } from "./QuestsUPPScreen";
import { BrandText } from "../../components/BrandText";
import { NotFound } from "../../components/NotFound";
import {
  ScreenContainer,
  ScreenContainerProps,
} from "../../components/ScreenContainer";
import { useForceNetworkSelection } from "../../hooks/useForceNetworkSelection";
import { useNSUserInfo } from "../../hooks/useNSUserInfo";
import { NetworkKind, parseUserId } from "../../networks";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";
import { fontSemibold20 } from "../../utils/style/fonts";
import { DEFAULT_UPP_TAB } from "../../utils/upp";

export const UserPublicProfileScreen: ScreenFC<"UserPublicProfile"> = ({
  route: {
    params: { id, tab, network: routeNetwork },
  },
}) => {
  const navigation = useAppNavigation();
  const [network, userAddress] = parseUserId(id);
  useForceNetworkSelection(routeNetwork || network?.id);
  const { metadata, notFound } = useNSUserInfo(id);
  const screenContainerOtherProps: Partial<ScreenContainerProps> =
    useMemo(() => {
      return {
        forceNetworkId: network?.id,
        responsive: true,
        fullWidth: true,
        footerChildren: <></>,
        headerChildren: (
          <BrandText style={fontSemibold20}>
            {metadata?.tokenId || userAddress}
          </BrandText>
        ),
        onBackPress: () =>
          navigation.canGoBack()
            ? navigation.goBack()
            : navigation.navigate("Home"),
      };
    }, [network?.id, metadata?.tokenId, userAddress, navigation]);

  useEffect(() => {
    navigation.setOptions({
      title: `Teritori - User: ${metadata.tokenId || userAddress}`,
    });
  }, [navigation, userAddress, metadata.tokenId]);

  useEffect(() => {
    if (!tab)
      navigation.replace("UserPublicProfile", { id, tab: DEFAULT_UPP_TAB });
  }, [tab, id, navigation]);

  if (
    network?.kind !== NetworkKind.Gno &&
    (notFound || !userAddress || !bech32.decodeUnsafe(userAddress))
  ) {
    return (
      <ScreenContainer
        key={`NotFoundUPP ${id}`} // this key is to reset the screen state when the id changes
        {...screenContainerOtherProps}
        headerChildren={
          <BrandText style={fontSemibold20}>User not found</BrandText>
        }
      >
        <NotFound label="User" />
      </ScreenContainer>
    );
  }
  switch (tab) {
    case "feedPosts":
      return (
        <FeedPostsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case "feedMentionsPosts":
      return (
        <FeedMentionsPostsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case "feedMusic":
      return (
        <FeedMusicUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case "feedVideos":
      return (
        <FeedVideosUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );

    case "daos":
      return (
        <DAOsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case "daosMembers":
      return (
        <DAOMembersUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case "daosProposals":
      return (
        <DAOProposalsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );

    case "quests":
      return (
        <QuestsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case "nfts":
      return (
        <NFTsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case "funds":
      return (
        <FundsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case "gnoDemo":
      return (
        <GnoDemoUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );

    default:
      return (
        <FeedPostsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
  }
};
