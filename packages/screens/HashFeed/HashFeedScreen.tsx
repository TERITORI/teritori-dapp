import React, { useMemo } from "react";
import { View } from "react-native";

import { PostsRequest } from "../../api/feed/v1/feed";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { NewsFeed } from "../../components/socialFeed/NewsFeed/NewsFeed";
import { ScreenFC } from "../../utils/navigation";
import { neutral22, primaryColor } from "../../utils/style/colors";
import { layout } from "../../utils/style/layout";

const Header = ({ hashtag }: { hashtag: string }) => (
  <View
    style={{
      height: 80,
      alignItems: "center",
      flexDirection: "row",
    }}
  >
    <View
      style={{
        height: 60,
        width: 60,
        borderRadius: 30,
        marginRight: layout.padding_x2,
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

export const HashFeedScreen: ScreenFC<"HashFeed"> = ({
  route: {
    params: { id: hash },
  },
}) => {
  const hashtag = useMemo(() => `#${hash}`, [hash]);
  const feedRequest: PostsRequest = useMemo(() => {
    return {
      filter: {
        user: "",
        mentions: [],
        categories: [],
        hashtags: [hashtag],
      },
      limit: 10,
      offset: 0,
    };
  }, [hashtag]);

  return (
    <ScreenContainer responsive footerChildren={<></>} fullWidth noScroll>
      <NewsFeed
        additionalHashtag={hashtag}
        req={feedRequest}
        Header={() => <Header hashtag={hashtag} />}
      />
    </ScreenContainer>
  );
};
