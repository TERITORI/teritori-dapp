import { View } from "react-native";

import { MiniCommentInput } from "../components/MiniCommentInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { SpacerColumn } from "@/components/spacer";
import { ScreenFC } from "@/utils/navigation";
import { neutral00 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

const MiniCreatePostScreen: ScreenFC<"MiniCreatePost"> = () => {
  return (
    <BlurScreenContainer background={neutral00} title="Create Post">
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <SpacerColumn size={1.5} />
        <MiniCommentInput type="post" />
      </View>
    </BlurScreenContainer>
  );
};

export default MiniCreatePostScreen;
