import React from "react";
import { SafeAreaView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MiniArticlePostDetails } from "./components/detailView/MiniArticlePostDetails";
import MiniDefaultPostDetails from "./components/detailView/MiniDefaultPostDetails";
import { MiniVideoPostDetails } from "./components/detailView/MiniVideoPostDetails";
import CustomAppBar from "../components/AppBar/CustomAppBar";

import { BrandText } from "@/components/BrandText";
import { NotFound } from "@/components/NotFound";
import { Spinner } from "@/components/Spinner";
import { BackButton } from "@/components/navigation/components/BackButton";
import { usePost } from "@/hooks/feed/usePost";
import { convertLegacyPostId } from "@/utils/feed/queries";
import { ScreenFC } from "@/utils/navigation";
import { layout, MOBILE_HEADER_HEIGHT } from "@/utils/style/layout";
import { PostCategory } from "@/utils/types/feed";

export const FeedDetailsView: ScreenFC<"FeedPostView"> = ({ route }) => {
  const { id: idParam } = route.params;
  const postId = convertLegacyPostId(idParam);
  const { post, isLoading, refetch } = usePost(postId);
  const label = post?.category === PostCategory.Video ? "Video" : "Post";
  const safeAreaInset = useSafeAreaInsets();

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#000",
          flex: 1,
          paddingTop: safeAreaInset.top,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: MOBILE_HEADER_HEIGHT,
            maxHeight: MOBILE_HEADER_HEIGHT,
            gap: layout.spacing_x1_5,
            paddingHorizontal: layout.spacing_x2,
          }}
        >
          <BackButton type="chevron" />
          <BrandText>{label}</BrandText>
        </View>
        <View
          style={{ alignItems: "center", marginVertical: layout.spacing_x5 }}
        >
          <Spinner />
        </View>
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
  if (post.category === PostCategory.Video) {
    return <MiniVideoPostDetails post={post} refetchPost={refetch} />;
  }
  if (post.category === PostCategory.Article) {
    return <MiniArticlePostDetails post={post} refetchPost={refetch} />;
  }
  return <MiniDefaultPostDetails post={post} refetchPost={refetch} />;
};
