import React from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";

import { MiniVideoPostDetails } from "./components/MiniVideoPostDetails";
import { BrandText } from "../../../components/BrandText";
import { NotFound } from "../../../components/NotFound";
import { BackButton } from "../../../components/navigation/components/BackButton";
import { PostCategory } from "../../../components/socialFeed/NewsFeed/NewsFeed.type";
import { usePost } from "../../../hooks/feed/usePost";
import { parseNetworkObjectId } from "../../../networks";
import { gnoTeritoriNetwork } from "../../../networks/gno-teritori";
import { teritoriNetwork } from "../../../networks/teritori";
import { ScreenFC } from "../../../utils/navigation";
import { primaryColor } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import CustomAppBar from "../components/AppBar/CustomAppBar";

const FeedDetailsScreen: ScreenFC<"MiniFeedDetails"> = ({
  navigation,
  route,
}) => {
  const { id } = route.params;
  let [network, postId] = parseNetworkObjectId(id);
  if (!network) {
    // fallback to teritori or gno network if there is no network prefix in the id
    if (id.includes("-")) {
      // teritori ids are uuids
      network = teritoriNetwork;
      postId = id;
    } else {
      // gno ids are integers
      network = gnoTeritoriNetwork;
      postId = id;
    }
  }
  const networkId = network?.id;
  const { post, isLoading, refetch } = usePost(postId, networkId);
  const label = post?.category === PostCategory.Video ? "Video" : "Post";

  if (isLoading) {
    return (
      <SafeAreaView style={{ backgroundColor: "#000", flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x1_5,
            paddingHorizontal: layout.spacing_x2,
          }}
        >
          <BackButton type="chevron" />
          <BrandText>{label}</BrandText>
        </View>
        <ActivityIndicator
          color={primaryColor}
          size="large"
          style={{ marginTop: layout.spacing_x4 }}
        />
      </SafeAreaView>
    );
  }
  if (!post) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#000",
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <View style={{ marginBottom: layout.spacing_x4 }}>
          <CustomAppBar backEnabled title={label} />
        </View>
        <NotFound label={label} />
      </SafeAreaView>
    );
  }
  return (
    <MiniVideoPostDetails
      networkId={networkId}
      post={post}
      refetchPost={refetch}
    />
  );
};

export default FeedDetailsScreen;
