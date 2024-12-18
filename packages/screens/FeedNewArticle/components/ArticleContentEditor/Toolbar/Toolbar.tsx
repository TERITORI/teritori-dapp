import { Dispatch, FC, SetStateAction } from "react";

import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { ModeButtons } from "@/screens/FeedNewArticle/components/ArticleContentEditor/Toolbar/ModeButtons";
import { ContentMode } from "@/utils/feed/markdown";
import { neutral11 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";

interface Props {
  setMode: Dispatch<SetStateAction<ContentMode>>;
  mode: ContentMode;
}

export const Toolbar: FC<Props> = ({ setMode, mode }) => {
  return (
    <TertiaryBox
      style={{
        flexDirection: "row",
        alignSelf: "center",
        padding: layout.spacing_x1,
        backgroundColor: neutral11,
      }}
    >
      <ModeButtons setMode={setMode} mode={mode} />
    </TertiaryBox>
  );
};
