import { Dispatch, FC, SetStateAction } from "react";

import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { ModeButtons } from "@/screens/FeedNewArticle/components/ArticleContentEditor/Toolbar/ModeButtons";
import { ContentMode } from "@/utils/feed/markdown";
import { neutral17 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

interface Props {
  setMode: Dispatch<SetStateAction<ContentMode>>;
  mode: ContentMode;
}

export const toolbarBackgroundColor = neutral17;

export const Toolbar: FC<Props> = ({ setMode, mode }) => {
  return (
    <TertiaryBox
      style={{
        flexDirection: "row",
        alignSelf: "center",
        height: 48,
        alignItems: "center",
        paddingHorizontal: layout.spacing_x1,
        backgroundColor: toolbarBackgroundColor,
      }}
    >
      <ModeButtons setMode={setMode} mode={mode} />
    </TertiaryBox>
  );
};
