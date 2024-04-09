import { FeedPostView } from "./FeedPostView";
import { FeedDetailsView } from "../Mini/Feed/FeedDetailsView";

import { useIsMiniMode } from "@/hooks/useAppMode";
import { ScreenFC } from "@/utils/navigation";

export const FeedPostViewScreen: ScreenFC<"FeedPostView"> = (props) => {
  const isMiniMode = useIsMiniMode();

  if (isMiniMode) {
    return <FeedDetailsView {...props} />;
  }
  return <FeedPostView {...props} />;
};
