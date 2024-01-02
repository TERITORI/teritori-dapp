import { bech32 } from "bech32";
import React, { useEffect, useMemo } from "react";

import { DAOsUPPScreen } from "./tabScreens/DAOsUPPScreen";
import { FundsUPPScreen } from "./tabScreens/FundsUPPScreen";
import { GnoDemoUPPScreen } from "./tabScreens/GnoDemoUPPScreen";
import { MembersUPPScreen } from "./tabScreens/MembersUPPScreen";
import { MentionsPostsUPPScreen } from "./tabScreens/MentionsPostsUPPScreen";
import { MusicUPPScreen } from "./tabScreens/MusicUPPScreen";
import { NFTsUPPScreen } from "./tabScreens/NFTsUPPScreen";
import { PostsUPPScreen } from "./tabScreens/PostsUPPScreen";
import { ProposalsUPPScreen } from "./tabScreens/ProposalsUPPScreen";
import { QuestsUPPScreen } from "./tabScreens/QuestsUPPScreen";
import { VideosUPPScreen } from "./tabScreens/VideosUPPScreen";
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
import { uppTabItems, UppTabKeys } from "../../utils/upp";

export interface UppTabScreenProps {
  userId: string;
  screenContainerOtherProps: Partial<ScreenContainerProps>;
}

export const UserPublicProfileScreen: ScreenFC<"UserPublicProfile"> = ({
  route: {
    params: { id, tab: tabKey },
  },
}) => {
  const navigation = useAppNavigation();
  const [network, userAddress] = parseUserId(id);
  useForceNetworkSelection(network?.id);
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

  if (
    (tabKey && !uppTabItems[tabKey]) ||
    (network?.kind !== NetworkKind.Gno &&
      (notFound || !userAddress || !bech32.decodeUnsafe(userAddress)))
  ) {
    return (
      <ScreenContainer
        key={`NotFoundUPP ${id}-${tabKey}`} // this key is to reset the screen state when the id changes
        {...screenContainerOtherProps}
        headerChildren={
          <BrandText style={fontSemibold20}>Page not found</BrandText>
        }
      >
        <NotFound label="Page" />
      </ScreenContainer>
    );
  }
  switch (tabKey) {
    case UppTabKeys.posts:
      return (
        <PostsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.mentionsPosts:
      return (
        <MentionsPostsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.music:
      return (
        <MusicUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.videos:
      return (
        <VideosUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.daos:
      return (
        <DAOsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.members:
      return (
        <MembersUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.proposals:
      return (
        <ProposalsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.quests:
      return (
        <QuestsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.nfts:
      return (
        <NFTsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.funds:
      return (
        <FundsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    case UppTabKeys.gnoDemo:
      return (
        <GnoDemoUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
    default:
      return (
        <PostsUPPScreen
          userId={id}
          screenContainerOtherProps={screenContainerOtherProps}
        />
      );
  }
};
