import { FeedPostView } from "./FeedPostView";
import { FeedDetailsView } from "../Mini/Feed/FeedDetailsView";

import { useAppMode } from "@/hooks/useAppMode";
import { ScreenFC } from "@/utils/navigation";

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = (props) => {
  const [appMode] = useAppMode();

  if (appMode === "mini") {
    return <FeedDetailsView {...props} />;
  }
  return <FeedPostView {...props} />;
};
