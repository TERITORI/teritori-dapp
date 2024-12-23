import React, { useMemo } from "react";
import { View } from "react-native";

import { PostsRequest } from "@/api/feed/v1/feed";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { MobileTitle } from "@/components/ScreenContainer/ScreenContainerMobile";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { NewsFeed } from "@/components/socialFeed/NewsFeed/NewsFeed";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral22, primaryColor } from "@/utils/style/colors";
import { layout, screenContentMaxWidth } from "@/utils/style/layout";

const Header = ({ hashtag }: { hashtag: string }) => {
  const isMobile = useIsMobile();
  const { width } = useMaxResolution();
  return (
    <View
      style={{
        marginTop: layout.spacing_x2,
        alignSelf: "center",
        alignItems: "center",
        flexDirection: "row",
        width: isMobile ? width : "100%",
        maxWidth: screenContentMaxWidth,
      }}
    >
      <View
        style={{
          height: 60,
          width: 60,
          borderRadius: 30,
          marginRight: layout.spacing_x2,
          backgroundColor: neutral22,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrandText
          style={{
            fontSize: 40,
            color: primaryColor,
          }}
        >
          #
        </BrandText>
      </View>

      <BrandText>{hashtag}</BrandText>
    </View>
  );
};

export const HashtagFeedScreen: ScreenFC<"HashtagFeed"> = ({
  route: {
    params: { hashtag },
  },
}) => {
  const isMobile = useIsMobile();
  const navigation = useAppNavigation();
  const selectedNetworkId = useSelectedNetworkId();
  const feedRequest: Partial<PostsRequest> = useMemo(() => {
    return {
      filter: {
        networkId: selectedNetworkId,
        user: "",
        mentions: [],
        categories: [],
        hashtags: [`#${hashtag}`],
        premiumLevelMin: 0,
        premiumLevelMax: -1,
      },
      limit: 10,
      offset: 0,
    };
  }, [hashtag, selectedNetworkId]);

  return (
    <ScreenContainer
      responsive
      footerChildren={<></>}
      fullWidth
      noScroll
      headerChildren={<ScreenTitle>{`Tag ${hashtag}`}</ScreenTitle>}
      onBackPress={() =>
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Feed")
      }
    >
      <NewsFeed
        additionalHashtag={hashtag}
        req={feedRequest}
        Header={() => (
          <>
            {/* ScreenContainer has noScroll, so we need to add MobileTitle here */}
            {isMobile && <MobileTitle title={`TAG ${hashtag.toUpperCase()}`} />}
            <Header hashtag={`#${hashtag}`} />
          </>
        )}
      />
    </ScreenContainer>
  );
};
